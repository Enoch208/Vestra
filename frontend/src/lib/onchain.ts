import { createPublicClient, http, parseAbi, parseAbiItem, type Address } from "viem";
import { celo } from "./web3/chains";

const RPC = process.env.NEXT_PUBLIC_CELO_RPC_URL ?? "https://forno.celo.org";

export const MAINNET = {
  agentId: "9387",
  vault: "0xf3c25dbd82FE887138B3a589455E4867740a4520" as Address,
  creditModule: "0x24eD128B46e54d3Cb20F33B5b872073f45E61454" as Address,
  usdc: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C" as Address,
  reputation: "0x8004BAa17C55a88189AE136b182e5fdA19dE9b63" as Address,
  startBlock: BigInt(69594000),
  agentUrl: "https://8004scan.io/agents/celo/9387",
  vaultUrl: "https://celoscan.io/address/0xf3c25dbd82FE887138B3a589455E4867740a4520",
};

const erc20Abi = parseAbi(["function balanceOf(address) view returns (uint256)"]);
const reputationAbi = parseAbi(["function getClients(uint256) view returns (address[])"]);
const ACCOUNT_OPENED = parseAbiItem("event AccountOpened(address indexed user, uint64 dailyAmount)");

const client = createPublicClient({ chain: celo, transport: http(RPC) });

export type OnchainStatus = {
  agentId: string;
  network: string;
  vaultUsdc: string;
  savers: number;
  vouches: number;
  contracts: { vault: Address; creditModule: Address; usdc: Address };
  links: { agent: string; vault: string };
};

export async function getOnchainStatus(): Promise<OnchainStatus> {
  const [vaultUsdc, clients, logs] = await Promise.all([
    client.readContract({ address: MAINNET.usdc, abi: erc20Abi, functionName: "balanceOf", args: [MAINNET.vault] }),
    client
      .readContract({ address: MAINNET.reputation, abi: reputationAbi, functionName: "getClients", args: [BigInt(MAINNET.agentId)] })
      .catch(() => [] as readonly Address[]),
    client
      .getLogs({ address: MAINNET.vault, event: ACCOUNT_OPENED, fromBlock: MAINNET.startBlock, toBlock: "latest" })
      .catch(() => []),
  ]);

  const savers = new Set(logs.map((l) => l.args.user).filter(Boolean)).size;

  return {
    agentId: MAINNET.agentId,
    network: "Celo mainnet",
    vaultUsdc: (Number(vaultUsdc) / 1e6).toFixed(2),
    savers,
    vouches: clients.length,
    contracts: { vault: MAINNET.vault, creditModule: MAINNET.creditModule, usdc: MAINNET.usdc },
    links: { agent: MAINNET.agentUrl, vault: MAINNET.vaultUrl },
  };
}
