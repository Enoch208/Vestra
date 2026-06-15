import { createWalletClient, createPublicClient, http, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { celo } from "./web3/chains";
import { VAULT, vaultAbi } from "./web3/contracts";

const RPC = process.env.NEXT_PUBLIC_CELO_RPC_URL ?? "https://forno.celo.org";

export async function agentSetVerified(user: `0x${string}`): Promise<Hex> {
  const pk = process.env.AGENT_PRIVATE_KEY as Hex | undefined;
  if (!pk) throw new Error("AGENT_PRIVATE_KEY not configured on the server");

  const account = privateKeyToAccount(pk);
  const publicClient = createPublicClient({ chain: celo, transport: http(RPC) });
  const walletClient = createWalletClient({ account, chain: celo, transport: http(RPC) });

  const { request } = await publicClient.simulateContract({
    account,
    address: VAULT,
    abi: vaultAbi,
    functionName: "setVerified",
    args: [user, true],
  });
  return walletClient.writeContract(request);
}
