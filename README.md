# OnScribe - Proof-of-Publish Platform

OnScribe is a Next.js 14 application that automatically protects creative IP when content is published. Writers and publishers can register their content as NFTs on Story Protocol, providing immutable proof of creation, copyright protection, and enabling revenue sharing from derivatives.

## Features

- **Seamless Web3 Integration**: Write and publish like Medium/Substack, with automatic IP protection
- **Story Protocol Integration**: Automatic IP Asset registration on Story Protocol (Aeneid testnet)
- **Embedded Wallets**: Openfort-powered EOA wallets with email/Google OAuth authentication
- **User Profile Management**: Mandatory profile completion with editable user profiles
- **Rich Text Editor**: TipTap-powered editor with formatting, images, and links
- **IPFS Storage**: Decentralized metadata storage via Pinata
- **Dashboard**: Manage articles, track IP protection status, and view analytics
- **Non-Commercial Social Remixing License**: PIL licensing for creative commons

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Openfort (Embedded Wallets)
- **Blockchain**: Story Protocol (Aeneid testnet - Chain ID 1315)
- **Storage**: IPFS via Pinata
- **Web3**: Wagmi, Viem
- **Editor**: TipTap
- **UI Components**: shadcn/ui with Radix UI primitives

## Project Structure

```
onscribe_web/
├── app/                          # Next.js 14 app router
│   ├── api/                      # API routes
│   │   ├── articles/            # Article CRUD operations
│   │   ├── users/profile/       # User profile API
│   │   └── shield-session/      # Openfort Shield session
│   ├── article/[slug]/          # Article view page
│   ├── dashboard/               # User dashboard
│   ├── editor/                  # Article editor
│   ├── profile/                 # User profile page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── providers/               # Context providers
│   │   ├── openfort-provider.tsx
│   │   └── auth-provider.tsx
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── ...
│   ├── article-card.tsx         # Article preview card
│   ├── wallet-manager.tsx       # Embedded wallet manager
│   ├── profile-completion-modal.tsx  # Profile setup modal
│   ├── nav-actions.tsx          # Navigation with user menu
│   ├── rich-text-editor.tsx     # TipTap editor
│   └── value-proposition-sidebar.tsx
├── hooks/                       # Custom React hooks
│   └── use-story-client.ts     # Story Protocol client hook
├── lib/                         # Utility libraries
│   ├── supabase.ts             # Supabase client (service & client)
│   ├── ipfs.ts                 # IPFS/Pinata integration
│   ├── openfort.ts             # Openfort SDK
│   └── utils.ts                # Helper functions
├── types/                       # TypeScript definitions
│   ├── index.ts                # Main types
│   └── database.ts             # Supabase types
├── public/                      # Static assets
├── unused/                      # Unused legacy files
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── next.config.js              # Next.js config
└── tailwind.config.ts          # Tailwind config
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for PostgreSQL database)
- Openfort account (for embedded wallets)
- Pinata account (for IPFS storage)
- Story Protocol Aeneid testnet tokens (available from faucet)

### 1. Clone and Install

```bash
cd onscribe_web
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Openfort (Embedded Wallets)
NEXT_PUBLIC_OPENFORT_PUBLIC_KEY=your_openfort_public_key
OPENFORT_SECRET_KEY=your_openfort_secret_key
NEXT_PUBLIC_SHIELD_API_KEY=your_shield_api_key
NEXT_PUBLIC_SHIELD_SECRET_KEY=your_shield_secret_key

# Story Protocol (Aeneid Testnet)
NEXT_PUBLIC_STORY_PROTOCOL_CHAIN_ID=1315
NEXT_PUBLIC_STORY_PROTOCOL_RPC_URL=https://rpc.odyssey.storyrpc.io
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=your_nft_contract_address
NEXT_PUBLIC_PIL_TERMS_ID=your_pil_terms_id

# Pinata IPFS
NEXT_PUBLIC_PINATA_GATEWAY=your_pinata_gateway
PINATA_JWT=your_pinata_jwt

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note**: This is a proprietary project. No `.env.example` file is provided.

### 3. Database Setup

The database schema is managed privately. Key tables include:
- `users` - User profiles with Openfort player IDs
- `articles` - Article content with IP Asset metadata
- Row-Level Security (RLS) policies for data protection

### 4. Openfort Setup

