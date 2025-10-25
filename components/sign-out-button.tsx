'use client';

import { useSignOut } from '@openfort/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const { signOut, isPending } = useSignOut();
  const { toast } = useToast();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();

      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });

      // Redirect to home page after sign out
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: 'Sign Out Failed',
        description: 'Could not sign you out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      disabled={isPending}
      className="text-muted-foreground hover:text-foreground"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isPending ? 'Signing out...' : 'Sign Out'}
    </Button>
  );
}
