import type { SavingsEvent } from "@/data/mockData";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatRelativeTime } from "@/lib/format";

const TYPE_LABEL: Record<SavingsEvent["type"], string> = {
  CONTRIBUTION: "saved",
  REPAYMENT: "repaid",
  ADVANCE: "advance",
};

type Props = {
  events: SavingsEvent[];
  nowMs: number;
};

export function SpecialistActivity({ events, nowMs }: Props) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#0B0C0E] p-5">
      <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        Recent events
      </h3>

      {events.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-white/[0.06] px-4 py-8 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          no events yet
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-white/[0.04]">
          {events.map((ev) => (
            <li
              key={`${ev.id}-${ev.status}`}
              className="flex items-center justify-between gap-3 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <StatusBadge status={ev.status} />
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/80">
                  {TYPE_LABEL[ev.type]}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="font-mono text-[11px] text-foreground">
                  ${ev.amountCusd.toFixed(2)} cUSD
                </span>
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:inline">
                  {nowMs > 0 ? formatRelativeTime(ev.timestamp, nowMs) : "—"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
