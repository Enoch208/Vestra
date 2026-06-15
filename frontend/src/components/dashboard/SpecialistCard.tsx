import Link from "next/link";
import {
  ArrowUpRight01Icon,
} from "hugeicons-react";
import type { VestraUser } from "@/data/mockData";

const STATUS_LABEL: Record<VestraUser["status"], string> = {
  ACTIVE: "Saving",
  CREDIT_ACTIVE: "Credit active",
  PAUSED: "Paused",
};

const STATUS_COLOR: Record<VestraUser["status"], string> = {
  ACTIVE: "text-sky-300",
  CREDIT_ACTIVE: "text-accent",
  PAUSED: "text-muted",
};

type Props = {
  user: VestraUser;
};

export function SpecialistCard({ user }: Props) {
  return (
    <Link
      href={`/dashboard/savers/${user.id}`}
      className="group relative flex cursor-pointer flex-col gap-4 rounded-xl border border-white/5 bg-[#0B0C0E] p-5 transition-all duration-200 ease-out hover:-translate-y-px hover:border-white/10 hover:bg-white/[0.015]"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-mono text-[13px] text-foreground">
              {user.flag} {user.displayName}
            </h3>
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </div>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {user.country}
          </p>
        </div>
        <ArrowUpRight01Icon
          size={14}
          strokeWidth={1.5}
          className="shrink-0 cursor-pointer text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
        />
      </header>

      <div className="flex items-baseline justify-between border-y border-white/[0.04] py-3">
        <div className="flex flex-col">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">Daily</span>
          <span className="font-mono text-[16px] text-accent">
            ${user.dailyAmountCusd.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">Score</span>
          <span className="font-mono text-[16px] text-foreground">
            {user.score}
            <span className="ml-1 text-[11px] text-muted">/1000</span>
          </span>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-3 text-[11px]">
        <div>
          <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">Streak</dt>
          <dd className="mt-0.5 font-mono text-foreground/90">{user.streak}d</dd>
        </div>
        <div>
          <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">Saved</dt>
          <dd className="mt-0.5 font-mono text-foreground/90">${user.totalSavedCusd.toFixed(2)}</dd>
        </div>
        <div>
          <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">Status</dt>
          <dd className={`mt-0.5 font-mono ${STATUS_COLOR[user.status]}`}>
            {STATUS_LABEL[user.status]}
          </dd>
        </div>
      </dl>
    </Link>
  );
}
