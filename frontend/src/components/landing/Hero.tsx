import { ArrowUpRight01Icon, ArrowDown01Icon } from "hugeicons-react";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { GhostButton } from "@/components/ui/GhostButton";
import { HeroBackground } from "@/components/landing/HeroBackground";
import { HeroIntro, HeroIntroItem } from "@/components/landing/HeroIntro";
import { HeroDashboardPreview } from "@/components/landing/HeroDashboardPreview";
import { LiveTickerStrip } from "@/components/landing/LiveTickerStrip";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-40 md:pt-44">
      <HeroBackground />

      <HeroIntro className="relative mx-auto max-w-5xl px-6">
        <HeroIntroItem>
          <EyebrowLabel tone="muted">
            Celo · Self Protocol · ERC-8004 · MiniPay
          </EyebrowLabel>
        </HeroIntroItem>

        <HeroIntroItem>
          <h1 className="mt-7 text-left text-5xl font-semibold leading-[1.05] tracking-tighter text-foreground md:text-7xl">
            Save small, daily.{" "}
            <span className="bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
              Build a credit name onchain.
            </span>
          </h1>
        </HeroIntroItem>

        <HeroIntroItem>
          <p className="mt-8 max-w-2xl text-left text-lg leading-relaxed text-muted md:text-xl">
            An autonomous savings agent for MiniPay. Save cUSD daily, build a
            portable credit identity onchain, and unlock advances — no bank, no
            collector, no trust required.
          </p>
        </HeroIntroItem>

        <HeroIntroItem>
          <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <PrimaryButton
              href="/dashboard"
              trailing={<ArrowUpRight01Icon size={16} strokeWidth={2} />}
            >
              Start saving
            </PrimaryButton>
            <GhostButton
              href="#how-it-works"
              trailing={<ArrowDown01Icon size={14} strokeWidth={1.5} />}
            >
              How it works
            </GhostButton>
          </div>
        </HeroIntroItem>

        <HeroIntroItem>
          <div className="mt-16 flex flex-wrap items-center gap-8 font-mono text-[11px] text-muted">
            {[
              { value: "15M+", label: "MiniPay users" },
              { value: "$0.10", label: "min daily save" },
              { value: "ERC-8004", label: "credit identity" },
              { value: "Self", label: "sybil resistant" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-base font-medium text-foreground">{value}</div>
                <div className="mt-0.5 uppercase tracking-[0.14em]">{label}</div>
              </div>
            ))}
          </div>
        </HeroIntroItem>
      </HeroIntro>

      <HeroDashboardPreview />

      <LiveTickerStrip />
    </section>
  );
}
