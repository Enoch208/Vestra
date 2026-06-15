"use client";

import { RECENT_EVENTS, type SavingsEvent } from "@/data/mockData";

const STATUS_DOT: Record<SavingsEvent["status"], string> = {
  PENDING: "bg-white/40",
  CONFIRMED: "bg-white/70",
  RECORDED: "bg-accent",
};

const TYPE_LABEL: Record<SavingsEvent["type"], string> = {
  CONTRIBUTION: "saved",
  REPAYMENT: "repaid",
  ADVANCE: "advance",
};

const FEED = [...RECENT_EVENTS, ...RECENT_EVENTS, ...RECENT_EVENTS];

export function LiveTickerStrip() {
  return (
    <div
      className="group relative mt-14 overflow-hidden border-y border-white/[0.06] bg-canvas/40 py-3 backdrop-blur-sm md:-mt-6"
      style={{
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div className="flex w-max gap-10 whitespace-nowrap font-mono text-[11px] [animation:vestra-marquee_52s_linear_infinite] group-hover:[animation-play-state:paused]">
        {FEED.map((ev, i) => (
          <Chip key={`${ev.id}-${i}`} ev={ev} />
        ))}
      </div>
    </div>
  );
}

function Chip({ ev }: { ev: SavingsEvent }) {
  return (
    <div className="flex items-center gap-3 text-muted">
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[ev.status]}`} />
      <span className="text-foreground/80">{ev.userDisplay}</span>
      <span className="text-muted/70">{ev.country}</span>
      <span className="text-muted/60">·</span>
      <span className="text-foreground/70">{TYPE_LABEL[ev.type]}</span>
      <span className="text-muted/60">·</span>
      <span className="text-foreground/80">${ev.amountCusd.toFixed(2)} cUSD</span>
      <span className="text-muted/60">·</span>
      <span className={ev.status === "RECORDED" ? "uppercase tracking-[0.14em] text-accent" : "uppercase tracking-[0.14em] text-muted"}>
        {ev.status.toLowerCase()}
      </span>
    </div>
  );
}
