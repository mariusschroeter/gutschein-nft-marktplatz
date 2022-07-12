import { useEffect, useState, Fragment } from "react";
import Image from "next/image";
import axios from "axios";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { nftaddress, nftmarketaddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { Dialog, Transition } from "@headlessui/react";
import Modal from "../components/modal";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [showModal, setshowModal] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    // Connection to correct network (for testnet just empty JsonRpcProvider() )
    // const provider = new ethers.providers.JsonRpcProvider(
    //   "https://polygon-mumbai.infura.io/v3/14cb07dda15f4e948e4736a481de6425"
    // );
    const provider = new ethers.providers.JsonRpcProvider();

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider
    );

    const data = await marketContract.fetchMarketItems(); // return an array of unsold market items

    const items = await Promise.all(
      data.map(async (i) => {
        console.log(i);
        const tokenURI = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          nftContract: i.nftContract,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          expiryDate: meta.data.expiryDate,
          tokenURI,
        };
        return item;
      })
    );

    setNfts(items);
    setLoadingState("loaded");
  }

  async function buyNFT(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    // sign the transaction
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    // set the price
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

    // make the sale
    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      { value: price }
    );
    await transaction.wait();

    loadNFTs();
  }

  if (loadingState === "loaded" && !nfts.length)
    return (
      <h1 className="px-20 py-10 text-3xl">
        Noch keine Gutscheine auf dem Marktplatz
      </h1>
    );

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden ">
              <Image src={nft.image} width={500} height={300} />
              <div className="p-4">
                <p
                  style={{ height: "64px" }}
                  className="text-2xl font-semibold"
                >
                  {nft.name}
                </p>
                <div style={{ heigth: "70px", overflow: "hidden" }}>
                  <p className="truncate text-gray-400 overflow-hidden">
                    {nft.description}
                  </p>
                </div>
                <div style={{ heigth: "70px", overflow: "hidden" }}>
                  <p className="text-gray-400">Gültig bis {nft.expiryDate}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-2xl mb-4 font-bold text-white">
                  {nft.price} ETH
                </p>
                <button
                  className="w-full bg-blue-500 text-white font-bold py-2 px-12 rounded"
                  onClick={() => buyNFT(nft)}
                >
                  Gutschein kaufen
                </button>
                <button
                  className="w-full bg-white text-blue-500 font-bold py-2 px-12 mt-4 rounded"
                  onClick={() => setOpen(true)}
                >
                  Gutschein Info
                </button>
              </div>
              <Modal nft={nft} open={open} setOpen={setOpen} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
