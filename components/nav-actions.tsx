'use client';

import { useOpenfort } from '@openfort/react';
import { OpenfortButton } from '@/components/openfort-button';
import { WalletDisplay } from '@/components/wallet-display';
import { SignOutButton } from '@/components/sign-out-button';

export function NavActions() {
  const { user } = useOpenfort();

  // Show wallet display and sign-out button if user is logged in
  if (user) {
    return (
      <div className="flex items-center gap-2">
        <WalletDisplay />
        <SignOutButton />
      </div>
    );
  }

  // Show sign-up button if user is not logged in
  return <OpenfortButton />;
}
