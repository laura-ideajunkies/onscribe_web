import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { OpenfortProvider } from '@/components/providers/openfort-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { WalletManager } from '@/components/wallet-manager';
import { ProfileCompletionModal } from '@/components/profile-completion-modal';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OnScribe - Protect Your Creative IP Automatically',
  description:
    'Automatically protect your creative IP when you publish. OnScribe registers your content as NFTs on Story Protocol, providing immutable proof of creation and copyright protection.',
  keywords: [
    'IP protection',
    'NFT',
    'Story Protocol',
    'content protection',
    'blockchain',
    'copyright',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <OpenfortProvider>
          <AuthProvider>
            <WalletManager />
            <ProfileCompletionModal />
            {children}
            <Toaster />
          </AuthProvider>
        </OpenfortProvider>
      </body>
    </html>
  );
}
