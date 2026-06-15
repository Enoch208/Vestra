import {
  createWalletClient,
  createPublicClient,
  http,
  parseAbi,
  formatEther,
  isHex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { celo, celoSepolia } from "viem/chains";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  IDENTITY_REGISTRY,
  REPUTATION_REGISTRY,
  explorerAgentUrl,
  type Network,
} from "../lib/erc8004";
import { buildAndPinMetadata } from "../src/metadata";

const __dirname = dirname(fileURLToPath(import.meta.url));

try {
  process.loadEnvFile(join(__dirname, "../.env"));
} catch {}

const REGISTRY_ABI = parseAbi([
  "function register(string calldata agentURI) external returns (uint256 agentId)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
]);

async function main() {
  const network: Network = process.argv.includes("--network")
    ? (process.argv[process.argv.indexOf("--network") + 1] as Network)
    : "testnet";

  const isMainnet = network === "mainnet";
  const chain = isMainnet ? celo : celoSepolia;
  const registryAddress = IDENTITY_REGISTRY[network];

  const PINATA_JWT = process.env.PINATA_JWT;
  const PRIVATE_KEY = process.env.AGENT_PRIVATE_KEY;

  if (!PINATA_JWT) throw new Error("PINATA_JWT env var required — see backend/.env.example");
  if (!PRIVATE_KEY) throw new Error("AGENT_PRIVATE_KEY env var required — see backend/.env.example");
  if (!isHex(PRIVATE_KEY) || PRIVATE_KEY.length !== 66) {
    throw new Error("AGENT_PRIVATE_KEY must be a 0x-prefixed 32-byte hex string (66 chars)");
  }

  const account = privateKeyToAccount(PRIVATE_KEY);
  const rpcUrl = process.env.CELO_RPC_URL;
  const transport = rpcUrl ? http(rpcUrl) : http();
  const publicClient = createPublicClient({ chain, transport });
  const walletClient = createWalletClient({ account, chain, transport });

  console.log(`Network:      ${isMainnet ? "Celo Mainnet" : "Celo Sepolia (testnet)"}`);
  console.log(`Agent wallet: ${account.address}`);
  console.log(`Registry:     ${registryAddress}`);
  console.log("");

  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`Balance:      ${formatEther(balance)} CELO`);
  if (balance === 0n) {
    throw new Error(
      isMainnet
        ? "Agent wallet has 0 CELO — fund it before registering."
        : "Agent wallet has 0 CELO — fund it at https://faucet.celo.org before registering."
    );
  }
  console.log("");

  console.log("Pinning agent metadata (logo + A2A card) to IPFS...");
  const { uri: ipfsUri, image } = await buildAndPinMetadata(PINATA_JWT);
  console.log(`Logo:         ${image}`);
  console.log(`Metadata:     ${ipfsUri}`);
  console.log("");

  console.log("Registering on ERC-8004 Identity Registry...");
  const hash = await walletClient.writeContract({
    address: registryAddress,
    abi: REGISTRY_ABI,
    functionName: "register",
    args: [ipfsUri],
  });
  console.log(`Tx:           ${hash}`);
  console.log("Waiting for confirmation...");

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (receipt.status !== "success") {
    throw new Error(`Transaction reverted: ${receipt.transactionHash}`);
  }

  const mintLog = receipt.logs.find((l) => l.topics.length === 4);
  const agentId = mintLog?.topics[3] ? BigInt(mintLog.topics[3]).toString() : null;

  const reputationRegistry = REPUTATION_REGISTRY[network];
  const result = {
    network,
    agentId,
    agentAddress: account.address,
    identityRegistry: registryAddress,
    reputationRegistry,
    metadataUri: ipfsUri,
    txHash: hash,
    registeredAt: new Date().toISOString(),
  };
  writeFileSync(
    join(__dirname, `../agent.${network}.json`),
    JSON.stringify(result, null, 2) + "\n"
  );

  console.log("");
  console.log("Agent registered.");
  console.log(`agentId:      ${agentId}`);
  console.log(`8004scan:     ${explorerAgentUrl(network, agentId)}`);
  console.log(`Saved:        backend/agent.${network}.json`);
  console.log("");
  console.log("Reputation writes will use this agentId + the Reputation Registry:");
  console.log(`  ${reputationRegistry}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
