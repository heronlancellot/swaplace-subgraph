import { ponder } from "@/generated";
import { getSwapData } from "./getSwap";
//import { getEnsData } from "./getEns";
import { getTokenData } from "./getToken";
import { Swap, Token } from "./types";
import { createConfig } from "@ponder/core";

ponder.on("Swaplace:SwapCreated", async ({ event, context }) => {
  const { client } = context;
  const { Swaplace } = context.contracts;
  const {
    SwapDatabase,
    ProfileDatabase,
    //EnsDatabase,
    TokenDatabase,
    OverallDatabase,
  } = context.db;
  const { swapId, owner } = event.args;
  const { blockNumber } = event.log;

  /// @dev Starts by updating the OverallDatabase by incrementing the counters.
  try {
    const overall = await OverallDatabase.findUnique({
      id: BigInt(0),
    });
    // If there is no entry for the overall database, create one.
    if (overall == null) {
      await OverallDatabase.create({
        id: BigInt(0),
        data: {
          uniqueAddresses: BigInt(0),
          createSwapCount: BigInt(0),
          acceptSwapCount: BigInt(0),
          cancelSwapCount: BigInt(0),
          totalTransactionCount: BigInt(0),
        },
      });
    } else {
      // If there is an entry for the overall database, update it.
      await OverallDatabase.update({
        id: BigInt(0),
        data: {
          createSwapCount: overall.createSwapCount + BigInt(1),
          totalTransactionCount: overall.totalTransactionCount + BigInt(1),
        },
      });
    }
  } catch (error) {
    console.log(
      "Failed to update OverallDatabase with swapId %s. Error: %s",
      swapId,
      error,
    );
  }

  /// @dev Creates a new entry in the SwapDatabase with {Swaplace-getSwap}.
  try {
    const response = await getSwapData(client, Swaplace, swapId);
    let swap: Swap | undefined = response?.swap;
    let tokenAddresses: string[] | undefined = response?.tokenAddresses;

    if (swap != undefined && swap) {
      await SwapDatabase.create({
        id: swapId,
        data: {
          blockTimestamp: event.block.timestamp,
          transactionHash: event.transaction.hash,
          status: "CREATED",
          network: BigInt(context.network.chainId),
          swapId: swapId,
          owner: owner,
          allowed: swap.allowed,
          expiry: swap.expiry,
          recipient: swap.recipient,
          value: swap.recipient,
          bid: swap.bid,
          ask: swap.ask,
        },
      });
    } else {
      console.log("Swap is possible undefined.");
    }

    /// @dev Creates a new entry in the TokenDatabase with the tokens from the
    /// swap bidding and asking.
    if (tokenAddresses != undefined && tokenAddresses) {
      for (let i = 0; i < tokenAddresses.length; i++) {
        try {
          const exists = await TokenDatabase.findUnique({
            id: `0x${tokenAddresses[i]?.split("0x")[1]}`,
          });
          if (exists == null) {
            const token: Token = await getTokenData(
              client,
              tokenAddresses[i] as string,
            );

            await TokenDatabase.create({
              id: `0x${token.address?.split("0x")[1]}`,
              data: {
                type: token.type,
                name: token.name,
                symbol: token.symbol,
                decimals: token.decimals != undefined ? token.decimals : "",
                baseUri: token.baseUri != undefined ? token.baseUri : "",
              },
            });
          }
        } catch (error) {
          console.log(
            "Failed to create TokenDatabase entry for token address %s. Error: %s",
            tokenAddresses[i],
            error,
          );
        }
      }
    } else {
      console.log(
        "Swap is possible undefined therefore tokenAddresses might also be undefined.",
      );
    }
  } catch (error) {
    console.log(
      "Failed to create SwapDatabase entry for address %s. Error: %s",
      owner,
      error,
    );
  }

  /// @dev Creates a new entry in the ProfileDatabase with the owner of the swap.
  try {
    const profile = await ProfileDatabase.findUnique({
      id: owner,
    });
    if (profile == null) {
      let primaryName: string = "";
      // try {
      //   primaryName = await getEnsData(client, owner);
      // } catch (error) {
      //   console.log(
      //     "Failed to get ENS data for address %s. Error: %s",
      //     owner,
      //     error,
      //   );
      // }
      await ProfileDatabase.create({
        id: owner,
        data: {
          ensName: primaryName,
          firstInteractionDate: blockNumber,
          lastInteractionDate: blockNumber,
          createSwapCount: BigInt(1),
          acceptSwapCount: BigInt(0),
          cancelSwapCount: BigInt(0),
          totalTransactionCount: BigInt(1),
          totalScore: BigInt(100),
        },
      });
      // If the profile is created, increment the uniqueAddresses counter.
      const overall = await OverallDatabase.findUnique({
        id: BigInt(0),
      });
      if (overall != null) {
        await OverallDatabase.update({
          id: BigInt(0),
          data: {
            uniqueAddresses: overall.uniqueAddresses + BigInt(1),
          },
        });
      }
    } else {
      let primaryName: string = "";
      // try {
      //   primaryName = await getEnsData(client, owner);
      // } catch (error) {
      //   console.log(
      //     "Failed to get ENS data for address %s. Error: %s",
      //     owner,
      //     error,
      //   );
      // }
      await ProfileDatabase.update({
        id: owner,
        data: {
          ensName: primaryName,
          lastInteractionDate: blockNumber,
          createSwapCount: profile.createSwapCount + BigInt(1),
          totalTransactionCount: profile.totalTransactionCount + BigInt(1),
          totalScore: profile.totalScore + BigInt(10),
        },
      });
    }
  } catch (error) {
    console.log(
      "Failed to create ProfileDatabase entry for address %. Error: %s",
      owner,
      error,
    );
  }
});

