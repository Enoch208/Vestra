import { ShieldKeyIcon, ArrowUpRight01Icon } from "hugeicons-react";
import { MAYA_CREDIT_RECORD } from "@/data/mockData";
import { SectionHeading } from "@/components/dashboard/SectionHeading";

export function AtlasPanel() {
  const record = MAYA_CREDIT_RECORD;
  return (
    <section
      id="credit-panel"
      className="overflow-hidden rounded-xl border border-white/5 bg-[#0B0C0E]"
    >
      <div className="border-b border-white/5 px-5 pt-5">
        <SectionHeading
          eyebrow="Credit identity · ERC-8004"
          title="Onchain savings record"
          trailing={
            <span className="hidden items-center gap-2 rounded-md border border-accent/25 bg-accent/[0.06] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent md:inline-flex">
              <ShieldKeyIcon size={13} strokeWidth={1.5} />
              Self verified
            </span>
          }
        />
      </div>

      <div className="flex flex-col gap-4 border-b border-white/5 px-5 py-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-[14.5px] leading-snug text-foreground/95">
            {record.userDisplay} · {record.flag} {record.country}
          </p>
          <p className="font-mono text-[11px] text-muted">
            Wallet · <span className="text-foreground/80">{record.walletShort}</span>
          </p>
        </div>

        <div className="flex items-center gap-5 md:shrink-0">
          <div className="text-right">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
              Credit score
            </span>
            <p className="font-mono text-[15px] text-accent">
              {record.score}/1000
            </p>
          </div>
          <a
            href="https://8004scan.io"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-[12px] text-foreground transition-colors duration-200 ease-out hover:border-white/15 hover:bg-white/[0.08] active:scale-[0.98]"
          >
            8004scan
            <ArrowUpRight01Icon
              size={11}
              strokeWidth={1.5}
              className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
            />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-px border-b border-white/5 bg-white/[0.03]">
        {[
          { label: "Daily amount", value: `$${record.dailyAmountCusd.toFixed(2)} cUSD` },
          { label: "Total saved", value: `$${record.totalSavedCusd.toFixed(2)} cUSD` },
          { label: "Advance eligible", value: `$${record.advanceEligibleCusd.toFixed(2)} cUSD` },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0B0C0E] px-4 py-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">{stat.label}</p>
            <p className="mt-1 font-mono text-[13px] text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="px-5 py-4">
        <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
          Reputation events · last {record.events.length}
        </p>
        <ul className="space-y-2">
          {record.events.slice(0, 5).map((ev) => (
            <li key={ev.txHash} className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.04] bg-white/[0.015] px-3 py-2">
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${ev.onTime ? "bg-emerald-400" : "bg-red-400"}`} />
                <span className="font-mono text-[11px] text-foreground/80">{ev.label}</span>
              </div>
              <span className="font-mono text-[11px] text-accent">${ev.amountCusd.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
