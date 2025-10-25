'use client';

import { useEffect, useState } from 'react';
import { useOpenfort, useWallets, RecoveryMethod } from '@openfort/react';
import { useToast } from '@/components/ui/use-toast';

const WALLET_CREATION_KEY = 'openfort_wallet_creation_attempted';

export function WalletManager() {
  const { user } = useOpenfort();
  const { createWallet, wallets, isCreating, isLoadingWallets } = useWallets();
  const { toast } = useToast();
  const [hasAttemptedCreation, setHasAttemptedCreation] = useState(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem(WALLET_CREATION_KEY) === 'true';
    }
    return false;
  });

  useEffect(() => {
    const createWalletForNewUser = async () => {
      // Wait for wallets to finish loading first
      if (isLoadingWallets) {
        console.log('WalletManager - Still loading wallets, waiting...');
        return;
      }

      // Only create wallet if:
      // 1. User is logged in
      // 2. User has no wallets (after loading is complete)
      // 3. Not currently creating a wallet
      // 4. Haven't already attempted to create a wallet (persisted in localStorage)
      if (user && wallets.length === 0 && !isCreating && !hasAttemptedCreation) {
        console.log('WalletManager - Creating embedded wallet for user...');

        // Mark as attempted immediately (both in state and localStorage)
        setHasAttemptedCreation(true);
        localStorage.setItem(WALLET_CREATION_KEY, 'true');

        try {
          await createWallet({
            recovery: {
              recoveryMethod: RecoveryMethod.AUTOMATIC,
            },
          });

          console.log('WalletManager - Wallet creation initiated successfully');
        } catch (error) {
          console.error('WalletManager - Error creating wallet:', error);

          // Allow retry on error by clearing the attempt flag
          setHasAttemptedCreation(false);
          localStorage.removeItem(WALLET_CREATION_KEY);

          toast({
            title: 'Wallet Creation Failed',
            description: 'Could not create your wallet. Please refresh the page to try again.',
            variant: 'destructive',
          });
        }
      } else if (user && wallets.length > 0) {
        // User already has wallets, ensure the flag is set
        console.log('WalletManager - User already has wallets:', wallets.length);
        if (!hasAttemptedCreation) {
          setHasAttemptedCreation(true);
          localStorage.setItem(WALLET_CREATION_KEY, 'true');
        }
      }
    };

    createWalletForNewUser();
  }, [user, wallets, createWallet, isCreating, isLoadingWallets, hasAttemptedCreation, toast]);

  // This component doesn't render anything
  return null;
}
