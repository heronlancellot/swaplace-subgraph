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
