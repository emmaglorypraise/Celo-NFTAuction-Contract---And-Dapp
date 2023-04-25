import { useState, useEffect } from "react";
import Web3 from "web3";

require("dotenv").config({ path: ".env" });

import NFTImage from "../public/one.png"

import NFTAuction from "AuctionNFT.json"

import NFTAuctionContract from "Auction.json"

interface NftProps {
  nftContractAddress: string;
  auctionContractAddress: string;
  erc721Abi: any;
}
function NftAuction({ nftContractAddress, auctionContractAddress, erc721Abi }: NftProps) {
  const [nftImage, setNftImage] = useState<string>("");
  const [auctionTime, setAuctionTime] = useState<number>(0);
  const [auctionStatus, setAuctionStatus] = useState<boolean>(false);

  const [highestBid, setHighestBid] = useState<string>("0");
  const [highestBidder, setHighestBidder] = useState<string>("");

  const [startingPrice, setStartingPrice] = useState<string>("0");
  const [bidAmount, setBidAmount] = useState<string>("0");
  const [account, setAccount] = useState<string>("");

  const web3 = new Web3(Web3.givenProvider as any);
  const auctionContract = new web3.eth.Contract(NFTAuctionContract.abi as any, auctionContractAddress);

  useEffect(() => {
    async function fetchData() {
      const nftContract = new web3.eth.Contract(erc721Abi.abi, nftContractAddress);

      const nftId = 20;

      const nftImageUrl = await nftContract.methods.tokenURI(nftId).call();
      setNftImage(nftImageUrl);


      const auctionTime = await auctionContract.methods.auctionTime().call();
      setAuctionTime(Number(auctionTime));

      const highestBid = await auctionContract.methods.highestBid().call();
      setHighestBid(highestBid);

      const highestBidder = await auctionContract.methods.highestBidder().call();
      setHighestBidder(highestBidder);

      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    }
    fetchData();
  }, [account, auctionContract, erc721Abi, nftContractAddress]);

  const handleBid = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await auctionContract.methods.bid().send({ from: account, value: web3.utils.toWei(bidAmount, "ether") });
    setBidAmount("0");
    window.location.reload();
  };

  const withdrawOutBids = async () => {
    await auctionContract.methods.withdrawOutBids().call()
  };

  const startAuction = async () => {
    await auctionContract.methods.startAuction().call()
  };

  const endAuction = async () => {
    await auctionContract.methods.endAuction().call()
  };



  const updateStartingPrice = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await auctionContract.methods.updateStartingPrice().call()
    window.location.reload();
  };

  const updateAuctionTime = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await auctionContract.methods.updateAuctionTime().call()
    window.location.reload();
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="border-2 border-gray-200 p-4">
        <img src={NFTImage.src} alt="NFT" className="mx-auto" />
      </div>
      <div className="mt-4">
        <p className="text-gray-600">Auction Status : {auctionStatus == true ? "Auction is on" : "Auction is not on"} </p>
        <p className="text-gray-600"> Auction Time: {auctionStatus == true ? new Date(auctionTime * 1000).toLocaleString() : "Aution not started Yet"} </p>
        <p className="text-gray-600">Starting price: {startingPrice}</p>
        <p className="text-gray-600">Highest bid: {web3.utils.fromWei(highestBid, "ether")} ETH</p>
        <p className="text-gray-600">Highest bidder: {highestBidder.length == 0 ? "None Yet" : highestBidder}</p>

        <div className="flex flex-row justify-between my-8 w-full">
        <button className="bg-blue-600 text-white py-1 px-4 ml-2" onClick={startAuction}>Start Auction</button>

<button className="bg-blue-600 text-white py-1 px-4 ml-2" onClick={endAuction}>End Auction</button>

<button onClick={withdrawOutBids} className="bg-blue-600 text-white py-1 px-4 ml-2">Withdraw Your Bid</button>
        </div>

        <form onSubmit={handleBid}>
          <div className="mt-4">
            <label htmlFor="bidAmount" className="block text-gray-600">Place a bid:</label>
            <div className="flex my-3">
              <input type="number" step="0.01" min="0" id="bidAmount" className="border-gray-200 border-2 py-1 px-2 w-full" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} required />
              <button type="submit" className="bg-blue-600 text-white py-1 px-4 ml-2">Place Bid</button>
            </div>
          </div>
        </form>

        <form onSubmit={updateAuctionTime}>
          <div className="mt-4">
            <label htmlFor="bidAmount" className="block text-gray-600">Change Auction Time:</label>

            <div className="flex my-3">
              <input type="number" min="0" className="border-gray-200 border-2 py-1 px-2 w-full" value={auctionTime} onChange={(e) => setAuctionTime(e.target.value)} required />
              <button type="submit" className="bg-blue-600 text-white py-1 px-4 ml-2">Update Auction Time</button>
            </div>
          </div>
        </form>

        <form onSubmit={updateStartingPrice}>
          <div className="mt-4">
            <label htmlFor="bidAmount" className="block text-gray-600">Update Starting Price:</label>

            <div className="flex my-3">
              <input type="text" id="bidAmount" className="border-gray-200 border-2 py-1 px-2 w-full" value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} required />
              <button type="submit" className="bg-blue-600 text-white py-1 px-4 ml-2">Update Starting Price</button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}

export default NftAuction;
