import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Pill } from "@/components/ui/Pill";
import { SEED_USERS } from "@/data/mockData";
import { SavingsUserRow } from "@/components/landing/SpecialistRow";

const COLUMNS = [
  { label: "User", span: "md:col-span-3" },
  { label: "Daily", span: "md:col-span-2" },
  { label: "Streak", span: "md:col-span-2" },
  { label: "Score", span: "md:col-span-2" },
  { label: "Saved", span: "md:col-span-2" },
  { label: "Status", span: "md:col-span-1" },
] as const;

export function SpecialistDirectory() {
  return (
    <section
      id="activity"
      className="relative z-10 mx-auto mt-32 mb-32 max-w-[1300px] px-6"
    >
      <div className="mb-12 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <EyebrowLabel>Active savers</EyebrowLabel>
          <h2 className="mt-4 text-4xl font-semibold tracking-tighter text-foreground md:text-5xl">
            Real users. Real credit records.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Self-verified savers building portable onchain credit identities on Celo — one daily contribution at a time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Pill mono>{SEED_USERS.length} verified</Pill>
          <Pill tone="accent" mono>live on Sepolia</Pill>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-card/40">
        <div className="flex items-center justify-between border-b border-white/[0.04] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          <span>Self-verified · one account per human</span>
          <span>ordered by streak</span>
        </div>
        <div className="grid grid-cols-12 gap-4 border-b border-white/[0.04] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {COLUMNS.map((c) => (
            <span key={c.label} className={`hidden md:inline-block ${c.span}`}>
              {c.label}
            </span>
          ))}
        </div>
        <div>
          {[...SEED_USERS]
            .sort((a, b) => b.streak - a.streak)
            .map((u) => (
              <SavingsUserRow key={u.id} user={u} />
            ))}
        </div>
      </div>
    </section>
  );
}
