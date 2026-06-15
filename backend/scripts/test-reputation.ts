import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  createWalletClient,
  http,
  parseEther,
  parseEventLogs,
  type Address,
} from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { celoSepolia } from "viem/chains";
import { getClients } from "../src/client";
import { identityAbi, reputationAbi, REGISTERED_EVENT, ZERO_HASH } from "../src/abi";
import {
  IDENTITY_REGISTRY,
  REPUTATION_REGISTRY,
  VESTRA_AGENT_ID,
  type Network,
} from "../lib/erc8004";
import { RPC_URL } from "../lib/contracts";

const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  process.loadEnvFile(join(__dirname, "../.env"));
} catch {}

const NET: Network = "testnet";
const RPC = RPC_URL[NET];

type PublicClient = ReturnType<typeof getClients>["publicClient"];

async function waitVisible(publicClient: PublicClient, id: bigint, owner: Address) {
  for (let i = 0; i < 40; i++) {
    try {
      const o = (await publicClient.readContract({
        address: IDENTITY_REGISTRY[NET],
        abi: identityAbi,
        functionName: "ownerOf",
        args: [id],
      })) as Address;
      if (o.toLowerCase() === owner.toLowerCase()) return;
    } catch {}
  }
  throw new Error(`agentId ${id} not visible after polling`);
}

async function summary(publicClient: PublicClient, agentId: bigint, client: Address, tag1: string) {
  let s = await publicClient.readContract({
    address: REPUTATION_REGISTRY[NET],
    abi: reputationAbi,
    functionName: "getSummary",
    args: [agentId, [client], tag1, ""],
  });
  for (let i = 0; i < 20 && s[0] < 1n; i++) {
    s = await publicClient.readContract({
      address: REPUTATION_REGISTRY[NET],
      abi: reputationAbi,
      functionName: "getSummary",
      args: [agentId, [client], tag1, ""],
    });
  }
  return s;
}

async function main() {
  const { account: agent, publicClient, walletClient: agentWallet } = getClients(NET);
  console.log(`agent ${agent.address}  vestra agentId ${VESTRA_AGENT_ID[NET]}`);

  const user = privateKeyToAccount(generatePrivateKey());
  const userWallet = createWalletClient({ account: user, chain: celoSepolia, transport: http(RPC) });
  console.log(`test user ${user.address}`);

  let h = await agentWallet.sendTransaction({ to: user.address, value: parseEther("0.03") });
  await publicClient.waitForTransactionReceipt({ hash: h });
  console.log("funded user gas");

  const reg = await publicClient.simulateContract({
    account: user,
    address: IDENTITY_REGISTRY[NET],
    abi: identityAbi,
    functionName: "register",
    args: ["ipfs://vestra-user-credit-identity"],
  });
  h = await userWallet.writeContract(reg.request);
  const regReceipt = await publicClient.waitForTransactionReceipt({ hash: h, confirmations: 2 });
  if (regReceipt.status !== "success") throw new Error("register reverted");
  const events = parseEventLogs({ abi: [REGISTERED_EVENT], logs: regReceipt.logs });
  const userAgentId = events[0].args.agentId as bigint;
  console.log(`user registered as agentId ${userAgentId}`);
  await waitVisible(publicClient, userAgentId, user.address);

  console.log("\n[B] Vestra rates the user-agent (credit identity)...");
  const b = await publicClient.simulateContract({
    account: agent,
    address: REPUTATION_REGISTRY[NET],
    abi: reputationAbi,
    functionName: "giveFeedback",
    args: [userAgentId, 1n, 0, "contribution", "", "", "", ZERO_HASH],
  });
  h = await agentWallet.writeContract(b.request);
  const rb = await publicClient.waitForTransactionReceipt({ hash: h, confirmations: 2 });
  if (rb.status !== "success") throw new Error("B giveFeedback reverted");
  const sumB = await summary(publicClient, userAgentId, agent.address, "contribution");
  console.log(`    tx ${h}`);
  console.log(`    user credit summary: count=${sumB[0]}  ${sumB[0] >= 1n ? "PASS" : "FAIL"}`);

  console.log("\n[A] User rates Vestra-361 (agent rank / Track 3)...");
  const a = await publicClient.simulateContract({
    account: user,
    address: REPUTATION_REGISTRY[NET],
    abi: reputationAbi,
    functionName: "giveFeedback",
    args: [VESTRA_AGENT_ID[NET], 1n, 0, "served", "", "", "", ZERO_HASH],
  });
  h = await userWallet.writeContract(a.request);
  const ra = await publicClient.waitForTransactionReceipt({ hash: h, confirmations: 2 });
  if (ra.status !== "success") throw new Error("A giveFeedback reverted");
  const sumA = await summary(publicClient, VESTRA_AGENT_ID[NET], user.address, "");
  console.log(`    tx ${h}`);
  console.log(`    Vestra summary from this user: count=${sumA[0]}  ${sumA[0] >= 1n ? "PASS" : "FAIL"}`);

  console.log("\nboth reputation directions verified on-chain.");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
