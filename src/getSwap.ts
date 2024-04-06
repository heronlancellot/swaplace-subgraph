import { Swap, Client, Swaplace, Asset } from "./types";

export async function getSwapData(
  client: Client,
  Swaplace: Swaplace,
  swapId: bigint,
): Promise<{ swap: Swap; tokenAddresses: string[] } | undefined> {
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

    const biding: Asset[] = contractResponse.biding.map((token: Asset) => ({
      addr: token.addr.toString(),
      amountOrId: token.amountOrId.toString(),
    }));
    const asking: Asset[] = contractResponse.asking.map((token: Asset) => ({
      addr: token.addr.toString(),
      amountOrId: token.amountOrId.toString(),
    }));

    const strinfiedBid: string = JSON.stringify(biding);
    const strinfiedAsk: string = JSON.stringify(asking);

    let tokenAddresses: string[] = [];
    biding.map((token: Asset) => tokenAddresses.push(token.addr.toString()));
    asking.map((token: Asset) => tokenAddresses.push(token.addr.toString()));

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
