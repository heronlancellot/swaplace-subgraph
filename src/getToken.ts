import { ERC20Abi } from "../abis/ERC20";
import { ERC721Abi } from "../abis/ERC721";
import { Client, Token, TokenType } from "./types";

async function getBaseURI(tokenURI: string): Promise<string> {
  let baseURI = "";

  if (tokenURI.includes("ipfs://")) {
    let biggestLength = 0;
    let biggestLengthIndex = 0;

    for (let i = 0; i < tokenURI.length; i++) {
      const element: string = tokenURI[i] as string;

      if (element.length > biggestLength) {
        biggestLength = element.length;
        biggestLengthIndex = i;
      }
    }

    baseURI = "ipfs://" + tokenURI[biggestLengthIndex];
  }

  return baseURI;
}

export async function getTokenData(
  client: Client,
  tokenAddress: string,
): Promise<Token> {
  let token: Token = {} as Token;
  token.address = tokenAddress;

  try {
    const contractResponse = await client.readContract({
      abi: ERC20Abi,
      address: tokenAddress,
      functionName: "name",
      args: [],
      cache: "immutable",
    });
    token.name = contractResponse;
  } catch (error) {
    token.name = "";
    console.log("Failed to fetch token name for contract %s.", tokenAddress);
  }

  try {
    const contractResponse = await client.readContract({
      abi: ERC20Abi,
      address: tokenAddress,
      functionName: "symbol",
      args: [],
      cache: "immutable",
    });
    token.symbol = contractResponse.toString();
  } catch (error) {
    token.symbol = "";
    console.log("Failed to fetch token symbol for contract %s.", tokenAddress);
  }

  try {
    const contractResponse = await client.readContract({
      abi: ERC20Abi,
      address: tokenAddress,
      functionName: "decimals",
      args: [],
      cache: "immutable",
    });
    token.decimals = contractResponse.toString();
    token.type = TokenType.ERC20;
  } catch (error) {
    token.decimals = "";
    console.log(
      "Failed to fetch token decimals for contract %s. Might be a ERC721.",
      tokenAddress,
    );
    try {
      const contractResponse = await client.readContract({
        abi: ERC721Abi,
        address: tokenAddress,
        functionName: "tokenURI",
        args: [1],
      });
      token.baseUri = await getBaseURI(contractResponse.toString());
      token.type = TokenType.ERC721;
    } catch (error) {
      let errorMessage = error?.toString();
      const erc721NonexistentToken = /ERC721NonexistentToken\(\d+\)/;
      const erc721MetadataPattern =
        /ERC721Metadata: URI query for nonexistent token/;
      if (
        !errorMessage?.match(erc721NonexistentToken) ||
        !errorMessage?.match(erc721MetadataPattern)
      ) {
        token.type = TokenType.UNDEFINED;
        console.log(
          "ERC721: Failed to fetch token baseUri for contract %s. It might not be the right standard",
          tokenAddress,
        );
      } else {
        token.type = TokenType.ERC721;
      }
    }
  }

  return token;
}
