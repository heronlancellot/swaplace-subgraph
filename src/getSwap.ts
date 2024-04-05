import { Swap, Client, Swaplace, Token } from "./types";

export async function getSwapData(
  client: Client,
  Swaplace: Swaplace,
  swapId: bigint,
) {
  try {
    const contractResponse = await client.readContract({
      abi: Swaplace.abi,
      address: Swaplace.address,
      functionName: "getSwap",
      args: [swapId],
    });

    let config: any = contractResponse.config;
    const expiry: bigint =
      BigInt(config) & ((BigInt(1) << BigInt(96)) - BigInt(1));
    const allowed = (BigInt(config) >> BigInt(96)).toString(16);

    const biding: Token[] = contractResponse.biding.map((token: Token) => ({
      addr: token.addr.toString(),
      amountOrId: token.amountOrId.toString(),
    }));
    const asking: Token[] = contractResponse.asking.map((token: Token) => ({
      addr: token.addr.toString(),
      amountOrId: token.amountOrId.toString(),
    }));

    const strinfiedBid: string = JSON.stringify(biding);
    const strinfiedAsk: string = JSON.stringify(asking);

    let tokenAddresses: string[];
    biding.map((token: Token) => tokenAddresses.push(token.addr.toString()));
    asking.map((token: Token) => tokenAddresses.push(token.addr.toString()));

    const swap: Swap = {
      allowed: allowed,
      expiry: expiry,
      bid: strinfiedBid,
      ask: strinfiedAsk,
    };

    return { swap, tokenAddresses };
  } catch (error) {
    console.log("Failed to create get swap for %s.", swapId, error);
  }
}
