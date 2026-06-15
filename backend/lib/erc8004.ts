export type Network = "mainnet" | "testnet";

type Hex = `0x${string}`;

export const IDENTITY_REGISTRY: Record<Network, Hex> = {
  mainnet: "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
  testnet: "0x8004A818BFB912233c491871b3d84c89A494BD9e",
};

export const REPUTATION_REGISTRY: Record<Network, Hex> = {
  mainnet: "0x8004BAa17C55a88189AE136b182e5fdA19dE9b63",
  testnet: "0x8004B663056A597Dffe9eCcC1965A193B7388713",
};

export const VESTRA_AGENT_ID: Record<Network, bigint> = {
  mainnet: 9387n,
  testnet: 361n,
};

export function explorerAgentUrl(network: Network, agentId: string | null): string {
  const slug = network === "mainnet" ? "celo" : "celo-sepolia";
  return `https://8004scan.io/agents/${slug}/${agentId}`;
}
