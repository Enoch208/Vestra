import { ShieldKeyIcon, UserCheck01Icon, CheckmarkBadge02Icon } from "hugeicons-react";

const STEPS = [
  { icon: UserCheck01Icon, label: "Scan passport or ID", status: "done" },
  { icon: ShieldKeyIcon, label: "ZK proof generated — no PII stored", status: "done" },
  { icon: CheckmarkBadge02Icon, label: "Human verified · one account per person", status: "active" },
] as const;

export function CodeEditorVisual() {
  return (
    <div className="px-8 pt-8 [perspective:1800px]">
      <div
        className="overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/0 shadow-2xl transition-all duration-500 ease-out group-hover:[transform:rotateX(2deg)_scale(1.02)] group-hover:-translate-y-2"
        style={{
          WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 8%, black 82%, transparent 100%)",
          maskImage: "linear-gradient(180deg, transparent 0%, black 8%, black 82%, transparent 100%)",
        }}
      >
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.03] px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-success/40 ring-1 ring-success/60" />
            <span className="h-3 w-3 rounded-full bg-white/10 ring-1 ring-white/20" />
            <span className="h-3 w-3 rounded-full bg-white/10 ring-1 ring-white/20" />
          </div>
          <span className="font-mono text-[11px] text-muted">Self Protocol · ZK Verification</span>
          <span className="rounded-full border border-success/30 bg-success/[0.08] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-success">
            verified
          </span>
        </div>

        <div className="px-5 py-6 space-y-4">
          {STEPS.map(({ icon: Icon, label, status }, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                status === "done"
                  ? "bg-success/10 text-success"
                  : "bg-accent/10 text-accent"
              }`}>
                <Icon size={15} strokeWidth={1.5} />
              </div>
              <span className={`text-sm leading-snug ${
                status === "done" ? "text-foreground/70" : "text-foreground"
              }`}>
                {label}
              </span>
              {status === "done" && (
                <CheckmarkBadge02Icon size={14} strokeWidth={1.5} className="ml-auto shrink-0 text-success/60" />
              )}
            </div>
          ))}

          <div className="mt-2 rounded-lg border border-success/20 bg-success/[0.06] px-4 py-3 font-mono text-[11px] text-success">
            nullifier stored · no PII · one human, one account
          </div>
        </div>
      </div>
    </div>
  );
}
