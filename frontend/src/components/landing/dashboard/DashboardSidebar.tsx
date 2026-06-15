import Image from "next/image";
import {
  DashboardSquare01Icon,
  UserGroupIcon,
  RankingIcon,
  ShieldKeyIcon,
  Settings01Icon,
} from "hugeicons-react";

const NAV_ITEMS = [
  { icon: DashboardSquare01Icon, label: "Overview", active: false },
  { icon: UserGroupIcon, label: "Savers", active: true },
  { icon: RankingIcon, label: "Leaderboard", active: false },
  { icon: ShieldKeyIcon, label: "Credit identity", active: false },
  { icon: Settings01Icon, label: "Settings", active: false },
] as const;

export function DashboardSidebar() {
  return (
    <div className="flex h-full flex-col bg-[#0F1012]">
      <div className="flex h-14 items-center gap-2.5 border-b border-white/[0.05] px-4">
        <Image src="/vestra-mark.png" alt="Vestra" width={22} height={22} className="rounded-md" />
        <span className="text-[13px] font-medium text-foreground/95">Vestra</span>
        <span className="rounded-sm border border-white/[0.08] bg-white/[0.02] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
          Sepolia
        </span>
      </div>

      <div className="space-y-0.5 p-3">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-colors ${
              item.active
                ? "bg-white/[0.06] text-foreground"
                : "text-muted hover:bg-white/[0.04] hover:text-foreground/85"
            }`}
          >
            <item.icon size={14} strokeWidth={1.5} className={item.active ? "text-accent" : ""} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto border-t border-white/[0.05] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5 rounded-full bg-emerald-400">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />
          </span>
          <span className="font-mono text-[10px] text-muted">agent online · Celo</span>
        </div>
      </div>
    </div>
  );
}
