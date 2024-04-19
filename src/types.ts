export interface Swap {
  allowed: string;
  expiry: bigint;
  recipient: bigint;
  value: bigint;
  bid: string;
  ask: string;
}

export interface Client {
  readContract: any;
}

export interface Swaplace {
  abi: any;
  address: string;
}

export interface Asset {
  addr: string;
  amountOrId: string;
}

export enum TokenType {
  ERC20 = "ERC20",
  ERC721 = "ERC721",
  UNDEFINED = "UNDEFINED",
}

export interface Token {
  address: string;
  type: TokenType;
  name: string;
  symbol: string;
  decimals?: string;
  baseUri?: string;
}
