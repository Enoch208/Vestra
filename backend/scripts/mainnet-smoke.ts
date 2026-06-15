import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createWalletClient, http, parseEther, parseUnits, parseEventLogs, type Address } from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { celo } from "viem/chains";
import { getClients } from "../src/client";
import { savingsVaultAbi, erc20Abi, identityAbi, reputationAbi, REGISTERED_EVENT, ZERO_HASH } from "../src/abi";
import { markVerified } from "../src/onboard";
import { findUserAgentId, giveFeedback } from "../src/reputation";
import { CONTRACTS, RPC_URL } from "../lib/contracts";
import { IDENTITY_REGISTRY, REPUTATION_REGISTRY, VESTRA_AGENT_ID, type Network } from "../lib/erc8004";

const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  process.loadEnvFile(join(__dirname, "../.env"));
} catch {}

const NET: Network = "mainnet";
const RPC = RPC_URL[NET];
const C = CONTRACTS[NET];
const DAILY = parseUnits("0.1", 6); // 0.1 USDC

async function main() {
  const clients = getClients(NET);
  const { account: agent, publicClient, walletClient: agentWallet } = clients;
  const wait = (hash: `0x${string}`) => publicClient.waitForTransactionReceipt({ hash, confirmations: 2 });

  const user = privateKeyToAccount(generatePrivateKey());
  const userWallet = createWalletClient({ account: user, chain: celo, transport: http(RPC) });
  console.log(`agent ${agent.address}`);
  console.log(`user  ${user.address}\n`);

  await wait(await agentWallet.sendTransaction({ to: user.address, value: parseEther("0.5") }));
  await wait(
    await agentWallet.writeContract({
      address: C.token,
      abi: erc20Abi,
      functionName: "transfer",
      args: [user.address, parseUnits("0.5", 6)],
    })
  );
  console.log("funded: 0.5 CELO gas + 0.5 USDC");

  await wait(await markVerified(clients, user.address, NET));
  console.log("1) verified");

  const reg = await publicClient.simulateContract({
    account: user,
    address: IDENTITY_REGISTRY[NET],
    abi: identityAbi,
    functionName: "register",
    args: ["ipfs://vestra-user-credit-identity"],
  });
  const regR = await wait(await userWallet.writeContract(reg.request));
  const userAgentId = parseEventLogs({ abi: [REGISTERED_EVENT], logs: regR.logs })[0].args.agentId;
  for (let i = 0; i < 40; i++) {
    try {
      const o = (await publicClient.readContract({
        address: IDENTITY_REGISTRY[NET],
        abi: identityAbi,
        functionName: "ownerOf",
        args: [userAgentId],
      })) as Address;
      if (o.toLowerCase() === user.address.toLowerCase()) break;
    } catch {}
  }
  console.log(`2) registered userAgentId ${userAgentId}`);

  const oa = await publicClient.simulateContract({
    account: user,
    address: C.savingsVault,
    abi: savingsVaultAbi,
    functionName: "openAccount",
    args: [DAILY],
  });
  await wait(await userWallet.writeContract(oa.request));
  console.log("3) account opened (daily 0.1 USDC)");

  const ap = await publicClient.simulateContract({
    account: user,
    address: C.token,
    abi: erc20Abi,
    functionName: "approve",
    args: [C.savingsVault, parseUnits("1000", 6)],
  });
  await wait(await userWallet.writeContract(ap.request));
  console.log("4) allowance granted");

  const pc = await publicClient.simulateContract({
    account: agent,
    address: C.savingsVault,
    abi: savingsVaultAbi,
    functionName: "pullContribution",
    args: [user.address],
  });
  const pcR = await wait(await agentWallet.writeContract(pc.request));
  const acct = await publicClient.readContract({
    address: C.savingsVault,
    abi: savingsVaultAbi,
    functionName: "accounts",
    args: [user.address],
    blockNumber: pcR.blockNumber,
  });
  console.log(`5) agent pulled contribution — vault balance=${acct[0]} (USDC 6dp) streak=${acct[4]}`);

  let fid = await findUserAgentId(publicClient, user.address, NET);
  for (let i = 0; i < 20 && fid === null; i++) fid = await findUserAgentId(publicClient, user.address, NET);
  await wait(await giveFeedback(clients, fid!, "contribution", 1, NET));
  console.log(`6) credit identity written for userAgentId ${fid}`);

  const vouch = await publicClient.simulateContract({
    account: user,
    address: REPUTATION_REGISTRY[NET],
    abi: reputationAbi,
    functionName: "giveFeedback",
    args: [VESTRA_AGENT_ID[NET], BigInt(1), 0, "served", "", "", "", ZERO_HASH],
  });
  await wait(await userWallet.writeContract(vouch.request));
  console.log(`7) user vouched for Vestra agent ${VESTRA_AGENT_ID[NET]}`);

  console.log("\nMAINNET END-TO-END COMPLETE: real contribution + credit identity + vouch for 9387");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
