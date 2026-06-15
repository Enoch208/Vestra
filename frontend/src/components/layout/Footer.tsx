import Image from "next/image";
import Link from "next/link";
import { Github01Icon, NewTwitterIcon } from "hugeicons-react";
import { LiveDot } from "@/components/ui/LiveDot";

const COLUMNS = [
  {
    title: "Save",
    items: [
      { label: "MiniPay Mini App", href: "/dashboard" },
      { label: "Telegram bot", href: "https://t.me/VestraBot" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Credit identity", href: "#credit-identity" },
    ],
  },
  {
    title: "Build",
    items: [
      { label: "Contracts · Celo", href: "https://github.com/Enoch208/Vestra" },
      { label: "ERC-8004 registry", href: "https://8004scan.io" },
      { label: "Self Protocol", href: "https://self.xyz" },
      { label: "x402 payments", href: "https://x402.org" },
    ],
  },
  {
    title: "Hackathon",
    items: [
      { label: "Celo Agents", href: "https://celo.org" },
      { label: "8004scan", href: "https://8004scan.io" },
      { label: "MiniPay", href: "https://minipay.opera.com" },
      { label: "Celo docs", href: "https://docs.celo.org" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5 pt-24 pb-12">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[400px] w-[1000px] -translate-x-1/2 rounded-full bg-accent/5 blur-[120px]"
      />
      <div className="mx-auto grid max-w-[1300px] grid-cols-2 gap-x-8 gap-y-12 px-6 md:grid-cols-12">
        <div className="col-span-2 md:col-span-4">
          <Link href="/" className="flex cursor-pointer items-center gap-2.5">
            <Image src="/vestra-mark.png" alt="Vestra" width={28} height={28} className="rounded-md" />
            <span className="text-[15px] font-medium tracking-tight text-foreground">Vestra</span>
          </Link>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
            Autonomous savings + credit agent on Celo. Save small daily and build a portable onchain credit identity — for MiniPay&apos;s 15M+ underbanked users.
          </p>
          <div className="mt-6 flex items-center gap-3 text-muted">
            <a href="https://x.com/VestraApp" target="_blank" rel="noopener noreferrer" aria-label="X" className="cursor-pointer transition-colors hover:text-foreground">
              <NewTwitterIcon size={16} strokeWidth={1.5} />
            </a>
            <a href="https://github.com/Enoch208/Vestra" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="cursor-pointer transition-colors hover:text-foreground">
              <Github01Icon size={16} strokeWidth={1.5} />
            </a>
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title} className="col-span-1 md:col-span-2">
            <h4 className="mb-4 text-sm font-medium text-foreground">{col.title}</h4>
            <ul className="space-y-3 text-sm">
              {col.items.map((item) => (
                <li key={item.label}>
                  {item.href.startsWith("/") || item.href.startsWith("#") ? (
                    <Link href={item.href} className="cursor-pointer text-muted transition-colors hover:text-foreground">
                      {item.label}
                    </Link>
                  ) : (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-muted transition-colors hover:text-foreground">
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-16 flex max-w-[1300px] flex-col items-center justify-between gap-4 border-t border-white/5 px-6 pt-8 md:flex-row">
        <p className="font-mono text-[11px] text-muted">
          © 2026 Vestra · Built for the Celo Onchain Agents Hackathon
        </p>
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
          <LiveDot />
          agent online · Celo
        </div>
      </div>
    </footer>
  );
}
