import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { getAddress, type Address } from "viem";
import { getClients } from "./client";
import { savingsVaultAbi, ACCOUNT_OPENED_EVENT, PULL_WINDOW, GRACE } from "./abi";
import { findUserAgentId, giveFeedback } from "./reputation";
import { CONTRACTS, START_BLOCK } from "../lib/contracts";
import type { Network } from "../lib/erc8004";

const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  process.loadEnvFile(join(__dirname, "../.env"));
} catch {}

const NETWORK: Network = "testnet";
const LOOP = process.argv.includes("--loop");
const POLL_MS = 60 * 60 * 1000;

async function discoverUsers(
  publicClient: ReturnType<typeof getClients>["publicClient"],
  vault: Address
): Promise<Address[]> {
  const logs = await publicClient.getLogs({
    address: vault,
    event: ACCOUNT_OPENED_EVENT,
    fromBlock: START_BLOCK[NETWORK],
    toBlock: "latest",
  });
  const set = new Set<string>();
  for (const log of logs) {
    if (log.args.user) set.add(getAddress(log.args.user));
  }
  return [...set] as Address[];
}

async function runOnce() {
  const clients = getClients(NETWORK);
  const { account, publicClient, walletClient } = clients;
  const vault = CONTRACTS[NETWORK].savingsVault;

  const block = await publicClient.getBlock();
  const now = block.timestamp;
  const users = await discoverUsers(publicClient, vault);

  console.log(`[pull] ${new Date().toISOString()} — ${users.length} account(s) discovered`);

  let pulled = 0;
  let skipped = 0;
  let failed = 0;

  for (const user of users) {
    const acct = await publicClient.readContract({
      address: vault,
      abi: savingsVaultAbi,
      functionName: "accounts",
      args: [user],
    });
    const dailyAmount = acct[2];
    const lastPullAt = acct[3];
    const streak = acct[4];
    const active = acct[6];

    if (!active) {
      console.log(`  ${user}  skip (inactive)`);
      skipped++;
      continue;
    }
    if (now < lastPullAt + PULL_WINDOW - GRACE) {
      const nextAt = Number(lastPullAt + PULL_WINDOW - GRACE);
      console.log(`  ${user}  skip (window opens ${new Date(nextAt * 1000).toISOString()})`);
      skipped++;
      continue;
    }

    try {
      const { request } = await publicClient.simulateContract({
        account,
        address: vault,
        abi: savingsVaultAbi,
        functionName: "pullContribution",
        args: [user],
      });
      const hash = await walletClient.writeContract(request);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status !== "success") {
        failed++;
        console.log(`  ${user}  pull FAILED tx=${hash}`);
        continue;
      }
      pulled++;
      console.log(`  ${user}  pull OK  daily=${dailyAmount} streak=${streak} tx=${hash}`);

      const userAgentId = await findUserAgentId(publicClient, user, NETWORK);
      if (userAgentId === null) {
        console.log(`           reputation skipped (user has no ERC-8004 agentId yet)`);
        continue;
      }
      try {
        const fhash = await giveFeedback(clients, userAgentId, "contribution", 1, NETWORK);
        await publicClient.waitForTransactionReceipt({ hash: fhash });
        console.log(`           reputation -> agentId ${userAgentId} (contribution) tx=${fhash}`);
      } catch (e) {
        console.log(`           reputation failed: ${e instanceof Error ? e.message.split("\n")[0] : e}`);
      }
    } catch (err) {
      console.log(`  ${user}  pull skipped (${err instanceof Error ? err.message.split("\n")[0] : err})`);
      skipped++;
    }
  }

  console.log(`[pull] done — pulled=${pulled} skipped=${skipped} failed=${failed}`);
}

async function main() {
  await runOnce();
  if (LOOP) {
    console.log(`[pull] loop mode — re-checking every ${POLL_MS / 60000} min`);
    setInterval(() => {
      runOnce().catch((e) => console.error("[pull] run error:", e));
    }, POLL_MS);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
