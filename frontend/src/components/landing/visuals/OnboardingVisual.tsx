import { ArrowRight01Icon, CreditCardIcon, CheckmarkCircle02Icon } from "hugeicons-react";

const STEPS = [
  { label: "Self verified", done: true },
  { label: "7-day streak", done: true },
  { label: "Credit eligible", done: true },
] as const;

export function OnboardingVisual() {
  return (
    <div className="relative h-full overflow-hidden [perspective:1400px]">
      <div
        aria-hidden
        className="absolute left-1/2 top-20 h-44 w-3/4 -translate-x-1/2 rounded-xl border border-white/[0.06] bg-white/[0.04] opacity-50 shadow-xl"
        style={{ transform: "scale(0.88)" }}
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-16 h-48 w-[78%] -translate-x-1/2 rounded-xl border border-white/[0.08] bg-white/[0.05] opacity-70 shadow-2xl"
        style={{ transform: "scale(0.94)" }}
      />
      <div className="absolute left-1/2 top-24 z-10 w-[78%] -translate-x-1/2 rounded-xl border border-white/[0.10] bg-gradient-to-b from-white/[0.10] to-white/0 p-5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur transition-all duration-700 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.7)]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <CreditCardIcon size={16} strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <div className="h-2 w-24 rounded-full bg-foreground/20" />
            <div className="mt-2 h-1.5 w-16 rounded-full bg-white/[0.08]" />
          </div>
          <span className="rounded-full border border-accent/30 bg-accent/[0.08] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
            eligible
          </span>
        </div>

        <div className="mt-5 space-y-2.5">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2.5 font-mono text-[11px]">
              <CheckmarkCircle02Icon size={14} strokeWidth={1.5} className="shrink-0 text-success" />
              <span className="text-foreground/80">{step.label}</span>
              {i < STEPS.length - 1 && (
                <ArrowRight01Icon size={11} strokeWidth={1.5} className="ml-auto text-muted" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-accent/20 bg-accent/[0.08] px-4 py-3">
          <p className="font-mono text-[10px] text-muted uppercase tracking-[0.14em]">advance available</p>
          <p className="mt-1 font-mono text-xl font-medium text-accent">$2.50 cUSD</p>
          <p className="mt-0.5 font-mono text-[10px] text-muted">collateral locked · repay in installments</p>
        </div>
      </div>
    </div>
  );
}
