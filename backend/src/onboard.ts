import { type Address, type Hex } from "viem";
import { savingsVaultAbi } from "./abi";
import { CONTRACTS } from "../lib/contracts";
import type { Network } from "../lib/erc8004";
import type { getClients } from "./client";

type Clients = ReturnType<typeof getClients>;

export async function markVerified(
  clients: Clients,
  user: Address,
  network: Network
): Promise<Hex> {
  const { account, publicClient, walletClient } = clients;
  const { request } = await publicClient.simulateContract({
    account,
    address: CONTRACTS[network].savingsVault,
    abi: savingsVaultAbi,
    functionName: "setVerified",
    args: [user, true],
  });
  return walletClient.writeContract(request);
}

export async function isVerified(
  publicClient: Clients["publicClient"],
  user: Address,
  network: Network
): Promise<boolean> {
  return publicClient.readContract({
    address: CONTRACTS[network].savingsVault,
    abi: savingsVaultAbi,
    functionName: "verified",
    args: [user],
  });
}
