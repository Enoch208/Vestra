import { CountersStrip } from "@/components/dashboard/CountersStrip";
import { LiveFeedStream } from "@/components/dashboard/LiveFeedStream";

export default function DashboardOverviewPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-10 px-5 py-8 md:px-8 md:py-10">
      <header className="space-y-1.5">
        <h1 className="text-lg font-medium tracking-tight text-foreground">
          Savings + credit, onchain
        </h1>
        <p className="max-w-3xl text-[13px] leading-snug text-muted">
          Real contributions from Self-verified savers across emerging markets.
          Every event is written to Celo and feeds the ERC-8004 credit identity.
        </p>
      </header>
      <CountersStrip />
      <LiveFeedStream />
    </div>
  );
}
