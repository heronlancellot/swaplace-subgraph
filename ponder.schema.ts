import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  StatusSwaps: p.createEnum(["CREATED", "ACCEPTED", "CANCELED"]),
  SwapDatabase: p.createTable({
    id: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.hex(),
    status: p.enum("StatusSwaps"),
    swapId: p.bigint(),
    owner: p.hex(),
    allowed: p.hex(),
    expiry: p.bigint(),
    recipient: p.bigint(),
    value: p.bigint(),
    bid: p.string(),
    ask: p.string(),
  }),

  ProfileDatabase: p.createTable({
    id: p.hex(),
    firstInteractionDate: p.bigint(),
    lastInteractionDate: p.bigint(),
    createSwapCount: p.bigint(),
    acceptSwapCount: p.bigint(),
    cancelSwapCount: p.bigint(),
    totalTransactionCount: p.bigint(),
    totalScore: p.bigint(),
  }),

  EnsDatabase: p.createTable({
    id: p.hex(),
    ensName: p.string(),
    ensAvatar: p.string(),
  }),

  TokenType: p.createEnum(["ERC20", "ERC721", "UNDEFINED"]),
  TokenDatabase: p.createTable({
    id: p.hex(),
    type: p.enum("TokenType"),
    name: p.string(),
    symbol: p.string(),
    decimals: p.string(),
    baseUri: p.string(),
  }),

  OverallDatabase: p.createTable({
    id: p.bigint(),
    uniqueAddresses: p.bigint(),
    createSwapCount: p.bigint(),
    acceptSwapCount: p.bigint(),
    cancelSwapCount: p.bigint(),
    totalTransactionCount: p.bigint(),
  }),
}));
