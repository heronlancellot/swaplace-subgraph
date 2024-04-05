export interface Swap {
  allowed: string;
  expiry: bigint;
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

export interface Token {
  addr: string;
  amountOrId: string;
}

export interface Tokens {
  address: string;
  type: string;
  symbol: string;
  name: string;
  decimals?: string;
  baseUri?: string;
}
