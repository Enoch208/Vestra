import { defineChain } from "viem";

export const celo = defineChain({
  id: Number(process.env.NEXT_PUBLIC_CELO_CHAIN_ID ?? 42220),
  name: "Celo",
  nativeCurrency: {
    name: "Celo",
    symbol: "CELO",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_CELO_RPC_URL ?? "https://forno.celo.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Celoscan",
      url: process.env.NEXT_PUBLIC_CELO_EXPLORER ?? "https://celoscan.io",
    },
  },
});
