import {
  SEED_USERS,
  RECENT_EVENTS,
  VESTRA_SUMMARY,
  type SavingsEvent,
  type VestraSummary,
  type VestraUser,
} from "@/data/mockData";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:4000/ws/feed";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  summary: () =>
    fetchJson<VestraSummary>("/api/summary").catch(() => VESTRA_SUMMARY),
  users: () => fetchJson<VestraUser[]>("/api/users").catch(() => SEED_USERS),
  events: (limit = 30) =>
    fetchJson<SavingsEvent[]>(`/api/events?limit=${limit}`).catch(() =>
      RECENT_EVENTS.slice(0, limit)
    ),
};

export type WsMessage =
  | { type: "event"; payload: SavingsEvent }
  | { type: "summary"; payload: VestraSummary }
  | { type: "hello"; payload: { mode: "chain" | "mock"; serverTimeIso: string } };
