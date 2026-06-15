import { NextResponse } from "next/server";
import { getOnchainStatus } from "@/lib/onchain";

export const revalidate = 30;

export async function GET() {
  try {
    return NextResponse.json(await getOnchainStatus());
  } catch {
    return NextResponse.json({ error: "onchain read failed" }, { status: 500 });
  }
}
