import type { VestraUser } from "@/data/mockData";

const STATUS_STYLE: Record<VestraUser["status"], { dot: string; label: string; text: string }> = {
  ACTIVE: { dot: "bg-success", label: "active", text: "text-success" },
  CREDIT_ACTIVE: { dot: "bg-accent", label: "credit active", text: "text-accent" },
  PAUSED: { dot: "bg-white/30", label: "paused", text: "text-muted" },
};

export function SavingsUserRow({ user }: { user: VestraUser }) {
  const s = STATUS_STYLE[user.status];
  return (
    <div className="group grid cursor-default grid-cols-12 items-center gap-4 border-b border-white/[0.04] px-5 py-4 text-sm transition-colors hover:bg-white/[0.02] last:border-b-0">
      <div className="col-span-12 flex min-w-0 items-center gap-3 md:col-span-3">
        <span className="relative inline-flex h-2 w-2 shrink-0">
          <span aria-hidden className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-40 ${s.dot}`} />
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${s.dot}`} />
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[13px] font-medium text-foreground">
            {user.flag} {user.displayName}
          </span>
          <span className="truncate font-mono text-[10px] text-muted">
            {user.country} · 0x{user.id.slice(2, 6)}…{user.id.slice(-4)}
          </span>
        </div>
      </div>

      <span className="col-span-4 font-mono text-[12px] text-foreground/85 md:col-span-2">
        ${user.dailyAmountCusd.toFixed(2)}<span className="text-muted">/day</span>
      </span>

      <div className="col-span-4 md:col-span-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[12px] text-accent">{user.streak}d</span>
          <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/[0.06]">
            <span
              className="block h-full rounded-full bg-accent/60"
              style={{ width: `${Math.min((user.streak / 60) * 100, 100)}%` }}
            />
          </span>
        </div>
      </div>

      <div className="col-span-4 hidden md:col-span-2 md:block">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[12px] text-foreground/70">{user.score}</span>
          <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/[0.06]">
            <span
              className="block h-full rounded-full bg-success/50"
              style={{ width: `${(user.score / 1000) * 100}%` }}
            />
          </span>
        </div>
      </div>

      <span className="col-span-4 hidden font-mono text-[12px] text-foreground/70 md:inline-block md:col-span-2">
        ${user.totalSavedCusd.toFixed(2)}
      </span>

      <div className="col-span-4 hidden items-center gap-1.5 md:col-span-1 md:flex">
        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
        <span className={`font-mono text-[10px] uppercase tracking-[0.14em] ${s.text}`}>
          {s.label}
        </span>
      </div>
    </div>
  );
}
