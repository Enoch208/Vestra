"use client";

import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { celo } from "@/lib/web3/chains";
import {
  reownProjectId,
  wagmiAdapter,
  wagmiConfig,
} from "@/lib/web3/wagmiConfig";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
});

if (typeof window !== "undefined" && reownProjectId) {
  createAppKit({
    adapters: [wagmiAdapter],
    networks: [celo],
    projectId: reownProjectId,
    metadata: {
      name: "Vestra",
      description:
        "Autonomous savings + credit agent on Celo. Save cUSD daily and build a portable onchain credit identity.",
      url:
        typeof window !== "undefined" ? window.location.origin : "https://vestra.app",
      icons: ["/vestra-mark.png"],
    },
    features: { analytics: false, email: false, socials: false },
    themeMode: "dark",
    themeVariables: {
      "--w3m-accent": "#F59E0B",
      "--w3m-color-mix": "#000000",
      "--w3m-color-mix-strength": 16,
      "--w3m-font-family":
        "var(--font-satoshi), ui-sans-serif, system-ui, sans-serif",
    },
  });
}

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
