'use client';

import { useEffect, useState } from 'react';
import { useOpenfort, useWallets, RecoveryMethod } from '@openfort/react';
import { useToast } from '@/components/ui/use-toast';

export function WalletManager() {
  const { user } = useOpenfort();
  const { createWallet, wallets, isCreating } = useWallets();
  const { toast } = useToast();
  const [hasAttemptedCreation, setHasAttemptedCreation] = useState(false);

  useEffect(() => {
    const createWalletForNewUser = async () => {
      // Only create wallet if:
      // 1. User is logged in
      // 2. User has no wallets
      // 3. Not currently creating a wallet
      // 4. Haven't already attempted to create a wallet this session
      if (user && wallets.length === 0 && !isCreating && !hasAttemptedCreation) {
        setHasAttemptedCreation(true);

        try {
          console.log('Creating embedded wallet for user...');
          await createWallet({
            recovery: {
              recoveryMethod: RecoveryMethod.AUTOMATIC,
            },
          });

          console.log('Wallet creation initiated - Openfort will handle the UI');
          // Removed success toast - Openfort's authentication flow already shows wallet creation UI
        } catch (error) {
          console.error('Error creating wallet:', error);
          setHasAttemptedCreation(false); // Allow retry on error

          toast({
            title: 'Wallet Creation Failed',
            description: 'Could not create your wallet. Please refresh the page to try again.',
            variant: 'destructive',
          });
        }
      }
    };

    createWalletForNewUser();
  }, [user, wallets, createWallet, isCreating, hasAttemptedCreation, toast]);

  // This component doesn't render anything
  return null;
}
