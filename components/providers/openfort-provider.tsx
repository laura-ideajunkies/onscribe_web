'use client';

import { OpenfortProvider as BaseOpenfortProvider, AuthProvider as OpenfortAuthProvider, getDefaultConfig } from '@openfort/react';
import { AccountTypeEnum } from '@openfort/openfort-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';

const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: 'OnScribe',
    chains: [base],
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
            createEncryptedSessionEndpoint: 'https://onscribe-vercelendpoint.vercel.app/api/shield-session',
            recoverWalletAutomaticallyAfterAuth: true, // Automatically recover wallet after authentication
            accountType: AccountTypeEnum.SMART_ACCOUNT, // Use Smart Account (default, enables gas sponsorship)
            ethereumProviderPolicyId: {
              [base.id]: process.env.NEXT_PUBLIC_OPENFORT_GAS_POLICY_ID!, // Gas sponsorship policy for Base
            },
          }}
          uiConfig={{
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
