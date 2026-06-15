"use client";

import { useEffect, useMemo, useState } from "react";
import { SEED_USERS } from "@/data/mockData";
import { api } from "@/lib/api";
import { SectionHeading } from "@/components/dashboard/SectionHeading";
import { LeaderboardRow } from "@/components/dashboard/LeaderboardRow";

type Metric = "streak" | "score" | "saved";

const TABS: { id: Metric; label: string }[] = [
  { id: "streak", label: "Streak" },
  { id: "score", label: "Score" },
  { id: "saved", label: "Saved" },
];

export function ReputationLeaderboard() {
  const [metric, setMetric] = useState<Metric>("streak");
  const [users, setUsers] = useState(SEED_USERS);

  useEffect(() => {
    let alive = true;
    api
      .users()
      .then((next) => alive && next.length > 0 && setUsers(next))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const ranked = useMemo(() => {
    const copy = [...users];
    copy.sort((a, b) => {
      if (metric === "streak") return b.streak - a.streak;
      if (metric === "score") return b.score - a.score;
      return b.totalSavedCusd - a.totalSavedCusd;
    });
    return copy;
  }, [metric, users]);

  const max = useMemo(() => {
    if (metric === "streak") return Math.max(...ranked.map((r) => r.streak));
    if (metric === "score") return Math.max(...ranked.map((r) => r.score));
    return Math.max(...ranked.map((r) => r.totalSavedCusd));
  }, [ranked, metric]);

  return (
    <section id="leaderboard" className="rounded-xl border border-white/5 bg-[#0B0C0E]">
      <div className="border-b border-white/5 px-5 pt-5">
        <SectionHeading
          eyebrow="Savers"
          title="Credit leaderboard"
          trailing={
            <div className="inline-flex rounded-md border border-white/5 bg-white/[0.02] p-0.5">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setMetric(t.id)}
                  className={`cursor-pointer rounded px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-200 ease-out ${
                    metric === t.id
                      ? "bg-white/[0.06] text-foreground"
                      : "text-muted hover:text-foreground/85"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          }
        />
      </div>

      <ul>
        {ranked.map((user, i) => (
          <LeaderboardRow
            key={user.id}
            rank={i + 1}
            user={user}
            metric={metric}
            maxMetric={max}
          />
        ))}
      </ul>
    </section>
  );
}
