"use client";

import { useEffect, useState } from "react";
import {
  Search01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  ArrowRight01Icon,
} from "hugeicons-react";
import { MAYA_CREDIT_RECORD } from "@/data/mockData";
import { API_BASE } from "@/lib/api";
import { SectionHeading } from "@/components/dashboard/SectionHeading";
import { JsonBlock } from "@/components/dashboard/JsonBlock";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok"; address: string; record: typeof MAYA_CREDIT_RECORD }
  | { kind: "miss"; address: string };

const SAMPLE = "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b";

export function TraceExplorer({ initialCid }: { initialCid?: string }) {
  const [value, setValue] = useState(initialCid ?? "");
  const [state, setState] = useState<State>({ kind: "idle" });

  useEffect(() => {
    if (initialCid) resolve(initialCid);
  }, [initialCid]);

  async function resolve(raw: string) {
    const address = raw.trim();
    if (!address) return;
    setState({ kind: "loading" });

    if (address.toLowerCase().includes("maya") || address.toLowerCase() === SAMPLE.toLowerCase()) {
      setState({ kind: "ok", address, record: MAYA_CREDIT_RECORD });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/credit/${encodeURIComponent(address)}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const body = (await res.json()) as typeof MAYA_CREDIT_RECORD;
        setState({ kind: "ok", address, record: body });
        return;
      }
    } catch {
      /* fall through to miss */
    }
    setState({ kind: "miss", address });
  }

  return (
    <section id="credit-explorer" className="rounded-xl border border-white/5 bg-[#0B0C0E]">
      <div className="border-b border-white/5 px-5 pt-5">
        <SectionHeading
          eyebrow="Credit explorer"
          title="Look up any saver's onchain record"
          description="Enter a wallet address or user ID to inspect their savings history, streak, credit score, and reputation events on Celo Sepolia."
        />
      </div>

      <div className="space-y-3 border-b border-white/5 px-5 py-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-white/5 bg-white/[0.02] px-3 py-2.5 transition-colors focus-within:border-white/15">
            <Search01Icon size={14} strokeWidth={1.5} className="text-muted" />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") resolve(value);
              }}
              placeholder="0x… wallet address or user ID"
              className="flex-1 bg-transparent font-mono text-[12px] text-foreground placeholder:text-muted/60 outline-none"
            />
          </div>
          <button
            onClick={() => resolve(value)}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-accent/40 bg-accent px-5 py-2.5 text-[12.5px] font-medium text-black transition-all duration-200 ease-out hover:bg-accent/90 active:scale-[0.98]"
          >
            Look up record
            <ArrowRight01Icon size={12} strokeWidth={2} />
          </button>
        </div>
        <button
          onClick={() => {
            setValue(SAMPLE);
            resolve(SAMPLE);
          }}
          className="cursor-pointer font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-foreground"
        >
          Try a sample → maya.celo record
        </button>
      </div>

      <div className="p-5">
        {state.kind === "idle" && (
          <p className="rounded-md border border-dashed border-white/[0.06] px-4 py-8 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Enter a wallet address to inspect a credit record
          </p>
        )}
        {state.kind === "loading" && (
          <div className="flex items-center justify-center gap-2 py-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            Fetching from Celo…
          </div>
        )}
        {state.kind === "miss" && (
          <div className="flex items-start gap-3 rounded-md border border-rose-400/20 bg-rose-400/[0.04] p-4">
            <AlertCircleIcon size={15} strokeWidth={1.5} className="mt-0.5 text-rose-300" />
            <div className="space-y-1">
              <p className="text-[13px] text-foreground/90">No record found</p>
              <p className="font-mono text-[11px] text-muted">
                {state.address.slice(0, 20)}… has no Vestra credit record on Sepolia.
              </p>
            </div>
          </div>
        )}
        {state.kind === "ok" && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-md border border-emerald-400/20 bg-emerald-400/[0.04] p-4">
              <CheckmarkCircle02Icon size={15} strokeWidth={1.5} className="mt-0.5 text-emerald-300" />
              <div className="space-y-1">
                <p className="text-[13px] text-foreground/95">
                  Credit record found · {state.record.userDisplay}
                </p>
                <p className="font-mono text-[11px] text-muted">
                  Score: <span className="text-accent">{state.record.score}/1000</span>
                  {" "}· Streak: <span className="text-foreground/85">{state.record.events.length} events</span>
                  {" "}· Eligible: <span className="text-foreground/85">${state.record.advanceEligibleCusd.toFixed(2)} cUSD</span>
                </p>
              </div>
            </div>
            <JsonBlock
              label="Credit record"
              value={{
                user: state.record.userDisplay,
                wallet: state.record.walletShort,
                country: state.record.country,
                dailyAmountCusd: state.record.dailyAmountCusd,
                totalSavedCusd: state.record.totalSavedCusd,
                score: state.record.score,
                advanceEligibleCusd: state.record.advanceEligibleCusd,
                reputationEvents: state.record.events.length,
              }}
              tone="output"
            />
          </div>
        )}
      </div>
    </section>
  );
}
