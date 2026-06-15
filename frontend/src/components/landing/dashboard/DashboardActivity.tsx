const ENTRIES = [
  {
    initials: "VA",
    author: "vestra.agent",
    when: "just now",
    body: "Pulled $0.10 cUSD from maya.celo allowance · SavingsVault balance: $2.90 · streak extended to day 29.",
  },
  {
    initials: "R8",
    author: "reputation.registry",
    when: "2s ago",
    body: "ERC-8004 event recorded · kind: CONTRIBUTION · on-time: true · new score: 692/1000 · advance eligible: $2.90 cUSD.",
  },
] as const;

export function DashboardActivity() {
  return (
    <div className="mt-12 border-t border-white/[0.05] pt-8">
      {ENTRIES.map((e, i) => (
        <div key={e.author} className={`flex gap-4 ${i > 0 ? "mt-6" : ""}`}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-500/30 bg-amber-900/50 font-mono text-[11px] font-medium text-amber-300">
            {e.initials}
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="font-mono text-[13px] font-medium text-foreground">
                {e.author}
              </span>
              <span className="text-[11px] text-muted">{e.when}</span>
            </div>
            <p className="text-[13px] leading-relaxed text-muted">{e.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
