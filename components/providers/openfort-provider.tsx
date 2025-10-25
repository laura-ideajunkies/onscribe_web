'use client';

import { OpenfortProvider as BaseOpenfortProvider, AuthProvider as OpenfortAuthProvider, getDefaultConfig } from '@openfort/react';
import { AccountTypeEnum } from '@openfort/openfort-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { defineChain } from 'viem';

const storyTestnet = defineChain({ 
  id: 1315, 
  name: "storyTestnet", 
  network: "Story Testnet", 
  nativeCurrency: { name: "Story", symbol: "IP", decimals: 18 }, 
  rpcUrls: { 
    default: { 
      http: [ 
        'https://aeneid.storyrpc.io'
      ] 
    }, 
  }, 
  blockExplorers: { 
    default: { 
      name: 'explorer', 
      url: 'https://aeneid.storyscan.io', 
    }, 
  },
  testnet: true, // or true, if live
});


const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: 'OnScribe',
    chains: [storyTestnet],
    transports: {[storyTestnet.id]: http()}, // Using HTTP transport for Story Testnet
    ssr: false,
  })
);

const queryClient = new QueryClient();

export function OpenfortProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <BaseOpenfortProvider
          publishableKey={process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY!}
          walletConfig={{
            shieldPublishableKey: process.env.NEXT_PUBLIC_SHIELD_PUBLISHABLE_KEY!,
            createEncryptedSessionEndpoint: 'https://onscribe-shield2.vercel.app/api/create-session',
            recoverWalletAutomaticallyAfterAuth: true, // Automatically recover wallet after authentication
            accountType: AccountTypeEnum.EOA, // Use Smart Account (default, enables gas sponsorship)
            ethereumProviderPolicyId: {
              [storyTestnet.id]: process.env.NEXT_PUBLIC_OPENFORT_GAS_POLICY_ID!, // Gas sponsorship policy for Base
            },
          }}
          uiConfig={{
            enforceSupportedChains: false, 
            authProviders: [
              OpenfortAuthProvider.EMAIL,
              OpenfortAuthProvider.GOOGLE,
            ],
          }}
        >
          {children}
        </BaseOpenfortProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
