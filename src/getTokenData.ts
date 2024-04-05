import { ERC20Abi } from "../abis/ERC20";

interface Client {
  readContract: any;
}

export async function getTokenData(client: Client) {
  const contractResponseTokenSymbol = await client.readContract({
    abi: ERC20Abi,
    address: "ERC20ADDRESS",
    functionName: "symbol",
    args: [],
  });

  let tokenSymbol = contractResponseTokenSymbol.config;

  const contractResponseTokenName = await client.readContract({
    abi: ERC20Abi,
    address: "ERC20ADDRESS",
    functionName: "name",
    args: [],
  });

  let tokenName = contractResponseTokenName.config;

  const contractResponseTokenDecimals = await client.readContract({
    abi: ERC20Abi,
    address: "ERC20ADDRESS",
    functionName: "decimals",
    args: [],
  });

  let tokenDecimals = contractResponseTokenDecimals.config;

  return { tokenSymbol, tokenName, tokenDecimals };
}
