'use client';

import { OpenfortButton as OpenfortAuthButton } from '@openfort/react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

interface OpenfortButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function OpenfortButton({
  variant = 'default',
  size = 'default',
  className,
}: OpenfortButtonProps) {
  return (
    <OpenfortAuthButton.Custom>
      {({ isLoading, show }) => (
        <Button
          variant={variant}
          size={size}
          className={`btn-gradient ${className || ''}`}
          onClick={show}
          disabled={isLoading}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isLoading ? 'Loading...' : 'Sign Up'}
        </Button>
      )}
    </OpenfortAuthButton.Custom>
  );
}
