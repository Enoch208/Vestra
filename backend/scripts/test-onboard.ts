import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createWalletClient, http, parseEther, parseEventLogs, type Address } from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { celoSepolia } from "viem/chains";
import { getClients } from "../src/client";
import {
  savingsVaultAbi,
  erc20Abi,
  identityAbi,
  reputationAbi,
  REGISTERED_EVENT,
} from "../src/abi";
import { markVerified, isVerified } from "../src/onboard";
import { findUserAgentId, giveFeedback } from "../src/reputation";
import { CONTRACTS, RPC_URL } from "../lib/contracts";
import { IDENTITY_REGISTRY, REPUTATION_REGISTRY, type Network } from "../lib/erc8004";

const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  process.loadEnvFile(join(__dirname, "../.env"));
} catch {}

const NET: Network = "testnet";
const RPC = RPC_URL[NET];
const C = CONTRACTS[NET];
const DAILY = parseEther("0.1");

async function main() {
  const clients = getClients(NET);
  const { account: agent, publicClient, walletClient: agentWallet } = clients;
  const wait = (hash: `0x${string}`) =>
    publicClient.waitForTransactionReceipt({ hash, confirmations: 2 });

  const user = privateKeyToAccount(generatePrivateKey());
  const userWallet = createWalletClient({ account: user, chain: celoSepolia, transport: http(RPC) });
  console.log(`agent ${agent.address}`);
  console.log(`user  ${user.address}\n`);

  await wait(await agentWallet.sendTransaction({ to: user.address, value: parseEther("0.04") }));
  await wait(
    await agentWallet.writeContract({
      address: C.token,
      abi: erc20Abi,
      functionName: "mint",
      args: [user.address, parseEther("10")],
    })
  );
  console.log("setup: funded gas + minted 10 tUSD to user");

  await wait(await markVerified(clients, user.address, NET));
  const verified = await isVerified(publicClient, user.address, NET);
  console.log(`1) Self/MiniPay gate -> setVerified: ${verified}`);

  const reg = await publicClient.simulateContract({
    account: user,
    address: IDENTITY_REGISTRY[NET],
    abi: identityAbi,
    functionName: "register",
    args: ["ipfs://vestra-user-credit-identity"],
  });
  const regReceipt = await wait(await userWallet.writeContract(reg.request));
  const userAgentId = parseEventLogs({ abi: [REGISTERED_EVENT], logs: regReceipt.logs })[0].args.agentId;
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
  console.log(`2) registered as ERC-8004 agentId ${userAgentId}`);

  const oa = await publicClient.simulateContract({
    account: user,
    address: C.savingsVault,
    abi: savingsVaultAbi,
    functionName: "openAccount",
    args: [DAILY],
  });
  await wait(await userWallet.writeContract(oa.request));
  console.log("3) opened savings account (daily 0.1)");

  const ap = await publicClient.simulateContract({
    account: user,
    address: C.token,
    abi: erc20Abi,
    functionName: "approve",
    args: [C.savingsVault, parseEther("1000")],
  });
  await wait(await userWallet.writeContract(ap.request));
  const allowance = await publicClient.readContract({
    address: C.token,
    abi: erc20Abi,
    functionName: "allowance",
    args: [user.address, C.savingsVault],
  });
  console.log(`4) granted allowance: ${allowance}`);

  const pc = await publicClient.simulateContract({
    account: agent,
    address: C.savingsVault,
    abi: savingsVaultAbi,
    functionName: "pullContribution",
    args: [user.address],
  });
  const pcReceipt = await wait(await agentWallet.writeContract(pc.request));
  const acct = await publicClient.readContract({
    address: C.savingsVault,
    abi: savingsVaultAbi,
    functionName: "accounts",
    args: [user.address],
    blockNumber: pcReceipt.blockNumber,
  });
  console.log(`5) agent pulled first save -> balance=${acct[0]} streak=${acct[4]}`);

  let fid = await findUserAgentId(publicClient, user.address, NET);
  for (let i = 0; i < 20 && fid === null; i++) fid = await findUserAgentId(publicClient, user.address, NET);
  await wait(await giveFeedback(clients, fid!, "contribution", 1, NET));
  let sum = await publicClient.readContract({
    address: REPUTATION_REGISTRY[NET],
    abi: reputationAbi,
    functionName: "getSummary",
    args: [fid!, [agent.address], "contribution", ""],
  });
  for (let i = 0; i < 20 && sum[0] < 1n; i++) {
    sum = await publicClient.readContract({
      address: REPUTATION_REGISTRY[NET],
      abi: reputationAbi,
      functionName: "getSummary",
      args: [fid!, [agent.address], "contribution", ""],
    });
  }
  console.log(`6) credit identity written -> feedback count=${sum[0]}`);

  const pass =
    verified &&
    acct[6] === true &&
    acct[0] === DAILY &&
    acct[4] === 1 &&
    fid === userAgentId &&
    sum[0] >= 1n;
  console.log(`\nFULL ONBOARDING PIPELINE: ${pass ? "PASS" : "FAIL"}`);
  if (!pass) process.exit(1);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
