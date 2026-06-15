"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft01Icon } from "hugeicons-react";
import { SEED_USERS, RECENT_EVENTS, type SavingsEvent, type VestraUser } from "@/data/mockData";
import { api } from "@/lib/api";
import { SpecialistHeader } from "@/components/dashboard/specialist/SpecialistHeader";
import { SpecialistActivity } from "@/components/dashboard/specialist/SpecialistActivity";

const POLL_MS = 15_000;

export function SpecialistDetail({ name }: { name: string }) {
  const [users, setUsers] = useState<VestraUser[]>(SEED_USERS);
  const [events, setEvents] = useState<SavingsEvent[]>(RECENT_EVENTS);
  const [nowMs, setNowMs] = useState(0);

  useEffect(() => {
    const initial = setTimeout(() => setNowMs(Date.now()), 0);
    const clock = setInterval(() => setNowMs(Date.now()), 1000);
    let alive = true;
    const load = () => {
      api.users().then((n) => alive && n.length > 0 && setUsers(n)).catch(() => {});
      api.events(80).then((n) => alive && setEvents(n)).catch(() => {});
    };
    load();
    const poll = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearTimeout(initial);
      clearInterval(clock);
      clearInterval(poll);
    };
  }, []);

  const user = useMemo(() => users.find((u) => u.id === name || u.displayName === name), [users, name]);
  const userEvents = useMemo(
    () => events.filter((e) => e.userDisplay.toLowerCase().includes(name)).slice(0, 12),
    [events, name],
  );

  if (!user) {
    return (
      <div className="py-20 text-center">
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-muted">
          saver &ldquo;{name}&rdquo; not found
        </p>
        <Link
          href="/dashboard/specialists"
          className="mt-4 inline-flex cursor-pointer items-center gap-1.5 font-mono text-[11px] text-accent hover:text-foreground"
        >
          <ArrowLeft01Icon size={13} strokeWidth={1.5} />
          back to savers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SpecialistHeader user={user} />
      <SpecialistActivity events={userEvents} nowMs={nowMs} />
    </div>
  );
}
