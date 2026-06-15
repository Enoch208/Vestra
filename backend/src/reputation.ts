import { type Address, type Hex } from "viem";
import { reputationAbi, REGISTERED_EVENT, ZERO_HASH } from "./abi";
import { IDENTITY_REGISTRY, REPUTATION_REGISTRY, type Network } from "../lib/erc8004";
import { START_BLOCK } from "../lib/contracts";
import type { getClients } from "./client";

type Clients = ReturnType<typeof getClients>;

export async function findUserAgentId(
  publicClient: Clients["publicClient"],
  owner: Address,
  network: Network
): Promise<bigint | null> {
  const logs = await publicClient.getLogs({
    address: IDENTITY_REGISTRY[network],
    event: REGISTERED_EVENT,
    args: { owner },
    fromBlock: START_BLOCK[network],
    toBlock: "latest",
  });
  const last = logs.at(-1);
  return last?.args.agentId ?? null;
}

export async function giveFeedback(
  clients: Clients,
  subjectAgentId: bigint,
  tag1: string,
  value: number,
  network: Network
): Promise<Hex> {
  const { account, publicClient, walletClient } = clients;
  const { request } = await publicClient.simulateContract({
    account,
    address: REPUTATION_REGISTRY[network],
    abi: reputationAbi,
    functionName: "giveFeedback",
    args: [subjectAgentId, BigInt(value), 0, tag1, "", "", "", ZERO_HASH],
  });
  return walletClient.writeContract(request);
}
