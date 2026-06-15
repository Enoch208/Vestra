"use client";

import { useEffect, useRef, useState } from "react";
import { api, WS_URL, type WsMessage } from "@/lib/api";
import type { SavingsEvent } from "@/data/mockData";

type Status = "connecting" | "open" | "closed" | "fallback";

const POLL_MS = 10_000;

export function useLiveFeed(seed: SavingsEvent[], maxRows = 14) {
  const [rows, setRows] = useState<SavingsEvent[]>(seed);
  const [status, setStatus] = useState<Status>("connecting");
  const [mode, setMode] = useState<"chain" | "mock" | "client-mock">("mock");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = () =>
      api
        .events(maxRows)
        .then((evs) => {
          if (cancelled || evs.length === 0) return;
          setRows(evs.slice(0, maxRows));
        })
        .catch(() => {});
    load();
    const poll = setInterval(load, POLL_MS);

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;
      ws.onopen = () => {
        if (!cancelled) setStatus("open");
      };
      ws.onmessage = (event) => {
        if (cancelled) return;
        try {
          const msg = JSON.parse(event.data) as WsMessage;
          if (msg.type === "event") {
            setRows((prev) =>
              prev.some((e) => e.id === msg.payload.id && e.status === msg.payload.status)
                ? prev
                : [msg.payload, ...prev].slice(0, maxRows),
            );
          } else if (msg.type === "hello") {
            setMode(msg.payload.mode);
          }
        } catch {
          /* ignore malformed frames */
        }
      };
      ws.onclose = () => {
        if (!cancelled) setStatus("closed");
      };
      ws.onerror = () => ws.close();
    } catch {
      /* REST polling keeps the feed live even without a socket */
    }

    return () => {
      cancelled = true;
      clearInterval(poll);
      wsRef.current?.close();
    };
  }, [seed, maxRows]);

  return { rows, status, mode };
}
