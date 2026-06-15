import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { isHex } from "viem";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "../.env");
const force = process.argv.includes("--force");

const lines = existsSync(envPath)
  ? readFileSync(envPath, "utf-8").split("\n")
  : [];

const readKey = (k: string): string => {
  const line = lines.find((l) => l.startsWith(`${k}=`));
  return line ? line.slice(k.length + 1).trim() : "";
};

const existing = readKey("AGENT_PRIVATE_KEY");
if (existing && isHex(existing) && existing.length === 66 && !force) {
  const addr = privateKeyToAccount(existing as `0x${string}`).address;
  console.error("AGENT_PRIVATE_KEY is already set in backend/.env");
  console.error(`Address: ${addr}`);
  console.error("Re-run with --force to replace it (abandons any funds on the old wallet).");
  process.exit(1);
}

const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);

const setLine = (k: string, v: string) => {
  const i = lines.findIndex((l) => l.startsWith(`${k}=`));
  if (i >= 0) lines[i] = `${k}=${v}`;
  else lines.push(`${k}=${v}`);
};

setLine("AGENT_PRIVATE_KEY", privateKey);
writeFileSync(envPath, lines.join("\n").replace(/\n+$/, "") + "\n");

console.log("New agent wallet generated → written to backend/.env");
console.log("");
console.log(`Address: ${account.address}`);
console.log("");
console.log("Fund this address with Alfajores test CELO:");
console.log("  https://faucet.celo.org  (paste the address, choose Alfajores)");
console.log("");
console.log("The private key lives only in backend/.env (gitignored). Don't commit or share it.");
