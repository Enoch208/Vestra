import { NextResponse } from "next/server";
import { isAddress } from "viem";
import { agentSetVerified } from "@/lib/agent";

export async function POST(req: Request) {
  try {
    const { address } = (await req.json()) as { address?: string };
    if (!address || !isAddress(address)) {
      return NextResponse.json({ error: "valid wallet address required" }, { status: 400 });
    }
    const txHash = await agentSetVerified(address);
    return NextResponse.json({ ok: true, txHash });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "verification failed" },
      { status: 500 }
    );
  }
}
