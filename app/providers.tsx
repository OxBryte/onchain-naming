'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, sepolia } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import { createConfig, http } from 'wagmi';
import { useEffect, useState } from 'react';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo-project-id';

const metadata = {
  name: 'OnChain Naming',
  description: 'Buy and manage ENS domains',
  url: 'https://onchain-naming.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, sepolia],
  projectId,
});

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  adapters: [wagmiAdapter],
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, sepolia],
  projectId,
  metadata,
  features: {
    analytics: true,
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

