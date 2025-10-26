'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Save, User as UserIcon, Wallet, Copy, Check, ExternalLink } from 'lucide-react';
import { OpenfortButton as OpenfortAuthButton, useWallets } from '@openfort/react';
import { useAccount } from 'wagmi';

export default function ProfilePage() {
  const { user, loading, refreshUserProfile } = useAuth();
  const { toast } = useToast();
  const { wallets, isLoadingWallets } = useWallets();
  const { address: wagmiAddress } = useAccount();
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Get wallet address from Openfort wallet or wagmi as fallback
  const openfortAddress = wallets.length > 0 ? wallets[0].address : null;
  const walletAddress = openfortAddress || wagmiAddress || null;

  // Debug wallet information
  useEffect(() => {
    console.log('Profile - Wallets:', wallets);
    console.log('Profile - isLoadingWallets:', isLoadingWallets);
    console.log('Profile - openfortAddress:', openfortAddress);
    console.log('Profile - wagmiAddress:', wagmiAddress);
    console.log('Profile - final walletAddress:', walletAddress);
    if (wallets.length > 0) {
      console.log('Profile - First wallet object:', wallets[0]);
    }
  }, [wallets, isLoadingWallets, openfortAddress, wagmiAddress, walletAddress]);

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setSurname(user.surname || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Validation
  const isFormValid =
    firstName.trim().length >= 2 &&
    surname.trim().length >= 2 &&
    email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const hasChanges =
    firstName.trim() !== (user?.first_name || '') ||
    surname.trim() !== (user?.surname || '') ||
    email.trim() !== (user?.email || '');

  const handleCopyAddress = async () => {
    if (!walletAddress) return;

    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopiedAddress(true);
      toast({
        title: 'Address Copied',
        description: 'Wallet address copied to clipboard',
      });
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Could not copy address to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast({
        title: 'Invalid Input',
        description: 'Please fill in all fields correctly',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '',
        },
        body: JSON.stringify({
          first_name: firstName.trim(),
          surname: surname.trim(),
          email: email.trim().toLowerCase(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }

      // Refresh user profile data
      await refreshUserProfile();

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been saved successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You need to be signed in to view your profile.
            </p>
            <OpenfortAuthButton.Custom>
              {({ show }: any) => (
                <Button className="btn-gradient w-full" onClick={show}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              )}
            </OpenfortAuthButton.Custom>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Profile Form */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Wallet Information Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Wallet Information</CardTitle>
                  <CardDescription>
                    Your embedded wallet address for testing
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingWallets ? (
                <div className="text-sm text-muted-foreground">
                  Loading wallet...
                </div>
              ) : walletAddress ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Wallet Address</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted px-3 py-2 rounded-md font-mono text-sm break-all">
                        {walletAddress}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleCopyAddress}
                        className="shrink-0"
                      >
                        {copiedAddress ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Share this address with judges to receive testnet tokens for testing.{' '}
                      <a
                        href="https://faucet.story.foundation"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Get testnet tokens
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No wallet found. Your wallet will be created automatically when you sign in.
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <UserIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>User Profile</CardTitle>
                  <CardDescription>
                    Manage your personal information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="first-name"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      minLength={2}
                      maxLength={50}
                      required
                      disabled={saving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surname">
                      Surname <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="surname"
                      type="text"
                      placeholder="Smith"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      minLength={2}
                      maxLength={50}
                      required
                      disabled={saving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.smith@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={!isFormValid || !hasChanges || saving}
                    className="flex-1"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Link href="/dashboard" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
