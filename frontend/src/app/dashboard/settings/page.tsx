import type { ReactNode } from "react";
import { ConnectWallet } from "@/components/dashboard/ConnectWallet";
import { RateAgentButton } from "@/components/dashboard/RateAgentButton";
import { API_BASE, WS_URL } from "@/lib/api";

export const metadata = { title: "Settings · Vestra" };

const EXPLORER = "https://celo-sepolia.blockscout.com";

const CONTRACTS = [
  { label: "SavingsVault", address: "0xab871C4B7DB644f0c447319784662bF9b022811E" },
  { label: "CreditModule", address: "0x4D7ba5c3a2184AA8979AEF251c49ee8bA30A80BB" },
  { label: "cUSD (test)", address: "0x24eD128B46e54d3Cb20F33B5b872073f45E61454" },
  { label: "ERC-8004 Reputation", address: "0x8004B663056A597Dffe9eCcC1965A193B7388713" },
];

const RESOURCES = [
  { label: "GitHub", href: "https://github.com/Enoch208/Vestra" },
  { label: "ERC-8004 · 8004scan", href: "https://8004scan.io" },
  { label: "Self Protocol", href: "https://self.xyz" },
];

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-white/5 bg-[#0B0C0E] p-5">
      <h2 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-white/5 py-2.5 first:border-t-0 first:pt-0">
      <span className="shrink-0 text-[13px] text-muted">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer truncate font-mono text-[12.5px] text-foreground/85 transition-colors hover:text-accent"
        >
          {value}
        </a>
      ) : (
        <span className="truncate font-mono text-[12.5px] text-foreground/85">{value}</span>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-[760px] space-y-5 px-5 py-8 md:px-8 md:py-10">
      <header className="space-y-1.5">
        <h1 className="text-lg font-medium tracking-tight text-foreground">Settings</h1>
        <p className="text-[13px] text-muted">
          Connection, network, and the on-chain contracts powering Vestra.
        </p>
      </header>

      <Card title="Wallet">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[13px] text-muted">
            Connect a wallet to view your savings vault, streak, and credit
            identity on Celo.
          </span>
          <ConnectWallet />
        </div>
      </Card>

      <Card title="Reputation">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="max-w-sm text-[13px] text-muted">
            Saved with Vestra? Vouch for the agent on the ERC-8004 Reputation
            Registry — your feedback is recorded onchain to agentId {361}.
          </span>
          <RateAgentButton />
        </div>
      </Card>

      <Card title="Network">
        <Row label="Chain" value="Celo Sepolia" />
        <Row label="Chain ID" value="11142220" />
        <Row label="Explorer" value="celo-sepolia.blockscout.com" href={EXPLORER} />
      </Card>

      <Card title="Contracts">
        {CONTRACTS.map((c) => (
          <Row
            key={c.label}
            label={c.label}
            value={`${c.address.slice(0, 10)}…${c.address.slice(-6)}`}
            href={`${EXPLORER}/address/${c.address}`}
          />
        ))}
      </Card>

      <Card title="Connection">
        <Row label="Indexer API" value={API_BASE} href={API_BASE} />
        <Row label="Live feed" value={WS_URL} />
      </Card>

      <Card title="Resources">
        {RESOURCES.map((r) => (
          <Row key={r.label} label={r.label} value="open ↗" href={r.href} />
        ))}
      </Card>
    </div>
  );
}
