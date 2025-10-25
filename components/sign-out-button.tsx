'use client';

import { useSignOut } from '@openfort/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const { toast } = useToast();
  const router = useRouter();

  const { signOut, isLoading, isError, error } = useSignOut({
    onSuccess: () => {
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });

      // Redirect to home page after sign out
      router.push('/');
      router.refresh();
    },
    onError: (error) => {
      console.error('Sign out error:', error);
      toast({
        title: 'Sign Out Failed',
        description: 'Could not sign you out. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signOut()}
      disabled={isLoading}
      className="text-muted-foreground hover:text-foreground"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </Button>
  );
}
