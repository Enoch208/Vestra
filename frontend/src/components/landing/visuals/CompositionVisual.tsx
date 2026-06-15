import { ArrowRight01Icon, LockIcon, Wallet01Icon } from "hugeicons-react";

export function CompositionVisual() {
  return (
    <div className="flex h-full items-center justify-center overflow-hidden px-8 pt-10">
      <div className="relative flex w-full max-w-[400px] flex-col items-center gap-4">
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 -z-10 h-[200px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.06] blur-[60px]"
        />

        <div className="w-full rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/0 p-4 transition-all duration-500 group-hover:-translate-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] text-foreground/70">
              <Wallet01Icon size={16} strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-mono text-[11px] text-muted uppercase tracking-[0.14em]">MiniPay wallet</p>
              <p className="text-sm text-foreground">maya.celo · 0x1a2b…9a0b</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 font-mono text-[11px]">
            <span className="text-muted">ERC-20 allowance granted</span>
            <span className="text-accent">$0.10 / day</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
          <span className="h-px w-8 bg-white/10" />
          <div className="flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/[0.06] px-3 py-1.5 text-accent">
            <span className="relative flex h-1.5 w-1.5 rounded-full bg-accent">
              <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
            </span>
            Vestra agent · pulls once per 24h
          </div>
          <span className="h-px w-8 bg-white/10" />
        </div>

        <div className="w-full rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/0 p-4 transition-all duration-500 group-hover:translate-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <LockIcon size={16} strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-mono text-[11px] text-muted uppercase tracking-[0.14em]">SavingsVault contract</p>
              <p className="text-sm text-foreground">non-custodial · agent never holds principal</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
              <p className="text-muted">balance</p>
              <p className="text-foreground mt-0.5">$2.80 cUSD</p>
            </div>
            <div className="rounded-lg border border-accent/15 bg-accent/[0.06] px-3 py-2">
              <p className="text-muted">streak</p>
              <p className="text-accent mt-0.5">28 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
