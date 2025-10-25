/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ipfs.dweb.link',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_OPENFORT_PUBLIC_KEY: process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY,
    NEXT_PUBLIC_SHIELD_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SHIELD_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SHIELD_ENCRYPTION_SHARE: process.env.NEXT_PUBLIC_SHIELD_ENCRYPTION_SHARE,
    NEXT_PUBLIC_OPENFORT_GAS_POLICY_ID: process.env.NEXT_PUBLIC_OPENFORT_GAS_POLICY_ID,
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

module.exports = nextConfig;
