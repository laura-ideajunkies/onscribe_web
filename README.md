# OnScribe - Proof-of-Publish Platform

OnScribe is a Next.js 14 application that automatically protects creative IP when content is published. Writers and publishers can register their content as NFTs on Story Protocol, providing immutable proof of creation, copyright protection, and enabling revenue sharing from derivatives.

## Features

- **Seamless Web3 Integration**: Write and publish like Medium/Substack, with automatic IP protection
- **Story Protocol Integration**: Automatic NFT minting and IP registration on publish
- **Openfort Authentication**: Frictionless authentication with email/Google OAuth and automatic wallet creation
- **Rich Text Editor**: TipTap-powered editor with formatting, images, and links
- **IPFS Storage**: Decentralized content storage via Pinata
- **Dashboard**: Manage articles, track IP protection status, and view analytics
- **Non-Commercial Social Remixing**: Built-in licensing for creative commons

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Openfort
- **Blockchain**: Story Protocol (Aeneid testnet)
- **Storage**: IPFS via Pinata
- **Web3**: Wagmi, Viem
- **Editor**: TipTap

## IP Registration Flow

1. Article created in database
2. Content uploaded to IPFS
3. NFT minted on Story Protocol
4. License terms attached (Non-Commercial Social Remixing)
5. Database updated with blockchain data

## Key Components

### Home Page
- Article feed with infinite scroll
- Value proposition sidebar
- Search functionality
- Authentication button

### Editor
- Rich text formatting
- Image upload
- Live preview
- Publishing panel with IP info

### Dashboard
- Article management
- IP protection status
- Draft management

### Article View
- Clean reading experience
- IP protection badge
- Blockchain verification links
- License information

## Acknowledgments

- Built with [Story Protocol](https://story.foundation)
- Powered by [Openfort](https://openfort.io)
- Storage by [Pinata](https://pinata.cloud)
- Database by [Supabase](https://supabase.com)
