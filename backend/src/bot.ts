import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  createPublicClient,
  http,
  parseAbi,
  parseAbiItem,
  formatUnits,
  isAddress,
  type Address,
} from "viem";
import { celo, celoSepolia } from "viem/chains";
import { CONTRACTS, RPC_URL, START_BLOCK } from "../lib/contracts";
import { REPUTATION_REGISTRY, VESTRA_AGENT_ID, type Network } from "../lib/erc8004";
import { savingsVaultAbi, erc20Abi } from "./abi";

const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  process.loadEnvFile(join(__dirname, "../.env"));
} catch {}

const NETWORK: Network = process.env.NETWORK === "mainnet" ? "mainnet" : "testnet";
const DEC = NETWORK === "mainnet" ? 6 : 18;
const SYMBOL = NETWORK === "mainnet" ? "USDC" : "tUSD";
const C = CONTRACTS[NETWORK];
const APP = "https://vestra-six-self.vercel.app";
const AGENT_URL =
  NETWORK === "mainnet"
    ? "https://8004scan.io/agents/celo/9387"
    : "https://8004scan.io/agents/celo-sepolia/361";

const chain = NETWORK === "mainnet" ? celo : celoSepolia;
const client = createPublicClient({ chain, transport: http(RPC_URL[NETWORK]) });
const repAbi = parseAbi(["function getClients(uint256) view returns (address[])"]);
const ACCOUNT_OPENED = parseAbiItem("event AccountOpened(address indexed user, uint64 dailyAmount)");

const TOKEN = process.env.BOT_TOKEN;
const TG = `https://api.telegram.org/bot${TOKEN}`;

async function send(chatId: number, text: string) {
  await fetch(`${TG}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown", disable_web_page_preview: true }),
  }).catch(() => {});
}

async function agentStats(): Promise<string> {
  const [bal, clients, logs] = await Promise.all([
    client.readContract({ address: C.token, abi: erc20Abi, functionName: "balanceOf", args: [C.savingsVault] }),
    client
      .readContract({ address: REPUTATION_REGISTRY[NETWORK], abi: repAbi, functionName: "getClients", args: [VESTRA_AGENT_ID[NETWORK]] })
      .catch(() => [] as readonly Address[]),
    client.getLogs({ address: C.savingsVault, event: ACCOUNT_OPENED, fromBlock: START_BLOCK[NETWORK], toBlock: "latest" }).catch(() => []),
  ]);
  const savers = new Set(logs.map((l) => l.args.user).filter(Boolean)).size;
  return [
    `*Vestra agent* — ERC-8004 #${VESTRA_AGENT_ID[NETWORK]}`,
    ``,
    `💰 Total saved: *${formatUnits(bal, DEC)} ${SYMBOL}*`,
    `👥 Savers: *${savers}*`,
    `⭐ Onchain vouches: *${clients.length}*`,
    ``,
    `8004scan: ${AGENT_URL}`,
  ].join("\n");
}

async function creditFor(addr: Address): Promise<string> {
  const [acct, verified] = await Promise.all([
    client.readContract({ address: C.savingsVault, abi: savingsVaultAbi, functionName: "accounts", args: [addr] }),
    client.readContract({ address: C.savingsVault, abi: savingsVaultAbi, functionName: "verified", args: [addr] }),
  ]);
  const balance = acct[0];
  const daily = acct[2];
  const streak = acct[4];
  const missed = acct[5];
  const active = acct[6];
  if (!active) {
    return `No Vestra savings account for \`${addr}\` yet.\n\nStart saving → ${APP}/dashboard/onboard`;
  }
  return [
    `*Credit record* \`${addr.slice(0, 10)}…${addr.slice(-4)}\``,
    ``,
    `${verified ? "✅" : "⚠️"} Verified: *${verified}*`,
    `💵 Daily save: *${formatUnits(daily, DEC)} ${SYMBOL}*`,
    `💰 Total saved: *${formatUnits(balance, DEC)} ${SYMBOL}*`,
    `🔥 Streak: *${streak}* days`,
    `❌ Missed: *${missed}*`,
  ].join("\n");
}

const HELP = [
  "*Vestra* — save small daily, build onchain credit on Celo.",
  "",
  "/agent — live stats for the Vestra agent",
  "/credit `<address>` — a wallet's savings + credit record",
  "/save — start saving (opens the app)",
  "/help — this message",
].join("\n");

async function handle(message: { chat: { id: number }; text?: string }) {
  const chatId = message.chat.id;
  const text = (message.text ?? "").trim();
  try {
    if (text.startsWith("/start")) {
      await send(chatId, `Welcome to *Vestra* 🟡\n\n${HELP}`);
    } else if (text.startsWith("/agent")) {
      await send(chatId, await agentStats());
    } else if (text.startsWith("/credit")) {
      const arg = text.split(/\s+/)[1];
      if (arg && isAddress(arg)) await send(chatId, await creditFor(arg));
      else await send(chatId, "Usage: `/credit 0xYourWalletAddress`");
    } else if (text.startsWith("/save")) {
      await send(chatId, `Open Vestra and start saving:\n${APP}/dashboard/onboard`);
    } else if (text.startsWith("/help")) {
      await send(chatId, HELP);
    } else {
      await send(chatId, `Try /agent, /credit <address>, or /save.\n\n${HELP}`);
    }
  } catch (e) {
    await send(chatId, "Something went wrong reading the chain — try again in a moment.");
    console.error(e);
  }
}

async function main() {
  if (!TOKEN) throw new Error("BOT_TOKEN env var required (get one from @BotFather)");
  console.log(`Vestra Telegram bot running on ${NETWORK} (agent ${VESTRA_AGENT_ID[NETWORK]})`);
  let offset = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const res = await fetch(`${TG}/getUpdates?timeout=30&offset=${offset}`);
      const data = (await res.json()) as { result?: { update_id: number; message?: { chat: { id: number }; text?: string } }[] };
      for (const u of data.result ?? []) {
        offset = u.update_id + 1;
        if (u.message) await handle(u.message);
      }
    } catch (e) {
      console.error("poll error:", e instanceof Error ? e.message : e);
    }
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
