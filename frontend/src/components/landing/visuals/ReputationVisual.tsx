import { LiveDot } from "@/components/ui/LiveDot";

const DAY_COUNT = 30;
const ON_TIME_DAYS = new Set([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]);
const MISSED_DAYS = new Set([15]);

export function ReputationVisual() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/0 px-6 py-6 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]"
        style={{
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
          maskImage: "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              Savings streak · ERC-8004
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <LiveDot />
              <span className="font-mono text-[11px] text-foreground/80">
                written to Celo
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-2xl font-medium text-accent">28</span>
            <span className="font-mono text-[10px] text-muted">consecutive days</span>
          </div>
        </div>

        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: DAY_COUNT }, (_, i) => {
            const day = i + 1;
            const isPast = day <= 28;
            const isMissed = MISSED_DAYS.has(day);
            const isOnTime = ON_TIME_DAYS.has(day) && !isMissed;
            return (
              <div
                key={day}
                title={`Day ${day}`}
                className={`h-5 w-full rounded-sm transition-all duration-300 ${
                  isMissed
                    ? "bg-danger/50"
                    : isOnTime
                    ? "bg-success/60 group-hover:bg-success/80"
                    : isPast
                    ? "bg-white/10"
                    : "bg-white/[0.04]"
                }`}
              />
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <div className="flex items-center gap-3 font-mono text-[10px] text-muted">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-success/60" /> on-time</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-danger/50" /> missed</span>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] text-muted">credit score</p>
            <p className="font-mono text-base font-medium text-accent">680 / 1000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
