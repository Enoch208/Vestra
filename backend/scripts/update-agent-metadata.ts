import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";
import { createWalletClient, createPublicClient, http, isHex, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { celo, celoSepolia } from "viem/chains";
import { identityAbi } from "../src/abi";
import { buildAndPinMetadata } from "../src/metadata";
import { IDENTITY_REGISTRY, type Network } from "../lib/erc8004";

const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  process.loadEnvFile(join(__dirname, "../.env"));
} catch {}

async function main() {
  const network: Network = process.argv.includes("--network")
    ? (process.argv[process.argv.indexOf("--network") + 1] as Network)
    : "testnet";
  const chain = network === "mainnet" ? celo : celoSepolia;

  const jwt = process.env.PINATA_JWT;
  const pk = process.env.AGENT_PRIVATE_KEY as Hex | undefined;
  if (!jwt) throw new Error("PINATA_JWT required");
  if (!pk || !isHex(pk)) throw new Error("AGENT_PRIVATE_KEY required");

  const dep = JSON.parse(
    readFileSync(join(__dirname, `../agent.${network}.json`), "utf-8")
  ) as { agentId: string };
  const agentId = BigInt(dep.agentId);

  const { uri, image } = await buildAndPinMetadata(jwt);
  console.log(`image:    ${image}`);
  console.log(`metadata: ${uri}`);

  const account = privateKeyToAccount(pk);
  const publicClient = createPublicClient({ chain, transport: http() });
  const walletClient = createWalletClient({ account, chain, transport: http() });

  const { request } = await publicClient.simulateContract({
    account,
    address: IDENTITY_REGISTRY[network],
    abi: identityAbi,
    functionName: "setAgentURI",
    args: [agentId, uri],
  });
  const hash = await walletClient.writeContract(request);
  await publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });
  console.log(`setAgentURI tx: ${hash}`);

  const onchain = await publicClient.readContract({
    address: IDENTITY_REGISTRY[network],
    abi: identityAbi,
    functionName: "tokenURI",
    args: [agentId],
  });
  console.log(`tokenURI(${agentId}) = ${onchain}  ${onchain === uri ? "OK" : "MISMATCH (likely RPC lag)"}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
