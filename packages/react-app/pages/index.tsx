import NftAuction from "@/components/NftAuction";

import NFTABI from 'AuctionNFT.json'

require("dotenv").config({ path: ".env" });

export default function Home() {
  return (
    <div>
      <NftAuction nftContractAddress="0x054342C53eDC254CC66AF6E5af454b47f071B764" auctionContractAddress="0xbC433b01dFa3226d0feA29BbCFB9394FE9Ed4211" erc721Abi={NFTABI} />
    </div>
  )
}
