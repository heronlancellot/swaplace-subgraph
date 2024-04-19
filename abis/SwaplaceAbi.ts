export const SwaplaceAbi = [
  {
    inputs: [],
    name: "InvalidAddress",
    type: "error",
  },
  { inputs: [], name: "InvalidCall", type: "error" },
  { inputs: [], name: "InvalidExpiry", type: "error" },
  { inputs: [], name: "InvalidValue", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "swapId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "allowed",
        type: "address",
      },
    ],
    name: "SwapAccepted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "swapId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "SwapCanceled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "swapId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "allowed",
        type: "address",
      },
    ],
    name: "SwapCreated",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "swapId", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" },
    ],
    name: "acceptSwap",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "swapId", type: "uint256" }],
    name: "cancelSwap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "config", type: "uint256" },
          {
            components: [
              { internalType: "address", name: "addr", type: "address" },
              { internalType: "uint256", name: "amountOrId", type: "uint256" },
            ],
            internalType: "struct ISwap.Asset[]",
            name: "biding",
            type: "tuple[]",
          },
          {
            components: [
              { internalType: "address", name: "addr", type: "address" },
              { internalType: "uint256", name: "amountOrId", type: "uint256" },
            ],
            internalType: "struct ISwap.Asset[]",
            name: "asking",
            type: "tuple[]",
          },
        ],
        internalType: "struct ISwap.Swap",
        name: "swap",
        type: "tuple",
      },
    ],
    name: "createSwap",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amountOrId", type: "uint256" }],
    name: "decodeAsset",
    outputs: [
      { internalType: "uint16", name: "tokenType", type: "uint16" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "tokenAmount", type: "uint256" },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "config", type: "uint256" }],
    name: "decodeConfig",
    outputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint32", name: "", type: "uint32" },
      { internalType: "uint8", name: "", type: "uint8" },
      { internalType: "uint56", name: "", type: "uint56" },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint120", name: "tokenId", type: "uint120" },
      { internalType: "uint120", name: "tokenAmount", type: "uint120" },
    ],
    name: "encodeAsset",
    outputs: [{ internalType: "uint256", name: "amountOrId", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "allowed", type: "address" },
      { internalType: "uint32", name: "expiry", type: "uint32" },
      { internalType: "uint8", name: "recipient", type: "uint8" },
      { internalType: "uint56", name: "value", type: "uint56" },
    ],
    name: "encodeConfig",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "swapId", type: "uint256" }],
    name: "getSwap",
    outputs: [
      {
        components: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "config", type: "uint256" },
          {
            components: [
              { internalType: "address", name: "addr", type: "address" },
              { internalType: "uint256", name: "amountOrId", type: "uint256" },
            ],
            internalType: "struct ISwap.Asset[]",
            name: "biding",
            type: "tuple[]",
          },
          {
            components: [
              { internalType: "address", name: "addr", type: "address" },
              { internalType: "uint256", name: "amountOrId", type: "uint256" },
            ],
            internalType: "struct ISwap.Asset[]",
            name: "asking",
            type: "tuple[]",
          },
        ],
        internalType: "struct ISwap.Swap",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "addr", type: "address" },
      { internalType: "uint120", name: "tokenId", type: "uint120" },
      { internalType: "uint120", name: "tokenAmount", type: "uint120" },
    ],
    name: "make1155Asset",
    outputs: [
      {
        components: [
          { internalType: "address", name: "addr", type: "address" },
          { internalType: "uint256", name: "amountOrId", type: "uint256" },
        ],
        internalType: "struct ISwap.Asset",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "addr", type: "address" },
      { internalType: "uint256", name: "amountOrId", type: "uint256" },
    ],
    name: "makeAsset",
    outputs: [
      {
        components: [
          { internalType: "address", name: "addr", type: "address" },
          { internalType: "uint256", name: "amountOrId", type: "uint256" },
        ],
        internalType: "struct ISwap.Asset",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "allowed", type: "address" },
      { internalType: "uint32", name: "expiry", type: "uint32" },
      { internalType: "uint8", name: "recipient", type: "uint8" },
      { internalType: "uint56", name: "value", type: "uint56" },
      {
        components: [
          { internalType: "address", name: "addr", type: "address" },
          { internalType: "uint256", name: "amountOrId", type: "uint256" },
        ],
        internalType: "struct ISwap.Asset[]",
        name: "biding",
        type: "tuple[]",
      },
      {
        components: [
          { internalType: "address", name: "addr", type: "address" },
          { internalType: "uint256", name: "amountOrId", type: "uint256" },
        ],
        internalType: "struct ISwap.Asset[]",
        name: "asking",
        type: "tuple[]",
      },
    ],
    name: "makeSwap",
    outputs: [
      {
        components: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "config", type: "uint256" },
          {
            components: [
              { internalType: "address", name: "addr", type: "address" },
              { internalType: "uint256", name: "amountOrId", type: "uint256" },
            ],
            internalType: "struct ISwap.Asset[]",
            name: "biding",
            type: "tuple[]",
          },
          {
            components: [
              { internalType: "address", name: "addr", type: "address" },
              { internalType: "uint256", name: "amountOrId", type: "uint256" },
            ],
            internalType: "struct ISwap.Asset[]",
            name: "asking",
            type: "tuple[]",
          },
        ],
        internalType: "struct ISwap.Swap",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceID", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSwaps",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
