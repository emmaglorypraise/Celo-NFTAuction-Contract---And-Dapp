const hre = require("hardhat");

async function main() {
  const Auction = await hre.ethers.getContractFactory("Auction");
  const auction = await Auction.deploy("0x054342C53eDC254CC66AF6E5af454b47f071B764", 0, 500000000, 4, "0x484BF5CCdFE52C05387dFD4C1d10bA0adC94ed1a");
  await auction.deployed();
  console.log("Auction address deployed to:", auction.address);
}

main();