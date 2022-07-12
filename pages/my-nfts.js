import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import Modal from "../components/modal";
import { useRouter } from "next/router";

export default function MyAssets() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [open, setopen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    //TODO: connect to mainnet
    // const web3Modal = new Web3Modal({
    //   network: "mainnet",
    //   cacheProvider: true,
    // })
    // connect to the blockchain
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner(); // account of the user

    // connect to the smart contracts
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const data = await marketContract.fetchMyNFTs();

    // map through all data
    const items = await Promise.all(
      data.map(async (i) => {
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
          tokenURI,
          isRedeemed: i.isRedeemed,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  async function redeemNFT(tokenId) {
    setLoadingState("redeemed");

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner(); // account of the user

    // connect to the smart contracts
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer
    );

    const isRedeemed = await marketContract.redeemNFT(tokenId);
    setTimeout(() => {
      setLoadingState("loaded");
      router.push("/my-nfts");
    }, 10000);
  }

  if (loadingState === "loaded" && !nfts.length) {
    return <h1 className="py-10 px-20 text-3xl">Noch keine Gutscheine!</h1>;
  }

  if (loadingState === "redeemed") {
    return (
      <h1 className="py-10 px-20 text-3xl">Gutschein wird eingelöst...</h1>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {/* // map through all items */}
          {nfts.map((nft, i) => {
            let classname =
              "w-full bg-blue-500 text-white font-bold py-2 px-12 rounded";
            let text = "Gutschein einlösen";
            if (nft.isRedeemed) {
              classname =
                "w-full bg-red-500 text-white font-bold py-2 px-12 rounded";
              text = "Gutschein eingelöst";
            }
            return (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <Image
                  src={nft.image}
                  alt="Picture of the author"
                  className="rounded"
                  width={350}
                  height={300}
                  // blurDataURL="data:..." automatically provided
                  // placeholder="blur" // Optional blur-up while loading
                />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white mb-4">
                    Preis - {nft.price} ETH
                  </p>
                  <button
                    className={classname}
                    onClick={() => {
                      if (!nft.isRedeemed) {
                        redeemNFT(nft.tokenId);
                      }
                    }}
                  >
                    {text}
                  </button>
                  <button
                    className="w-full bg-white text-blue-500 font-bold py-2 px-12 mt-4 rounded"
                    onClick={() => setopen(true)}
                  >
                    Gutschein Info
                  </button>
                </div>
                <Modal nft={nft} open={open} setOpen={setopen} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
