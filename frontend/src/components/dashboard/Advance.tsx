"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { Loading03Icon } from "hugeicons-react";
import { ConnectWallet } from "./ConnectWallet";
import { CREDIT_MODULE, USDC, creditModuleAbi, usdcAbi } from "@/lib/web3/contracts";

export function Advance() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [amt, setAmt] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const eligible = useReadContract({
    address: CREDIT_MODULE,
    abi: creditModuleAbi,
    functionName: "eligibleAmount",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
  const advance = useReadContract({
    address: CREDIT_MODULE,
    abi: creditModuleAbi,
    functionName: "advances",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const eligibleUsdc = eligible.data ? formatUnits(eligible.data as bigint, 6) : "0.00";
  const adv = advance.data as readonly [bigint, bigint, bigint, bigint, number] | undefined;
  const outstanding = adv ? adv[1] : BigInt(0);
  const status = adv ? adv[4] : 0;
  const hasActive = status === 1;

  async function request() {
    setErr(null);
    setBusy("request");
    try {
      await writeContractAsync({
        address: CREDIT_MODULE,
        abi: creditModuleAbi,
        functionName: "requestAdvance",
        args: [parseUnits(amt || "0", 6)],
      });
      await Promise.all([eligible.refetch(), advance.refetch()]);
    } catch (e) {
      setErr(e instanceof Error ? e.message.split("\n")[0] : "Request failed");
    }
    setBusy(null);
  }

  async function repay() {
    setErr(null);
    setBusy("repay");
    try {
      await writeContractAsync({ address: USDC, abi: usdcAbi, functionName: "approve", args: [CREDIT_MODULE, outstanding] });
      await writeContractAsync({ address: CREDIT_MODULE, abi: creditModuleAbi, functionName: "repay", args: [outstanding] });
      await advance.refetch();
    } catch (e) {
      setErr(e instanceof Error ? e.message.split("\n")[0] : "Repay failed");
    }
    setBusy(null);
  }

  return (
    <div className="space-y-5">
      <header className="space-y-1.5">
        <h1 className="text-lg font-medium tracking-tight text-foreground">Savings-backed advance</h1>
        <p className="text-[13px] text-muted">
          Borrow against your savings — fully collateralized, no credit check. Repay in your own time; each repayment grows your credit identity.
        </p>
      </header>

      {!isConnected ? (
        <div className="rounded-2xl border border-white/[0.06] bg-card/40 p-6 text-center">
          <p className="mb-4 text-[13px] text-muted">Connect your wallet to view your advance.</p>
          <ConnectWallet />
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-card/40 p-5">
          <div className="flex items-baseline justify-between border-b border-white/[0.05] pb-4">
            <span className="text-[12px] uppercase tracking-[0.16em] text-muted">Eligible to borrow</span>
            <span className="font-mono text-2xl font-medium text-accent">${eligibleUsdc} USDC</span>
          </div>

          {hasActive ? (
            <div className="mt-4 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] text-muted">Outstanding</span>
                <span className="font-mono text-[15px] text-foreground">${formatUnits(outstanding, 6)} USDC</span>
              </div>
              <button
                onClick={repay}
                disabled={busy !== null}
                className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-dim px-4 py-2 text-[13px] font-medium text-accent transition-colors hover:bg-accent/15 disabled:opacity-40"
              >
                {busy === "repay" && <Loading03Icon size={13} className="animate-spin" />}
                Repay advance
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5">
                <span className="text-[12px] text-muted">$</span>
                <input
                  value={amt}
                  onChange={(e) => setAmt(e.target.value)}
                  placeholder={eligibleUsdc}
                  inputMode="decimal"
                  className="w-20 bg-transparent font-mono text-[13px] text-foreground outline-none placeholder:text-muted/50"
                />
                <span className="font-mono text-[11px] text-muted">USDC</span>
              </div>
              <div>
                <button
                  onClick={request}
                  disabled={busy !== null || !amt}
                  className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-dim px-4 py-2 text-[13px] font-medium text-accent transition-colors hover:bg-accent/15 disabled:opacity-40"
                >
                  {busy === "request" && <Loading03Icon size={13} className="animate-spin" />}
                  Request advance
                </button>
              </div>
            </div>
          )}

          {err && <p className="mt-3 text-[12px] text-danger">{err}</p>}
        </div>
      )}
    </div>
  );
}
