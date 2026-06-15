import Link from "next/link";
import { ArrowLeft01Icon } from "hugeicons-react";
import type { VestraUser } from "@/data/mockData";

const STATUS_LABEL: Record<VestraUser["status"], string> = {
  ACTIVE: "Saving",
  CREDIT_ACTIVE: "Credit active",
  PAUSED: "Paused",
};

export function SpecialistHeader({ user }: { user: VestraUser }) {
  return (
    <div>
      <Link
        href="/dashboard/savers"
        className="inline-flex cursor-pointer items-center gap-1.5 font-mono text-[11px] text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft01Icon size={13} strokeWidth={1.5} />
        all savers
      </Link>

      <div className="mt-5 flex flex-col gap-4 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="truncate font-mono text-2xl text-foreground">
              {user.flag} {user.displayName}
            </h1>
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            {user.country} · {STATUS_LABEL[user.status]}
          </p>
        </div>
        <div className="flex items-end gap-8">
          <Field label="Daily amount" value={`$${user.dailyAmountCusd.toFixed(2)} cUSD`} accent />
          <Field label="Credit score" value={`${user.score}/1000`} />
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field label="Streak" value={`${user.streak} days`} />
        <Field label="Total saved" value={`$${user.totalSavedCusd.toFixed(2)} cUSD`} />
        <Field label="Status" value={STATUS_LABEL[user.status]} />
        {(user.advanceOutstandingCusd ?? 0) > 0 && (
          <Field label="Advance outstanding" value={`$${(user.advanceOutstandingCusd ?? 0).toFixed(2)}`} />
        )}
      </dl>
    </div>
  );
}

function Field({
  label,
  value,
  accent = false,
}: {
  label: React.ReactNode;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">{label}</dt>
      <dd className={`font-mono text-[15px] ${accent ? "text-accent" : "text-foreground"}`}>
        {value}
      </dd>
    </div>
  );
}
