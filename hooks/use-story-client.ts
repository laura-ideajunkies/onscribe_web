import { useMemo, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { createWalletClient, custom, http } from 'viem';
import { defineChain } from 'viem';

const storyTestnet = defineChain({
  id: 1315,
  name: "storyTestnet",
  network: "Story Testnet",
  nativeCurrency: { name: "Story", symbol: "IP", decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://aeneid.storyrpc.io']
    },
  },
  blockExplorers: {
    default: {
      name: 'explorer',
      url: 'https://aeneid.storyscan.io',
    },
  },
  testnet: true,
});

/**
 * Hook to get Story Protocol SDK client configured with user's Openfort wallet
 * @returns Story SDK client instance or null if wallet not connected
 */
export function useStoryClient() {
  const { address, isConnected, connector } = useAccount();
  const [walletClient, setWalletClient] = useState<any>(null);

  useEffect(() => {
    async function setupWalletClient() {
      if (!isConnected || !connector || !address) {
        console.log('useStoryClient - Not connected');
        setWalletClient(null);
        return;
      }

      try {
        console.log('useStoryClient - Getting provider from connector');
        const provider = await connector.getProvider();
        console.log('useStoryClient - Provider:', provider);

        const client = createWalletClient({
          account: address,
          chain: storyTestnet,
          transport: custom(provider),
        });

        console.log('useStoryClient - Wallet client created:', client);
        setWalletClient(client);
      } catch (error) {
        console.error('useStoryClient - Error creating wallet client:', error);
        setWalletClient(null);
      }
    }

    setupWalletClient();
  }, [isConnected, connector, address]);

  const client = useMemo(() => {
    if (!isConnected || !walletClient) {
      console.log('useStoryClient - No wallet client available. isConnected:', isConnected, 'walletClient:', !!walletClient);
      return null;
    }

    console.log('useStoryClient - Creating Story client');

    try {
      const config: StoryConfig = {
        wallet: walletClient,
        transport: http('https://aeneid.storyrpc.io'),
        chainId: 'aeneid',
      };

      const storyClient = StoryClient.newClient(config);
      console.log('useStoryClient - Story client created successfully');
      return storyClient;
    } catch (error) {
      console.error('useStoryClient - Error creating Story client:', error);
      return null;
    }
  }, [isConnected, walletClient]);

  return {
    client,
    isReady: !!client && isConnected,
    walletAddress: address,
  };
}
