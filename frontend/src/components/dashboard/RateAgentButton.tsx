"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { CheckmarkCircle02Icon, FavouriteIcon } from "hugeicons-react";
import {
  REPUTATION_REGISTRY,
  reputationAbi,
  VESTRA_AGENT_ID,
  ZERO_HASH,
} from "@/lib/web3/contracts";

export function RateAgentButton() {
  const { isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function vouch() {
    setError(null);
    try {
      await writeContractAsync({
        address: REPUTATION_REGISTRY,
        abi: reputationAbi,
        functionName: "giveFeedback",
        args: [VESTRA_AGENT_ID, BigInt(1), 0, "served", "", "", "", ZERO_HASH],
      });
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message.split("\n")[0] : "Transaction failed");
    }
  }

  if (done) {
    return (
      <span className="inline-flex items-center gap-2 text-[13px] text-success">
        <CheckmarkCircle02Icon size={15} strokeWidth={1.5} />
        Vouched on ERC-8004 — thank you
      </span>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={vouch}
        disabled={!isConnected || isPending}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-accent/25 bg-accent-dim px-4 py-2 text-[13px] font-medium text-accent transition-colors hover:bg-accent/15 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FavouriteIcon size={14} strokeWidth={1.5} />
        {isPending ? "Confirm in wallet…" : "Vouch for Vestra"}
      </button>
      {!isConnected && (
        <span className="text-[11px] text-muted">Connect a wallet to vouch.</span>
      )}
      {error && <span className="text-[11px] text-danger">{error}</span>}
    </div>
  );
}
