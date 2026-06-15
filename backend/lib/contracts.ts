import type { Network } from "./erc8004";

type Hex = `0x${string}`;

export const CONTRACTS: Record<Network, { token: Hex; savingsVault: Hex; creditModule: Hex }> = {
  testnet: {
    token: "0x24eD128B46e54d3Cb20F33B5b872073f45E61454",
    savingsVault: "0xab871C4B7DB644f0c447319784662bF9b022811E",
    creditModule: "0x4D7ba5c3a2184AA8979AEF251c49ee8bA30A80BB",
  },
  mainnet: {
    token: "0x0000000000000000000000000000000000000000",
    savingsVault: "0x0000000000000000000000000000000000000000",
    creditModule: "0x0000000000000000000000000000000000000000",
  },
};

export const RPC_URL: Record<Network, string> = {
  testnet: "https://forno.celo-sepolia.celo-testnet.org",
  mainnet: "https://forno.celo.org",
};

export const START_BLOCK: Record<Network, bigint> = {
  testnet: 28193000n,
  mainnet: 0n,
};
