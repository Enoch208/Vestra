import { defineChain } from "viem";

export const celoSepolia = defineChain({
  id: Number(process.env.NEXT_PUBLIC_CELO_CHAIN_ID ?? 11142220),
  name: "Celo Sepolia",
  nativeCurrency: {
    name: "Celo",
    symbol: "CELO",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_CELO_RPC_URL ??
          "https://forno.celo-sepolia.celo-testnet.org",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url:
        process.env.NEXT_PUBLIC_CELO_EXPLORER ??
        "https://celo-sepolia.blockscout.com",
    },
  },
  testnet: true,
});
