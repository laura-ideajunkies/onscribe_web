# OnScribe Architecture

## System Overview

OnScribe is a proof-of-publish platform that combines traditional web publishing with Web3 IP protection. The architecture is designed to provide a seamless user experience while handling complex blockchain operations in the background.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │  Editor  │  │Dashboard │  │ Article  │   │
│  │   Page   │  │   Page   │  │   Page   │  │   View   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Authentication (Openfort Provider)            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Article  │  │   Auth   │  │   User   │  │   IPFS   │   │
│  │   API    │  │   API    │  │   API    │  │   API    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│   Supabase    │ │   Openfort    │ │    Pinata     │ │    Story      │
│  (Database)   │ │    (Auth)     │ │    (IPFS)     │ │   Protocol    │
└───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘
```

## Core Components

### 1. Frontend Layer

#### Pages
- **Home Page** (`/`): Article feed with value proposition sidebar
- **Editor** (`/editor`): Rich text editor with publishing panel
- **Dashboard** (`/dashboard`): User article management
- **Article View** (`/article/[slug]`): Published article display

#### Components
- **UI Components**: Reusable components (buttons, cards, badges)
- **Custom Components**: Domain-specific components (article cards, IP badges)
- **Providers**: Context providers for auth and Web3

### 2. API Layer

#### Article Management
```
POST   /api/articles           - Create article
GET    /api/articles/my-articles - Get user articles
GET    /api/articles/[id]      - Get article by ID
PATCH  /api/articles/[id]      - Update article
DELETE /api/articles/[id]      - Delete article
```

#### Authentication
```
GET    /api/auth/me            - Get current user
```

### 3. Data Layer

#### Supabase Schema
```sql
users
├── id (uuid, primary key)
├── email (text, unique)
├── name (text)
├── avatar_url (text)
├── wallet_address (text, unique)
├── openfort_player_id (text, unique)
├── created_at (timestamp)
└── updated_at (timestamp)

articles
├── id (uuid, primary key)
├── title (text)
├── slug (text, unique)
├── content (text)
├── excerpt (text)
├── cover_image (text)
├── author_id (uuid, foreign key -> users)
├── status (enum: draft, published)
├── ipfs_hash (text)
├── ip_asset_id (text)
├── nft_token_id (text)
├── license_terms_id (text)
├── transaction_hash (text)
├── published_at (timestamp)
├── created_at (timestamp)
├── updated_at (timestamp)
└── views (integer)

ip_registrations
├── id (uuid, primary key)
├── article_id (uuid, foreign key -> articles)
├── ip_asset_id (text)
├── nft_token_id (text)
├── license_terms_id (text)
├── ipfs_hash (text)
├── transaction_hash (text)
├── chain_id (integer)
├── metadata (jsonb)
└── created_at (timestamp)
```

## Data Flow

### Publishing Flow

```
1. User writes article in editor
   └─> Content stored in local state

2. User clicks "Publish"
   └─> POST /api/articles
       ├─> Validate user authentication
       ├─> Generate slug from title
       ├─> Insert article into database
       └─> Trigger IP registration (async)

3. IP Registration Process (background)
   ├─> Upload content to IPFS (Pinata)
   │   └─> Returns IPFS hash
   │
   ├─> Register IP on Story Protocol
   │   ├─> Mint NFT
   │   ├─> Attach license terms
   │   └─> Returns IP asset ID, token ID, transaction hash
   │
   └─> Update article record
       ├─> Store IPFS hash
       ├─> Store IP asset ID
       ├─> Store NFT token ID
       ├─> Store transaction hash
       └─> Create IP registration record

4. Article live with IP protection
   └─> User can view on blockchain
```

### Authentication Flow

```
1. User clicks "Connect Wallet"
   └─> Openfort modal opens

2. User authenticates
   ├─> Email + OTP
   └─> Google OAuth

3. Openfort creates/retrieves player
   └─> Returns user session

4. Frontend calls /api/auth/me
   └─> Returns user profile from database

5. User authenticated
   └─> Can create/manage articles
```

### Article View Flow

```
1. User navigates to /article/[slug]
   └─> Server-side data fetch

2. Fetch article from database
   ├─> Include author information
   └─> Increment view count

3. Render article
   ├─> Display content
   ├─> Show IP protection badge
   └─> Display blockchain verification links

4. If IP protected
   └─> Show IP asset details
       ├─> IPFS link
       ├─> Transaction link
       └─> License information
```

## Security Architecture

### Authentication
- Openfort handles wallet-less authentication
- JWT tokens for session management
- User ID passed in headers for API requests

### Authorization
- Row-Level Security (RLS) in Supabase
- Users can only modify their own articles
- Published articles are publicly readable

### Data Protection
- Environment variables for sensitive keys
- Private keys never exposed to frontend
- Service role key only used server-side

## Scalability Considerations

### Database
- Indexes on frequently queried columns
- Separate table for IP registrations
- View count increment via stored procedure

### Storage
- IPFS for decentralized content storage
- Cover images can be on IPFS or CDN
- Database only stores metadata and hashes

### Blockchain
- Asynchronous IP registration
- Transaction batching possible for high volume
- Retry logic for failed registrations

### Caching
- Next.js built-in caching for static content
- Article pages can be statically generated
- API responses can be cached

## Technology Decisions

### Why Next.js 14?
- Server-side rendering for SEO
- App Router for modern patterns
- API routes for backend logic
- Built-in optimization

### Why Supabase?
- PostgreSQL with great DX
- Real-time capabilities
- Row-Level Security
- Easy auth integration

### Why Openfort?
- Wallet-less Web3 experience
- Multiple auth methods
- Embedded wallet management
- Great for onboarding

### Why Story Protocol?
- Purpose-built for IP management
- Built-in licensing
- Revenue sharing capabilities
- NFT-based ownership

### Why IPFS/Pinata?
- Decentralized storage
- Content addressing
- Permanent availability
- Easy API integration

## Future Enhancements

### Phase 2
- Search and filtering
- Article tags and categories
- User profiles and following
- Comments and reactions

### Phase 3
- Revenue sharing implementation
- Derivative work tracking
- Analytics dashboard
- Content recommendations

### Phase 4
- Mobile applications
- API for third-party integrations
- Advanced licensing options
- Multi-chain support

## Monitoring and Maintenance

### Logging
- Server-side console logs
- Error tracking (consider Sentry)
- Transaction monitoring

### Metrics
- Article publication rate
- IP registration success rate
- User engagement
- Performance metrics

### Maintenance
- Regular dependency updates
- Database backup and recovery
- Key rotation policies
- Smart contract upgrades

## Development Workflow

### Local Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter
```

### Testing
- Unit tests for utilities
- Integration tests for API routes
- E2E tests for critical flows

### Deployment
- Automated via Vercel
- Environment-specific configs
- Database migrations
- Blockchain deployment
