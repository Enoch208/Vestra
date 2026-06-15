"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight01Icon,
  Copy01Icon,
} from "hugeicons-react";
import type { SavingsEvent } from "@/data/mockData";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatRelativeTime, shortenHex } from "@/lib/format";

const EXPLORER_TX = "https://celo-sepolia.blockscout.com/tx";

const TYPE_LABEL: Record<SavingsEvent["type"], string> = {
  CONTRIBUTION: "saved",
  REPAYMENT: "repaid",
  ADVANCE: "advance",
};

type Props = {
  tx: SavingsEvent;
  nowMs: number;
};

export function LiveFeedRow({ tx, nowMs }: Props) {
  const [copied, setCopied] = useState(false);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(tx.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-white/[0.04] px-4 py-2.5 transition-colors hover:bg-white/[0.02] md:grid-cols-[auto_1fr_1.4fr_auto_auto]"
    >
      <StatusBadge status={tx.status} />

      <div className="flex min-w-0 items-center gap-2">
        <span className="font-mono text-[11px] text-foreground/85">
          {tx.userDisplay}
        </span>
        <button
          onClick={copyId}
          aria-label={copied ? "Copied" : "Copy user ID"}
          className={`cursor-pointer transition-opacity ${
            copied
              ? "text-accent opacity-100"
              : "text-muted opacity-0 hover:text-foreground group-hover:opacity-100"
          }`}
        >
          <Copy01Icon size={11} strokeWidth={1.5} />
        </button>
      </div>

      <div className="hidden min-w-0 items-center gap-2 text-[12px] md:flex">
        <span className="truncate font-mono text-muted">{tx.country}</span>
        <span className="font-mono text-muted/50">·</span>
        <span className="truncate font-mono text-foreground/80 uppercase tracking-[0.14em] text-[11px]">
          {TYPE_LABEL[tx.type]}
        </span>
        {tx.streak && (
          <>
            <span className="font-mono text-muted/50">·</span>
            <span className="font-mono text-[11px] text-accent">{tx.streak}d streak</span>
          </>
        )}
      </div>

      <div className="flex items-baseline justify-end gap-1.5">
        <span className="font-mono text-[12px] text-foreground">
          ${tx.amountCusd.toFixed(2)}
        </span>
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-muted sm:inline">
          cUSD
        </span>
      </div>

      <div className="flex items-center gap-2.5 pl-3">
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted/80 sm:inline">
          {nowMs > 0 ? formatRelativeTime(tx.timestamp, nowMs) : "—"}
        </span>
        {tx.txHash ? (
          <a
            href={`${EXPLORER_TX}/${tx.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on Celoscan"
            className="cursor-pointer rounded-sm border border-white/5 bg-white/[0.02] p-1 text-muted transition-colors hover:border-white/15 hover:bg-white/[0.06] hover:text-foreground"
          >
            <ArrowUpRight01Icon size={11} strokeWidth={1.5} />
          </a>
        ) : (
          <span className="rounded-sm border border-white/5 bg-white/[0.02] p-1 text-muted/30">
            <ArrowUpRight01Icon size={11} strokeWidth={1.5} />
          </span>
        )}
      </div>
    </motion.li>
  );
}
