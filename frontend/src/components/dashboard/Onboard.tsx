"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { CheckmarkCircle02Icon, Loading03Icon } from "hugeicons-react";
import { ConnectWallet } from "./ConnectWallet";
import {
  VAULT,
  USDC,
  IDENTITY_REGISTRY,
  USER_AGENT_URI,
  vaultAbi,
  identityAbi,
  usdcAbi,
} from "@/lib/web3/contracts";

type State = "idle" | "pending" | "done" | "error";

function msg(e: unknown) {
  return e instanceof Error ? e.message.split("\n")[0] : "Something went wrong";
}

export function Onboard() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [daily, setDaily] = useState("0.10");
  const [st, setSt] = useState<Record<string, State>>({});
  const [err, setErr] = useState<string | null>(null);
  const set = (k: string, v: State) => setSt((s) => ({ ...s, [k]: v }));

  async function verify() {
    setErr(null);
    set("verify", "pending");
    try {
      const r = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error || "verification failed");
      set("verify", "done");
    } catch (e) {
      set("verify", "error");
      setErr(msg(e));
    }
  }

  async function step(key: string, run: () => Promise<unknown>) {
    setErr(null);
    set(key, "pending");
    try {
      await run();
      set(key, "done");
    } catch (e) {
      set(key, "error");
      setErr(msg(e));
    }
  }

  const STEPS = [
    {
      key: "verify",
      title: "Verify you're human",
      desc: "One account per person. Vestra marks your wallet verified onchain.",
      action: verify,
      label: "Verify",
    },
    {
      key: "register",
      title: "Create your credit identity",
      desc: "Register as your own ERC-8004 agent — your portable, onchain credit record.",
      action: () =>
        step("register", () =>
          writeContractAsync({ address: IDENTITY_REGISTRY, abi: identityAbi, functionName: "register", args: [USER_AGENT_URI] })
        ),
      label: "Register",
    },
    {
      key: "open",
      title: "Set your daily save",
      desc: "Open your non-custodial savings account.",
      action: () =>
        step("open", () =>
          writeContractAsync({ address: VAULT, abi: vaultAbi, functionName: "openAccount", args: [parseUnits(daily || "0", 6)] })
        ),
      label: "Open account",
      input: true,
    },
    {
      key: "approve",
      title: "Grant the daily allowance",
      desc: "Approve the vault to pull your committed amount — never more, never twice a day.",
      action: () =>
        step("approve", () =>
          writeContractAsync({ address: USDC, abi: usdcAbi, functionName: "approve", args: [VAULT, parseUnits("100", 6)] })
        ),
      label: "Approve USDC",
    },
  ];

  const done = STEPS.every((s) => st[s.key] === "done");

  return (
    <div className="mx-auto w-full max-w-xl space-y-5 px-5 py-8 md:py-10">
      <header className="space-y-1.5">
        <h1 className="text-lg font-medium tracking-tight text-foreground">Start saving with Vestra</h1>
        <p className="text-[13px] text-muted">
          Four steps on Celo mainnet. After this, the agent collects your daily save automatically.
        </p>
      </header>

      {!isConnected ? (
        <div className="rounded-2xl border border-white/[0.06] bg-card/40 p-6 text-center">
          <p className="mb-4 text-[13px] text-muted">Connect your wallet to begin.</p>
          <ConnectWallet />
        </div>
      ) : (
        <ol className="space-y-3">
          {STEPS.map((s, i) => {
            const state = st[s.key] ?? "idle";
            const prevDone = i === 0 || st[STEPS[i - 1].key] === "done";
            return (
              <li key={s.key} className="rounded-2xl border border-white/[0.06] bg-card/40 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 font-mono text-[11px] text-muted">
                    {state === "done" ? <CheckmarkCircle02Icon size={14} className="text-success" /> : i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-foreground">{s.title}</p>
                    <p className="mt-0.5 text-[12px] leading-snug text-muted">{s.desc}</p>
                    {s.input && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5">
                        <span className="text-[12px] text-muted">$</span>
                        <input
                          value={daily}
                          onChange={(e) => setDaily(e.target.value)}
                          className="w-16 bg-transparent font-mono text-[13px] text-foreground outline-none"
                          inputMode="decimal"
                        />
                        <span className="font-mono text-[11px] text-muted">USDC / day</span>
                      </div>
                    )}
                    <div className="mt-3">
                      <button
                        onClick={s.action}
                        disabled={!prevDone || state === "pending" || state === "done"}
                        className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-dim px-4 py-1.5 text-[13px] font-medium text-accent transition-colors hover:bg-accent/15 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {state === "pending" && <Loading03Icon size={13} className="animate-spin" />}
                        {state === "done" ? "Done" : state === "pending" ? "Confirm…" : s.label}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {err && <p className="text-[12px] text-danger">{err}</p>}
      {done && (
        <div className="rounded-2xl border border-success/25 bg-success/10 p-4 text-[13px] text-success">
          You're all set — Vestra will collect your daily save and build your credit identity. 🎉
        </div>
      )}
    </div>
  );
}