ponder.on("Swaplace:SwapAccepted", async ({ event, context }) => {
  const { client } = context;
  const { Swaplace } = context.contracts;
  const { OverallDatabase, ProfileDatabase, SwapDatabase } = context.db;
  const { swapId, owner } = event.args;

  try {
    const response = await getSwapData(client, Swaplace, swapId);
    let swap: Swap | undefined = response?.swap;

    if (swap != undefined && swap) {
      await SwapDatabase.upsert({
        id: swapId,
        create: {
          blockTimestamp: event.block.timestamp,
          transactionHash: event.transaction.hash,
          status: "ACCEPTED",
          network: BigInt(context.network.chainId),
          swapId: swapId,
          owner: owner,
          allowed: swap.allowed,
          expiry: swap.expiry,
          recipient: swap.recipient,
          value: swap.recipient,
          bid: swap.bid,
          ask: swap.ask,
        },
        update: {
          status: "ACCEPTED",
        },
      });
    } else {
      console.log("Swap is possible undefined.");
    }
  } catch (error) {
    console.log(
      "Failed to update SwapDatabase entry for address %s. Error: %s",
      owner,
      error,
    );
  }

  try {
    const overall = await OverallDatabase.findUnique({
      id: BigInt(0),
    });
    if (overall != null) {
      await OverallDatabase.update({
        id: BigInt(0),
        data: {
          acceptSwapCount: overall.acceptSwapCount + BigInt(1),
          totalTransactionCount: overall.totalTransactionCount + BigInt(1),
        },
      });
    }
  } catch (error) {
    console.log(
      "Failed to update OverallDatabase with swapId %s. Error: %s",
      swapId,
      error,
    );
  }

  try {
    const profile = await ProfileDatabase.findUnique({
      id: owner,
    });
    if (profile != null) {
      let primaryName: string = "";
      // try {
      //   primaryName = await getEnsData(client, owner);
      // } catch (error) {
      //   console.log(
      //     "Failed to get ENS data for address %s. Error: %s",
      //     owner,
      //     error,
      //   );
      // }
      await ProfileDatabase.update({
        id: owner,
        data: {
          ensName: primaryName,
          acceptSwapCount: profile.acceptSwapCount + BigInt(1),
          totalTransactionCount: profile.totalTransactionCount + BigInt(1),
          totalScore: profile.totalScore + BigInt(10),
        },
      });
    }
  } catch (error) {
    console.log(
      "Failed to update ProfileDatabase for owner %s. Error: %s",
      owner,
      error,
    );
  }
});

ponder.on("Swaplace:SwapCanceled", async ({ event, context }) => {
  const { client } = context;
  const { Swaplace } = context.contracts;
  const { OverallDatabase, ProfileDatabase, SwapDatabase } = context.db;
  const { swapId, owner } = event.args;

  try {
    const response = await getSwapData(client, Swaplace, swapId);
    let swap: Swap | undefined = response?.swap;

    if (swap != undefined && swap) {
      await SwapDatabase.upsert({
        id: swapId,
        create: {
          blockTimestamp: event.block.timestamp,
          transactionHash: event.transaction.hash,
          status: "CANCELED",
          network: BigInt(context.network.chainId),
          swapId: swapId,
          owner: owner,
          allowed: swap.allowed,
          expiry: swap.expiry,
          recipient: swap.recipient,
          value: swap.recipient,
          bid: swap.bid,
          ask: swap.ask,
        },
        update: {
          status: "CANCELED",
        },
      });
    } else {
      console.log("Swap is possible undefined.");
    }
  } catch (error) {
    console.log(
      "Failed to update SwapDatabase entry for address %s. Error: %s",
      owner,
      error,
    );
  }

  try {
    const overall = await OverallDatabase.findUnique({
      id: BigInt(0),
    });
    if (overall != null) {
      await OverallDatabase.update({
        id: BigInt(0),
        data: {
          cancelSwapCount: overall.cancelSwapCount + BigInt(1),
          totalTransactionCount: overall.totalTransactionCount + BigInt(1),
        },
      });
    }
  } catch (error) {
    console.log(
      "Failed to update OverallDatabase with swapId %s. Error: %s",
      swapId,
      error,
    );
  }

  try {
    const profile = await ProfileDatabase.findUnique({
      id: owner,
    });
    if (profile != null) {
      let primaryName: string = "";
      // try {
      //   primaryName = await getEnsData(client, owner);
      // } catch (error) {
      //   console.log(
      //     "Failed to get ENS data for address %s. Error: %s",
      //     owner,
      //     error,
      //   );
      // }
      await ProfileDatabase.update({
        id: owner,
        data: {
          ensName: primaryName,
          cancelSwapCount: profile.cancelSwapCount + BigInt(1),
          totalTransactionCount: profile.totalTransactionCount + BigInt(1),
        },
      });
    }
  } catch (error) {
    console.log(
      "Failed to update ProfileDatabase for owner %s. Error: %s",
      owner,
      error,
    );
  }
});
