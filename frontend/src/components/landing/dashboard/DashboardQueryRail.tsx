import {
  Clock01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  FilterIcon,
} from "hugeicons-react";
import type { ComponentType } from "react";

type IconCmp = ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
type StatusKind = "pending" | "confirmed" | "recorded" | "missed";

const STATUS: Record<StatusKind, { icon: IconCmp; label: string; tint: string }> = {
  pending: { icon: Clock01Icon, label: "Pending", tint: "text-accent" },
  confirmed: { icon: CheckmarkCircle02Icon, label: "Confirmed", tint: "text-sky-400" },
  recorded: { icon: CheckmarkCircle02Icon, label: "Recorded", tint: "text-emerald-400" },
  missed: { icon: AlertCircleIcon, label: "Missed", tint: "text-red-400" },
};

type Row = {
  id: string;
  title: string;
  status: StatusKind;
  meta?: string;
  active?: boolean;
  avatarTone: string;
};

const ROWS: Row[] = [
  {
    id: "EVT-0029",
    title: "maya.celo · saved $0.10 · day 29",
    status: "recorded",
    meta: "score: 692",
    active: true,
    avatarTone: "from-amber-700/60 to-amber-500/60",
  },
  {
    id: "EVT-0028",
    title: "sofia.celo · saved $0.25 · day 42",
    status: "recorded",
    avatarTone: "from-zinc-700 to-zinc-600",
  },
  {
    id: "EVT-0027",
    title: "priya.celo · repaid $1.00 advance",
    status: "confirmed",
    avatarTone: "from-zinc-700 to-zinc-600",
  },
  {
    id: "EVT-0026",
    title: "rafael.celo · saved $0.15 · day 21",
    status: "pending",
    meta: "confirming",
    avatarTone: "from-amber-800/60 to-zinc-700",
  },
];

export function DashboardQueryRail() {
  return (
    <div className="flex h-full flex-col bg-[#0B0C0E]">
      <div className="flex h-14 items-center justify-between border-b border-white/[0.05] px-5">
        <span className="text-[13px] font-medium text-foreground/85">Live feed</span>
        <FilterIcon size={14} strokeWidth={1.5} className="cursor-pointer text-muted/80 hover:text-foreground/80" />
      </div>

      <ul className="flex-1 overflow-hidden">
        {ROWS.map((row) => {
          const meta = STATUS[row.status];
          const Icon = meta.icon;
          return (
            <li
              key={row.id}
              className={`group flex cursor-pointer flex-col gap-1 border-b border-white/[0.05] p-4 transition-colors ${
                row.active
                  ? "border-l-2 border-l-accent bg-[#16181D]"
                  : "border-l-2 border-l-transparent hover:bg-[#131416]"
              }`}
            >
              <div className="mb-1 flex items-center gap-2">
                <span
                  className={`font-mono text-[11px] ${row.active ? "text-accent" : "text-muted group-hover:text-foreground/60"}`}
                >
                  {row.id}
                </span>
                {row.meta && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-muted/60" />
                    <span className="text-[11px] text-muted">{row.meta}</span>
                  </>
                )}
              </div>
              <span
                className={`text-[13px] leading-snug ${
                  row.active
                    ? "font-medium text-foreground"
                    : "text-foreground/65 group-hover:text-foreground/95"
                }`}
              >
                {row.title}
              </span>
              <div className="mt-2 flex items-center gap-2">
                <Icon size={14} strokeWidth={1.5} className={meta.tint} />
                <span className="text-[11px] text-muted">{meta.label}</span>
                <span
                  className={`ml-auto h-5 w-5 rounded-full border border-black/40 bg-gradient-to-tr ${row.avatarTone}`}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
