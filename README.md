# OnScribe - Proof-of-Publish Platform

OnScribe is a Next.js 14 application that automatically protects creative IP when content is published. Writers and publishers can register their content as NFTs on Story Protocol, providing immutable proof of creation, copyright protection, and enabling revenue sharing from derivatives.

## Features

- **Seamless Web3 Integration**: Write and publish like Medium/Substack, with automatic IP protection
- **Story Protocol Integration**: Automatic NFT minting and IP registration on publish
- **Openfort Authentication**: Wallet-less authentication with email/Google OAuth
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
- **Blockchain**: Story Protocol (Sepolia testnet)
- **Storage**: IPFS via Pinata
- **Web3**: Wagmi, Viem
- **Editor**: TipTap

## Project Structure

```
onscribe/
├── app/                          # Next.js 14 app router
│   ├── api/                      # API routes
│   │   ├── articles/            # Article CRUD operations
│   │   └── auth/                # Authentication endpoints
│   ├── article/[slug]/          # Article view page
│   ├── dashboard/               # User dashboard
│   ├── editor/                  # Article editor
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── providers/               # Context providers
│   │   ├── openfort-provider.tsx
│   │   └── auth-provider.tsx
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── article-card.tsx         # Article preview card
│   ├── ip-protection-badge.tsx  # IP status badge
│   ├── openfort-button.tsx      # Auth button
│   ├── rich-text-editor.tsx     # TipTap editor
│   └── value-proposition-sidebar.tsx
├── lib/                         # Utility libraries
│   ├── supabase.ts             # Supabase client
│   ├── ipfs.ts                 # IPFS/Pinata integration
│   ├── story-protocol.ts       # Story Protocol SDK
│   └── utils.ts                # Helper functions
├── types/                       # TypeScript definitions
│   ├── index.ts                # Main types
│   └── database.ts             # Supabase types
├── public/                      # Static assets
├── .env.example                # Environment template
├── supabase-schema.sql         # Database schema
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── next.config.js              # Next.js config
└── tailwind.config.ts          # Tailwind config
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Openfort account
- Pinata account
- Ethereum wallet with Sepolia testnet ETH

### 1. Clone and Install

```bash
cd onscribe_web
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Openfort
NEXT_PUBLIC_OPENFORT_PUBLIC_KEY=your_openfort_public_key
OPENFORT_SECRET_KEY=your_openfort_secret_key

# Story Protocol
NEXT_PUBLIC_STORY_PROTOCOL_CHAIN_ID=11155111
NEXT_PUBLIC_STORY_PROTOCOL_RPC_URL=your_rpc_url
STORY_PROTOCOL_PRIVATE_KEY=your_private_key_for_transactions
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=your_nft_contract_address

# Pinata IPFS
NEXT_PUBLIC_PINATA_GATEWAY=your_pinata_gateway
PINATA_JWT=your_pinata_jwt
PINATA_API_KEY=your_pinata_api_key
PINATA_API_SECRET=your_pinata_api_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

Run the SQL schema in your Supabase project:

```bash
# Copy the contents of supabase-schema.sql and run in Supabase SQL Editor
```

This creates:
- `users` table for user profiles
- `articles` table for content
- `ip_registrations` table for blockchain records
- Indexes for performance
- Row-Level Security policies

### 4. Openfort Setup

1. Create an Openfort account at [openfort.xyz](https://openfort.xyz)
2. Create a new project
3. Configure authentication methods (Email, Google OAuth)
4. Get your publishable key and secret key
5. Configure your redirect URLs

### 5. Story Protocol Setup

1. Get Sepolia testnet ETH from a faucet
2. Deploy or get access to an NFT contract on Sepolia
3. Configure the Story Protocol SDK with your contract address
4. Set up your private key for transactions (keep it secure!)

### 6. Pinata Setup

1. Create a Pinata account at [pinata.cloud](https://pinata.cloud)
2. Generate API keys
3. Get your dedicated gateway URL
4. Configure JWT for authentication

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Writers

1. **Connect Wallet**: Click "Connect Wallet" and authenticate with email or Google
2. **Write Article**: Click "Write" to open the editor
3. **Format Content**: Use the rich text editor to format your article
4. **Add Cover Image**: Paste a URL for your cover image
5. **Publish**: Click "Publish" to register your IP and make it live
6. **Track Status**: View IP protection status in your dashboard

### For Developers

#### Creating Articles

```typescript
const response = await fetch('/api/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Article',
    content: '<p>Article content...</p>',
    excerpt: 'Brief description',
    cover_image: 'https://...',
    status: 'published',
  }),
});
```

#### IP Registration Flow

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
- Analytics and views
- Draft management

### Article View
- Clean reading experience
- IP protection badge
- Blockchain verification links
- License information

## API Routes

- `POST /api/articles` - Create article
- `GET /api/articles/my-articles` - Get user's articles
- `GET /api/articles/[id]` - Get article by ID
- `PATCH /api/articles/[id]` - Update article
- `DELETE /api/articles/[id]` - Delete article
- `GET /api/auth/me` - Get current user

## Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy to Vercel
vercel
```

### Environment Variables

Ensure all environment variables are set in your deployment platform.

### Database Migrations

Run the SQL schema in your production Supabase instance.

## Security Considerations

1. **Private Keys**: Never commit private keys to version control
2. **RLS Policies**: Supabase Row-Level Security is enabled
3. **Authentication**: Implement proper JWT validation in production
4. **Rate Limiting**: Add rate limiting to API routes
5. **Content Moderation**: Consider adding content moderation before IP registration

## Troubleshooting

### IPFS Upload Fails
- Check Pinata API credentials
- Verify JWT is valid
- Ensure content size is within limits

### Story Protocol Registration Fails
- Check Sepolia ETH balance
- Verify contract address
- Ensure RPC URL is correct
- Check private key has permissions

### Authentication Issues
- Verify Openfort credentials
- Check redirect URLs are configured
- Ensure browser allows cookies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [github.com/yourusername/onscribe/issues]
- Documentation: [docs.onscribe.xyz]
- Discord: [discord.gg/onscribe]

## Acknowledgments

- Built with [Story Protocol](https://storyprotocol.xyz)
- Powered by [Openfort](https://openfort.xyz)
- Storage by [Pinata](https://pinata.cloud)
- Database by [Supabase](https://supabase.com)
