import { CheckmarkCircle02Icon, AlertCircleIcon } from "hugeicons-react";
import { Pill } from "@/components/ui/Pill";
import type { ReputationEvent } from "@/data/mockData";

const KIND_LABEL: Record<ReputationEvent["kind"], string> = {
  CONTRIBUTION: "contribution",
  REPAYMENT: "repayment",
  STREAK_MILESTONE: "milestone",
};

export function ReputationEventRow({
  event,
  isLast,
}: {
  event: ReputationEvent;
  isLast: boolean;
}) {
  return (
    <div className="relative flex gap-4 px-6 py-5 transition-colors hover:bg-white/[0.02]">
      <div className="flex flex-col items-center">
        <div className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[10px] ${
          event.kind === "STREAK_MILESTONE"
            ? "border-accent/50 bg-accent/15 text-accent"
            : "border-success/30 bg-success/10 text-success"
        }`}>
          {String(event.dayNumber).padStart(2, "0")}
        </div>
        {!isLast && (
          <span
            aria-hidden
            className="mt-1 w-px flex-1 bg-gradient-to-b from-success/30 via-white/10 to-white/0"
          />
        )}
      </div>

      <div className="flex-1 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-foreground">{event.label}</span>
          <Pill mono tone={event.kind === "STREAK_MILESTONE" ? "accent" : undefined}>
            {KIND_LABEL[event.kind]}
          </Pill>
          <span className="ml-auto font-mono text-[11px] text-success">
            +${event.amountCusd.toFixed(2)} cUSD
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5 font-mono">
            {event.onTime ? (
              <CheckmarkCircle02Icon size={12} strokeWidth={1.5} className="text-success" />
            ) : (
              <AlertCircleIcon size={12} strokeWidth={1.5} className="text-danger" />
            )}
            {event.onTime ? "on-time · recorded" : "missed · recorded"}
          </span>
          <span className="truncate font-mono text-[10px]">
            tx · {event.txHash.slice(0, 20)}…
          </span>
        </div>
      </div>
    </div>
  );
}
