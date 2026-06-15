"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight01Icon } from "hugeicons-react";

type Status = {
  agentId: string;
  network: string;
  vaultUsdc: string;
  savers: number;
  vouches: number;
  links: { agent: string; vault: string };
};

export function OnchainStatus() {
  const [s, setS] = useState<Status | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/onchain")
      .then((r) => r.json())
      .then((d) => alive && !d.error && setS(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const stats = [
    { label: "USDC saved", value: s ? `$${s.vaultUsdc}` : "—" },
    { label: "savers onboarded", value: s ? String(s.savers) : "—" },
    { label: "onchain vouches", value: s ? String(s.vouches) : "—" },
  ];

  return (
    <section className="rounded-2xl border border-white/[0.06] bg-card/40 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success">
            <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-success opacity-60" />
          </span>
          Live on Celo mainnet · read from chain
        </div>
        <a
          href={s?.links.agent ?? "https://8004scan.io/agents/celo/9387"}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 font-mono text-[11px] text-muted transition-colors hover:text-foreground"
        >
          ERC-8004 agent #9387
          <ArrowUpRight01Icon size={12} strokeWidth={1.5} className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
        </a>
      </div>

      <div className="mt-5 grid grid-cols-3 divide-x divide-white/[0.06]">
        {stats.map((t) => (
          <div key={t.label} className="px-3 first:pl-0">
            <div className="font-mono text-2xl font-medium tracking-tight tabular-nums text-foreground sm:text-3xl">
              {t.value}
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{t.label}</div>
          </div>
        ))}
      </div>

      <a
        href={s?.links.vault ?? "https://celoscan.io/address/0xf3c25dbd82FE887138B3a589455E4867740a4520"}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] text-muted transition-colors hover:text-foreground"
      >
        SavingsVault on Celoscan
        <ArrowUpRight01Icon size={12} strokeWidth={1.5} />
      </a>
    </section>
  );
}
