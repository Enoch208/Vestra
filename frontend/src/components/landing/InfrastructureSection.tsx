import { ArrowUpRight01Icon } from "hugeicons-react";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { InfraCard } from "@/components/landing/InfraCard";
import { CodeEditorVisual } from "@/components/landing/visuals/CodeEditorVisual";
import { CompositionVisual } from "@/components/landing/visuals/CompositionVisual";
import { ReputationVisual } from "@/components/landing/visuals/ReputationVisual";
import { OnboardingVisual } from "@/components/landing/visuals/OnboardingVisual";

export function InfrastructureSection() {
  return (
    <section
      id="how-it-works"
      className="relative z-10 mx-auto max-w-[1300px] px-6 pt-24 pb-24"
    >
      <div className="mb-20 max-w-4xl">
        <EyebrowLabel>How Vestra works</EyebrowLabel>
        <h2 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-tighter text-foreground md:text-6xl">
          Save daily.{" "}
          <br className="hidden md:block" />
          <span className="text-muted">Build credit. Unlock advances.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          No bank account. No credit history. No collector who can vanish with
          your cash. Just a daily habit — and an onchain record no one can take
          from you.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <PrimaryButton
            href="/dashboard"
            trailing={<ArrowUpRight01Icon size={16} strokeWidth={2} />}
          >
            Start saving
          </PrimaryButton>
          <a
            href="https://t.me/VestraBot"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
          >
            Open Telegram bot
            <ArrowUpRight01Icon
              size={14}
              strokeWidth={1.5}
              className="text-muted transition-all group-hover:text-accent group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
        <InfraCard
          title="Verify once with Self"
          description="Prove you're a real, unique human with Self Protocol's zero-knowledge proof. One account per person, no personal data stored."
          visual={<CodeEditorVisual />}
        />
        <InfraCard
          title="Agent auto-collects daily"
          description="Grant one capped allowance to the vault. The agent pulls your daily amount — never more, never twice a day. Your cUSD, your control."
          visual={<CompositionVisual />}
        />
        <InfraCard
          title="Every save builds reputation"
          description="Every on-time save writes a record to the ERC-8004 Reputation Registry. Your streak grows, your score compounds — portable to any lender on Celo."
          visual={<ReputationVisual />}
        />
        <InfraCard
          title="Unlock savings-backed advances"
          description="Hit a qualifying streak and the agent offers a small advance, backed by your own savings. Repay in installments — each one builds your record."
          visual={<OnboardingVisual />}
        />
      </div>
    </section>
  );
}
