import { ponder } from "@/generated";
import { getSwapData } from "./getSwap";
import { getEnsData } from "./getEns";
import { getTokenData } from "./getToken";
import { Swap, Token } from "./types";

ponder.on("Swaplace:SwapCreated", async ({ event, context }) => {
  const { client } = context;
  const { Swaplace } = context.contracts;
  const {
    SwapDatabase,
    ProfileDatabase,
    EnsDatabase,
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
          swapId: swapId,
          owner: owner,
          allowed: `0x${swap.allowed}`,
          expiry: swap.expiry,
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

            let aaa = `0x${tokenAddresses[i]?.split("0x")[1]}`;
            let bbb = `0x${token.address?.split("0x")[1]}`;
            console.log("AAAAAAAAAAAA %s %s", aaa, bbb);

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
      await ProfileDatabase.create({
        id: owner,
        data: {
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
      await ProfileDatabase.update({
        id: owner,
        data: {
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

  /// @dev Creates a new entry in the EnsDatabase with the owner reverse record.
  try {
    const primaryName = await getEnsData(client, owner);

    await EnsDatabase.upsert({
      id: `0x${owner}`,

      create: {
        ensName: primaryName,
        ensAvatar: `https: metadata.ens.domains/mainnet/avatar/${primaryName}`,
      },

      update: {
        ensName: primaryName,
        ensAvatar: `https: metadata.ens.domains/mainnet/avatar/${primaryName}`,
      },
    });
  } catch (error) {
    console.log(
      "Failed to create EnsDatabase entry for address %s. Error: %s",
      owner,
      error,
    );
  }
});

// ponder.on("Swaplace:SwapCanceled", async ({ event, context }) => {
//   const { SwapDatabase } = context.db;
//   const { swapId } = event.args;

//   try {
//     await SwapDatabase.update({
//       id: swapId,
//       data: {
//         status: "CANCELED",
//       },
//     });
//   } catch (error) {
//     console.log("Error updating SwapDatabase. Creating new entry instead.");
//     const { client } = context;
//     const { Swaplace } = context.contracts;
//     const { swapId, owner } = event.args;

//     const { expiry, allowed, strinfiedBid, strinfiedAsk } = await getSwapData(
//       client,
//       Swaplace,
//       swapId,
//     );

//     await SwapDatabase.create({
//       id: swapId,
//       data: {
//         blockTimestamp: event.block.timestamp,
//         transactionHash: event.transaction.hash,
//         status: "CANCELED",
//         swapId: swapId,
//         owner: owner,
//         allowed: `0x${allowed}`,
//         expiry: expiry,
//         bid: strinfiedBid,
//         ask: strinfiedAsk,
//       },
//     });
//   } finally {
//     console.log("SwapDatabase updated successfully.");
//   }
// });

// ponder.on("Swaplace:SwapAccepted", async ({ event, context }) => {
//   const { SwapDatabase } = context.db;
//   const { swapId } = event.args;

//   try {
//     await SwapDatabase.update({
//       id: swapId,
//       data: {
//         status: "ACCEPTED",
//       },
//     });
//   } catch (error) {
//     console.log("Error updating SwapDatabase. Creating new entry instead.");
//     const { client } = context;
//     const { Swaplace } = context.contracts;
//     const { swapId, owner } = event.args;
//     const { expiry, allowed, strinfiedBid, strinfiedAsk } = await getSwapData(
//       client,
//       Swaplace,
//       swapId,
//     );

//     await SwapDatabase.upsert({
//       id: swapId,

//       create: {
//         blockTimestamp: event.block.timestamp,
//         transactionHash: event.transaction.hash,
//         status: "ACCEPTED",
//         swapId: swapId,
//         owner: owner,
//         allowed: `0x${allowed}`,
//         expiry: expiry,
//         bid: strinfiedBid,
//         ask: strinfiedAsk,
//       },

//       update: {
//         status: "ACCEPTED",
//       },
//     });
//   } finally {
//     console.log("SwapDatabase updated successfully.");
//   }
// });
