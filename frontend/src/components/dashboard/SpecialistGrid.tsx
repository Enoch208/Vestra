"use client";

import { useEffect, useMemo, useState } from "react";
import { Search01Icon } from "hugeicons-react";
import { SEED_USERS } from "@/data/mockData";
import { api } from "@/lib/api";
import { SectionHeading } from "@/components/dashboard/SectionHeading";
import { SpecialistCard } from "@/components/dashboard/SpecialistCard";

export function SpecialistGrid() {
  const [query, setQuery] = useState("");
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

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.displayName.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q),
    );
  }, [query, users]);

  return (
    <section id="savers" className="space-y-5">
      <SectionHeading
        eyebrow="Savers directory"
        title="Verified savers building credit"
        description="Self-verified individuals saving daily on Celo and building portable onchain credit identities."
      />

      <div className="flex items-center gap-2 rounded-md border border-white/5 bg-white/[0.02] px-3 py-2 transition-colors focus-within:border-white/15">
        <Search01Icon size={14} strokeWidth={1.5} className="text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or country…"
          aria-label="Search savers"
          className="flex-1 bg-transparent text-[12.5px] text-foreground placeholder:text-muted/60 outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.18em] text-muted hover:text-foreground"
          >
            clear
          </button>
        )}
      </div>

      {matches.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/[0.06] px-4 py-10 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          no savers match &ldquo;{query}&rdquo;
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {matches.map((user) => (
            <SpecialistCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </section>
  );
}
