import { createConfig } from "@ponder/core";
import { http } from "viem";

import { SwaplaceAbi } from "./abis/SwaplaceAbi";

export default createConfig({
  networks: {
    sepolia: {
      chainId: 11155111,
      transport: http(process.env.ALCHEMY_RPC_URL),
    },
  },
  contracts: {
    Swaplace: {
      abi: SwaplaceAbi,
      address: "0xFA682bcE8b1dff8D948aAE9f0fBade82D28E1842",
      network: "sepolia",
      startBlock: 5719042,
    },
  },
});
