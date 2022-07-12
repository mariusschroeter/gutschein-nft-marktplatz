import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { EtherscanProvider } from "@ethersproject/providers";
import { ContractType } from "hardhat/internal/hardhat-network/stack-traces/model";

import { create as ipfsHttpClient } from "ipfs-http-client";
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    name: "",
    description: "",
    price: "",
  });
  const router = useRouter();

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      // try uploading the file
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      // file saved in the path below
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (e) {
      console.log(e);
    }
  }

  // (1) Save Ticket MetaData to IPFS
  // (2) Create Token and
  // (3) Create MarketItem to list it on the market
  async function createItem() {
    if (
      formInput.name != "" &&
      formInput.description != "" &&
      formInput.price != "" &&
      parseInt(formInput.price) > 0
    ) {
      const hash = await saveTicketToIpfs(); // (1) Save Ticket MetaData to IPFS
      const url = `https://ipfs.infura.io/ipfs/${hash}`;

      await createSale(url); // (2) Create Token and (3) Create MarketItem to list it on the market
      router.push("/");
    }
  }

  async function saveTicketToIpfs() {
    const { name, description, price } = formInput; // get the value from the form input
    // form validation
    if (!name || !description || !price || !fileUrl) {
      return;
    }

    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
      expiryDate: "01.01.2023",
    });

    // save ticket metadata to ipfs
    try {
      const added = await client.add(data);
      return added.path;
    } catch (e) {
      console.log("Error uploading file: ", e);
    }
  }

  // list item for sale
  async function createSale(url) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    // sign the transaction
    const signer = provider.getSigner();
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    // (2) Create Token
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();

    // get the tokenId from the transaction that occured above
    // there events array that is returned:
    // the first item from that event is the event,
    // the third item is the tokenId
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    // get a reference to the price entered in the form
    const price = ethers.utils.parseUnits(formInput.price, "ether");

    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    // get the listing price
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    // (3) Create MarketItem to list it on the market
    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    });

    await transaction.wait();
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Gutschein Name"
          className="mt-8 border rounded p-4"
          onChange={(e) => setFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Gutschein Beschreibung"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            setFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Gutschein Preis in Eth"
          className="mt-8 border rounded p-4"
          type="number"
          //TODO: Allow only numbers in the input
          onChange={(e) =>
            setFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {fileUrl && (
          <Image
            src={fileUrl}
            alt="Gutschein Bild"
            className="rounded mt-4"
            width={350}
            height={500}
            // blurDataURL="data:..." automatically provided
            // placeholder="blur" // Optional blur-up while loading
          />
        )}
        <button
          onClick={createItem}
          className="font-bold mt-4 bg-blue-500 text-white rounded p-4 shadow-lg"
        >
          Gutschein erstellen
        </button>
      </div>
    </div>
  );
}
