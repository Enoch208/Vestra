import { createPublicClient, createWalletClient, http, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { celo, celoSepolia } from "viem/chains";
import { RPC_URL } from "../lib/contracts";
import type { Network } from "../lib/erc8004";

export function getClients(network: Network) {
  const pk = process.env.AGENT_PRIVATE_KEY as Hex | undefined;
  if (!pk) throw new Error("AGENT_PRIVATE_KEY required — see backend/.env.example");

  const account = privateKeyToAccount(pk);
  const chain = network === "mainnet" ? celo : celoSepolia;
  const transport = http(RPC_URL[network]);

  return {
    account,
    publicClient: createPublicClient({ chain, transport }),
    walletClient: createWalletClient({ account, chain, transport }),
  };
}
