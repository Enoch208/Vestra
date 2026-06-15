"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight01Icon } from "hugeicons-react";
import { api } from "@/lib/api";
import { VESTRA_SUMMARY, type VestraSummary } from "@/data/mockData";

const POLL_MS = 15_000;
const AGENTSCAN = "https://8004scan.io";

export function LiveStatsStrip() {
  const [s, setS] = useState<VestraSummary>(VESTRA_SUMMARY);

  useEffect(() => {
    let alive = true;
    const load = () =>
      api
        .summary()
        .then((next) => alive && setS(next))
        .catch(() => {});
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const tiles: { value: string; label: string; accent?: boolean }[] = [
    { value: s.verifiedUsers > 0 ? String(s.verifiedUsers) : "—", label: "verified users", accent: s.verifiedUsers > 0 },
    { value: s.totalContributions > 0 ? String(s.totalContributions) : "—", label: "contributions" },
    { value: s.reputationEvents > 0 ? String(s.reputationEvents) : "—", label: "reputation events" },
    { value: s.totalSavedCusd > 0 ? `$${s.totalSavedCusd.toFixed(2)}` : "—", label: "cUSD saved" },
  ];

  return (
    <section className="mx-auto mt-24 flex max-w-3xl flex-col items-center px-6 text-center">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent">
          <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
        </span>
        Live on Celo · onchain, not seeded
      </div>

      <h2 className="mt-4 text-2xl font-light tracking-tighter text-foreground sm:text-3xl">
        Real savings. Verifiable credit. On Celo.
      </h2>

      <div className="mt-8 grid w-full grid-cols-2 divide-x divide-white/[0.06] rounded-xl border border-white/[0.06] bg-card/40 sm:grid-cols-4">
        {tiles.map((t) => (
          <Stat key={t.label} value={t.value} label={t.label} accent={t.accent} />
        ))}
      </div>

      <a
        href={AGENTSCAN}
        target="_blank"
        rel="noreferrer"
        className="group mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] text-muted transition-colors duration-200 hover:text-foreground"
      >
        verify on-chain — 8004scan · Vestra agent
        <ArrowUpRight01Icon size={12} strokeWidth={1.5} className="transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
      </a>
    </section>
  );
}

function Stat({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="px-3 py-5 sm:px-5">
      <div className={`font-mono text-2xl font-medium tracking-tight tabular-nums sm:text-3xl md:text-4xl ${accent ? "text-accent" : "text-foreground"}`}>
        {value}
      </div>
      <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{label}</div>
    </div>
  );
}
