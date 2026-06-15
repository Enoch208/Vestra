import {
  Link01Icon,
  MoreHorizontalIcon,
  Clock01Icon,
  UserIcon,
} from "hugeicons-react";
import { DashboardCodeBlock } from "@/components/landing/dashboard/DashboardCodeBlock";
import { DashboardActivity } from "@/components/landing/dashboard/DashboardActivity";

export function DashboardMainPanel() {
  return (
    <div className="relative flex h-full flex-col bg-[#0B0C0E]">
      <div className="flex h-14 items-center justify-between border-b border-white/[0.05] px-6">
        <div className="flex items-center gap-2 text-muted">
          <span className="font-mono text-[11px]">Vestra</span>
          <span className="text-[11px]">/</span>
          <span className="font-mono text-[11px] text-foreground/80">maya.celo</span>
        </div>
        <div className="flex gap-4 text-muted">
          <Link01Icon size={14} strokeWidth={1.5} className="cursor-pointer hover:text-foreground/80" />
          <MoreHorizontalIcon size={14} strokeWidth={1.5} className="cursor-pointer hover:text-foreground/80" />
        </div>
      </div>

      <div className="overflow-y-auto p-8">
        <h2 className="mb-4 text-2xl font-medium tracking-tight text-foreground">
          Savings record · maya.celo
        </h2>

        <div className="mb-8 flex items-center gap-6 border-b border-white/[0.05] pb-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
              <UserIcon size={11} strokeWidth={1.5} className="text-muted" />
            </div>
            <span className="text-[13px] text-muted">
              Verified by{" "}
              <span className="text-foreground/85">Self Protocol</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock01Icon size={14} strokeWidth={1.5} className="text-accent" />
            <span className="text-[13px] text-muted">28 consecutive days</span>
          </div>
        </div>

        <div className="space-y-6 text-[14px] leading-relaxed text-foreground/75">
          <p>
            Maya saves $0.10 cUSD every day via MiniPay. The Vestra agent pulls
            her daily allowance, writes a reputation event onchain, and updates
            her credit score automatically — no action required after setup.
          </p>

          <DashboardCodeBlock />

          <p>
            After 28 days, her score has reached{" "}
            <span className="font-mono text-accent">680/1000</span>.
            She is now eligible for a{" "}
            <span className="text-foreground">$2.50 cUSD</span> advance —
            fully collateralized by her SavingsVault balance.
          </p>
        </div>

        <DashboardActivity />
      </div>
    </div>
  );
}
