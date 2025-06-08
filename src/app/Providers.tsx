"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  anvil,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode, useMemo } from "react";
import useIsMounted from "@/hooks/useIsMounted";

interface ProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export default function Providers({ children }: ProvidersProps) {
  const isMounted = useIsMounted();

  // Create config only when mounted (client-side)
  const config = useMemo(() => {
    if (!isMounted) return null;

    return getDefaultConfig({
      appName: "My RainbowKit App",
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
      chains: [mainnet, polygon, optimism, arbitrum, base, anvil],
      ssr: false,
    });
  }, [isMounted]);

  if (!isMounted || !config) {
    return <>Loading web3</>;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
