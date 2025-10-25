'use client';

import { useWallets } from '@openfort/react';
import { Copy, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export function WalletDisplay() {
  const { activeWallet, wallets, isLoadingWallets } = useWallets();
  const { toast } = useToast();

  const copyAddress = () => {
    if (activeWallet?.address) {
      navigator.clipboard.writeText(activeWallet.address);
      toast({
        title: 'Address Copied!',
        description: 'Wallet address copied to clipboard.',
      });
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoadingWallets) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Wallet className="h-4 w-4 animate-pulse" />
        <span>Loading wallet...</span>
      </div>
    );
  }

  if (!activeWallet) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
        <Wallet className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">
          {truncateAddress(activeWallet.address)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={copyAddress}
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
      {wallets.length > 1 && (
        <span className="text-xs text-muted-foreground">
          +{wallets.length - 1} more
        </span>
      )}
    </div>
  );
}