1. Create an Openfort account at [openfort.xyz](https://openfort.xyz)
2. Create a new project with Embedded Wallets enabled
3. Configure authentication methods (Email, Google OAuth)
4. Enable Shield for secure key management
5. Get your publishable key, secret key, and Shield credentials
6. Configure callback URLs for your application

### 5. Story Protocol Setup

1. Get Aeneid testnet tokens from the [Story Protocol faucet](https://faucet.story.foundation)
2. Deploy or use an existing NFT contract on Aeneid testnet (Chain ID: 1315)
3. Register PIL (Programmable IP License) terms for your license type
4. Note your PIL Terms ID for the environment variables

### 6. Pinata Setup

1. Create a Pinata account at [pinata.cloud](https://pinata.cloud)
2. Generate a JWT token with appropriate permissions
3. Get your dedicated gateway URL
4. IPFS will be used for storing article metadata

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Writers

1. **Sign In**: Click "Sign In" and authenticate with email or Google
2. **Complete Profile**: On first login, complete your profile (first name, surname, email)
3. **Embedded Wallet**: An Openfort EOA wallet is automatically created for you
4. **Write Article**: Click "Write" to open the editor
5. **Format Content**: Use the rich text editor to format your article
6. **Add Cover Image**: Paste a URL for your cover image (optional - gradient placeholders provided)
7. **Publish**: Click "Publish" to register your IP Asset on Story Protocol
8. **View IP Asset**: Track your IP Asset on the [Story Protocol Explorer](https://aeneid.explorer.story.foundation)

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

#### IP Asset Registration Flow

1. Article created in Supabase database with status "draft"
2. User clicks "Publish" in editor
3. Article metadata uploaded to IPFS via Pinata
4. NFT minted on Story Protocol Aeneid testnet
5. IP Asset registered with the NFT token
6. PIL (Programmable IP License) terms attached
7. Database updated with IP Asset ID and transaction hash
8. Article status changed to "published"

## Key Components

### Home Page
- Recent published articles (ordered by creation date)
- Colored gradient placeholders for articles without cover images
- Value proposition sidebar
- Sign In/User menu

### Editor
- TipTap rich text editor with formatting tools
- Cover image support (optional)
- Draft auto-save
- Publishing panel with IP Asset registration
- Network switching to Story Protocol Aeneid testnet

### Dashboard
- Article management (drafts and published)
- IP Asset status tracking
- Edit and delete capabilities

### Profile
- User profile editing (first name, surname, email)
- Profile completion modal on first login (non-dismissible)
- User dropdown menu with Profile/Dashboard/Sign Out

### Article View
- Clean reading experience
- IP Asset badge with explorer link
- Direct link to [Story Protocol Explorer](https://aeneid.explorer.story.foundation)
- License information (PIL terms)

## API Routes

### Articles
- `GET /api/articles` - Get all published articles
- `POST /api/articles` - Create new article
- `GET /api/articles/my-articles` - Get current user's articles
- `PATCH /api/articles/[id]` - Update article
- `DELETE /api/articles/[id]` - Delete article

### Users
- `GET /api/users/profile` - Get user profile by Openfort player ID
- `POST /api/users/profile` - Create new user profile
- `PATCH /api/users/profile` - Update user profile

### Authentication
- `POST /api/shield-session` - Create Openfort Shield session for embedded wallets

## Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy to Vercel
vercel
```

### Environment Variables

Ensure all environment variables from your `.env` file are set in Vercel's environment variables settings.

### Production Considerations

- Update `NEXT_PUBLIC_APP_URL` to your production domain
- Ensure Openfort callback URLs include your production domain
- Verify Supabase RLS policies are properly configured
- Test embedded wallet creation on production

## Security Considerations

1. **Environment Variables**: All sensitive data stored in `.env` (gitignored)
2. **Embedded Wallets**: Openfort Shield manages private keys securely
3. **RLS Policies**: Supabase Row-Level Security enabled on all tables
4. **Service Role**: Used only server-side for privileged operations
5. **Authentication**: Openfort handles auth tokens and session management
6. **Network Security**: All blockchain operations on testnet (Aeneid)

## Troubleshooting

### Wallet Creation Issues
- Check Openfort Shield credentials are correct
- Verify `localStorage` is enabled in browser
- Check browser console for error messages
- Ensure `/api/shield-session` endpoint is responding

### IPFS Upload Fails
- Verify Pinata JWT token is valid
- Check Pinata gateway URL is correct
- Ensure content size is within limits

### Story Protocol Registration Fails
- Check wallet has Aeneid testnet tokens ([get from faucet](https://faucet.story.foundation))
- Verify chain ID is 1315 (Aeneid testnet)
- Ensure NFT contract address is correct
- Check PIL Terms ID is valid
- Verify RPC URL: `https://rpc.odyssey.storyrpc.io`

### Authentication Issues
- Verify Openfort public and secret keys
- Check callback URLs in Openfort dashboard
- Ensure browser allows third-party cookies
- Clear browser cache and try again

## Technology Stack

This project leverages cutting-edge Web3 and Web2 technologies:

- **[Story Protocol](https://storyprotocol.xyz)** - Programmable IP infrastructure for on-chain IP Assets
- **[Openfort](https://openfort.xyz)** - Embedded wallet infrastructure with Shield key management
- **[Supabase](https://supabase.com)** - PostgreSQL database with Row-Level Security
- **[Pinata](https://pinata.cloud)** - IPFS pinning service for decentralized storage
- **[Next.js 14](https://nextjs.org)** - React framework with App Router
- **[TipTap](https://tiptap.dev)** - Headless rich-text editor
- **[shadcn/ui](https://ui.shadcn.com)** - Beautifully designed component library
- **[Wagmi](https://wagmi.sh)** & **[Viem](https://viem.sh)** - React hooks and TypeScript interfaces for Ethereum

## Project Status

This is a proprietary project. The codebase demonstrates integration of:
- Embedded wallet authentication (Openfort)
- On-chain IP Asset registration (Story Protocol)
- Decentralized metadata storage (IPFS/Pinata)
- Traditional web2 UX with web3 capabilities

## License

Proprietary - All rights reserved
