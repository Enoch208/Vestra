import { NextResponse } from "next/server";
import { createPublicClient, http, formatUnits, isAddress, type Address } from "viem";
import { celo } from "@/lib/web3/chains";
import { VAULT, CREDIT_MODULE, vaultAbi, creditModuleAbi } from "@/lib/web3/contracts";
import { getOnchainStatus, MAINNET } from "@/lib/onchain";

const client = createPublicClient({
  chain: celo,
  transport: http(process.env.NEXT_PUBLIC_CELO_RPC_URL ?? "https://forno.celo.org"),
});

const TOOLS = [
  {
    name: "get_agent_stats",
    description: "Live Vestra agent stats on Celo mainnet: total USDC saved, savers onboarded, and onchain vouches.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_credit_record",
    description: "A wallet's Vestra savings + credit record: verified, daily amount, streak, total saved, missed.",
    inputSchema: {
      type: "object",
      properties: { address: { type: "string", description: "0x wallet address" } },
      required: ["address"],
    },
  },
  {
    name: "get_borrow_eligibility",
    description: "How much USDC a wallet can borrow as a savings-backed advance from Vestra.",
    inputSchema: {
      type: "object",
      properties: { address: { type: "string", description: "0x wallet address" } },
      required: ["address"],
    },
  },
  {
    name: "list_contracts",
    description: "Vestra's deployed Celo mainnet contracts and ERC-8004 agent id.",
    inputSchema: { type: "object", properties: {} },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<string> {
  if (name === "get_agent_stats") {
    const s = await getOnchainStatus();
    return `Vestra agent #${s.agentId} on ${s.network}: ${s.vaultUsdc} USDC saved · ${s.savers} savers · ${s.vouches} onchain vouches.`;
  }
  if (name === "get_credit_record") {
    const a = args.address as string;
    if (!isAddress(a)) throw new Error("valid 0x address required");
    const [acct, verified] = await Promise.all([
      client.readContract({ address: VAULT, abi: vaultAbi, functionName: "accounts", args: [a as Address] }),
      client.readContract({ address: VAULT, abi: vaultAbi, functionName: "verified", args: [a as Address] }),
    ]);
    if (!acct[6]) return `No Vestra account for ${a}.`;
    return `${a} — verified: ${verified}, daily: ${formatUnits(acct[2], 6)} USDC, saved: ${formatUnits(acct[0], 6)} USDC, streak: ${acct[4]} days, missed: ${acct[5]}.`;
  }
  if (name === "get_borrow_eligibility") {
    const a = args.address as string;
    if (!isAddress(a)) throw new Error("valid 0x address required");
    const e = await client.readContract({ address: CREDIT_MODULE, abi: creditModuleAbi, functionName: "eligibleAmount", args: [a as Address] });
    return `${a} can borrow up to ${formatUnits(e, 6)} USDC as a savings-backed advance.`;
  }
  if (name === "list_contracts") {
    return JSON.stringify({ agentId: MAINNET.agentId, network: "celo-mainnet", vault: MAINNET.vault, creditModule: MAINNET.creditModule, usdc: MAINNET.usdc });
  }
  throw new Error(`unknown tool: ${name}`);
}

type Rpc = { jsonrpc?: string; id?: number | string; method?: string; params?: Record<string, unknown> };

export async function POST(req: Request) {
  let body: Rpc;
  try {
    body = (await req.json()) as Rpc;
  } catch {
    return NextResponse.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "parse error" } }, { status: 400 });
  }
  const { id, method, params } = body;

  if (method === "initialize") {
    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2025-06-18",
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "vestra-mcp", version: "1.0.0" },
      },
    });
  }
  if (id === undefined || method?.startsWith("notifications/")) {
    return new NextResponse(null, { status: 202 });
  }
  if (method === "ping") return NextResponse.json({ jsonrpc: "2.0", id, result: {} });
  if (method === "tools/list") return NextResponse.json({ jsonrpc: "2.0", id, result: { tools: TOOLS } });
  if (method === "tools/call") {
    const name = (params?.name as string) ?? "";
    try {
      const text = await callTool(name, (params?.arguments as Record<string, unknown>) ?? {});
      return NextResponse.json({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text }], isError: false } });
    } catch (e) {
      return NextResponse.json({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: e instanceof Error ? e.message : "error" }], isError: true } });
    }
  }
  return NextResponse.json({ jsonrpc: "2.0", id, error: { code: -32601, message: "method not found" } });
}

export async function GET() {
  return NextResponse.json({ name: "vestra-mcp", protocol: "mcp", protocolVersion: "2025-06-18", tools: TOOLS.length });
}
