export function DashboardCodeBlock() {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-white/10 bg-[#090A0B] shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.05] bg-[#131416] px-4 py-2">
        <span className="font-mono text-[11px] text-muted">agent/pull.ts</span>
        <span className="font-mono text-[10px] text-muted/70">TypeScript</span>
      </div>
      <div className="overflow-x-auto p-4 font-mono text-[12px] leading-6">
        <div className="text-muted/70">{"// daily agent loop — runs at 06:00 UTC"}</div>
        <div className="mt-1 flex flex-wrap gap-x-1">
          <span className="text-purple-400">const</span>
          <span className="text-blue-300">vault</span>
          <span className="text-foreground/60">=</span>
          <span className="text-yellow-300">getContract</span>
          <span className="text-muted">{"({ address: user.vaultAddr })"}</span>
        </div>
        <div className="mt-2 text-muted/70">{"// pull today's cUSD if streak window is open"}</div>
        <div className="flex flex-wrap gap-x-1">
          <span className="text-purple-400">await</span>
          <span className="text-blue-300">vault</span>
          <span className="text-foreground/60">.</span>
          <span className="text-yellow-300">write</span>
          <span className="text-foreground/60">.</span>
          <span className="text-yellow-300">pullContribution</span>
          <span className="text-muted">{"(["}</span>
          <span className="text-blue-300">user</span>
          <span className="text-foreground/60">.</span>
          <span className="text-blue-300">address</span>
          <span className="text-muted">{"])"}</span>
        </div>
        <div className="mt-2 text-muted/70">{"// write ERC-8004 reputation event"}</div>
        <div className="flex flex-wrap gap-x-1">
          <span className="text-purple-400">await</span>
          <span className="text-blue-300">registry</span>
          <span className="text-foreground/60">.</span>
          <span className="text-yellow-300">write</span>
          <span className="text-foreground/60">.</span>
          <span className="text-yellow-300">recordEvent</span>
          <span className="text-muted">{"(["}</span>
          <span className="text-blue-300">agentId</span>
          <span className="text-muted">{", "}</span>
          <span className="text-green-400">{`"CONTRIBUTION"`}</span>
          <span className="text-muted">{", "}</span>
          <span className="text-yellow-300">scoreUpdate</span>
          <span className="text-muted">{"])"}</span>
        </div>
        <div className="mt-2 text-emerald-400/80">
          {"✓ $0.10 pulled · streak: 29 · score: 692"}
        </div>
      </div>
    </div>
  );
}
