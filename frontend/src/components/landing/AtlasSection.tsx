import { GhostButton } from "@/components/ui/GhostButton";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { CreditIdentityCard } from "@/components/landing/AtlasTraceCard";
import { ArrowUpRight01Icon } from "hugeicons-react";

const PILLARS = [
  {
    label: "Non-custodial",
    title: "The agent never holds your money",
    body: "Your cUSD stays in the SavingsVault contract. The agent's key can only trigger capped daily pulls and write reputation events — it can never move funds to itself.",
  },
  {
    label: "Portable reputation",
    title: "A credit record that travels with you",
    body: "Every contribution and repayment is written to the ERC-8004 Reputation Registry. Any lender or app on Celo can read your credit history — no bank approval required.",
  },
] as const;

export function AtlasSection() {
  return (
    <section
      id="credit-identity"
      className="relative z-10 mx-auto mt-32 mb-32 max-w-[1300px] px-6"
    >
      <div className="mb-20 max-w-4xl">
        <EyebrowLabel tone="accent">Credit Identity · ERC-8004</EyebrowLabel>
        <h2 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-tighter text-foreground md:text-6xl">
          The savings habit you already practice.{" "}
          <span className="text-muted">The credit history you&apos;ve always been denied.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Tandas, chamas, susu, paluwagan — informal savings circles are
          everywhere. What&apos;s always been missing is a record. Vestra makes
          every save count on ERC-8004.
        </p>
        <div className="mt-8 inline-flex">
          <GhostButton
            href="https://8004scan.io"
            target="_blank"
            rel="noopener noreferrer"
            trailing={<ArrowUpRight01Icon size={14} strokeWidth={1.5} />}
          >
            View on 8004scan
          </GhostButton>
        </div>
      </div>

      <div className="mx-auto flex justify-center">
        <CreditIdentityCard />
      </div>

      <div className="mt-24 grid grid-cols-1 gap-12 border-t border-white/5 pt-16 md:grid-cols-2">
        {PILLARS.map((p) => (
          <div key={p.label}>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              {p.label}
            </p>
            <h3 className="mt-3 text-2xl font-medium tracking-tight text-foreground">
              {p.title}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-muted">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
