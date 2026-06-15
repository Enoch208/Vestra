"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { VESTRA_SUMMARY, type VestraSummary } from "@/data/mockData";
import { CounterTile } from "@/components/dashboard/CounterTile";

const POLL_MS = 15_000;

export function CountersStrip() {
  const [s, setS] = useState<VestraSummary>(VESTRA_SUMMARY);

  useEffect(() => {
    let alive = true;
    const load = () =>
      api
        .summary()
        .then((next) => alive && setS(next))
        .catch(() => {});
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <CounterTile
        label="Verified users"
        value={s.verifiedUsers > 0 ? String(s.verifiedUsers) : "—"}
        unit="Self-verified"
        accent
      />
      <CounterTile
        label="Total contributions"
        value={s.totalContributions > 0 ? String(s.totalContributions) : "—"}
        unit="on-chain"
      />
      <CounterTile
        label="cUSD saved"
        value={s.totalSavedCusd > 0 ? `$${s.totalSavedCusd.toFixed(2)}` : "—"}
        unit="cUSD"
      />
      <CounterTile
        label="Advances issued"
        value={s.advancesIssued > 0 ? String(s.advancesIssued) : "—"}
        unit="active"
      />
    </div>
  );
}
