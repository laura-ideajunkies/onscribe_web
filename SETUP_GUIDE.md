# OnScribe Setup Guide

This guide will walk you through setting up OnScribe from scratch.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Supabase Setup

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### Run Database Schema

1. Open Supabase SQL Editor
2. Copy contents from `supabase-schema.sql`
3. Execute the SQL

This creates:
- Users table
- Articles table
- IP registrations table
- Indexes and RLS policies

### Get Service Role Key

1. Go to Project Settings > API
2. Copy the `service_role` key (keep it secret!)

## Step 3: Openfort Setup

### Create Openfort Account

1. Go to [openfort.xyz](https://openfort.xyz)
2. Sign up for a new account
3. Create a new project

### Configure Authentication

1. Navigate to Authentication settings
2. Enable Email authentication
3. Enable Google OAuth (optional)
4. Add redirect URLs:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)

### Get API Keys

1. Go to API Keys section
2. Copy Publishable Key
3. Copy Secret Key

## Step 4: Pinata IPFS Setup

### Create Pinata Account

1. Go to [pinata.cloud](https://pinata.cloud)
2. Sign up for a free account
3. Navigate to API Keys

### Generate API Keys

1. Click "New Key"
2. Enable all permissions
3. Copy:
   - API Key
   - API Secret
   - JWT

### Get Gateway URL

1. Go to Gateways
2. Copy your dedicated gateway URL

## Step 5: Story Protocol Setup

### Get Testnet ETH

1. Go to [sepoliafaucet.com](https://sepoliafaucet.com)
2. Request Sepolia ETH
3. Save your wallet address

### Deploy NFT Contract (Optional)

If you want your own contract:

1. Use Remix or Hardhat
2. Deploy ERC721 contract on Sepolia
3. Verify contract on Etherscan
4. Save contract address

Or use Story Protocol's default NFT contract.

### Get RPC URL

Options:
- Infura: [infura.io](https://infura.io)
- Alchemy: [alchemy.com](https://alchemy.com)
- Public RPC: `https://rpc.sepolia.org`

### Prepare Private Key

1. Export private key from MetaMask
2. **Never commit this to git!**
3. Keep it in `.env` only

## Step 6: Environment Variables

Create `.env` file:

```bash
cp .env.example .env
```

Fill in all values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Openfort
NEXT_PUBLIC_OPENFORT_PUBLIC_KEY=pk_test_...
OPENFORT_SECRET_KEY=sk_test_...

# Story Protocol
NEXT_PUBLIC_STORY_PROTOCOL_CHAIN_ID=11155111
NEXT_PUBLIC_STORY_PROTOCOL_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
STORY_PROTOCOL_PRIVATE_KEY=0x...
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...

# Pinata IPFS
NEXT_PUBLIC_PINATA_GATEWAY=mygateway.mypinata.cloud
PINATA_JWT=eyJhbGc...
PINATA_API_KEY=...
PINATA_API_SECRET=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 7: Test the Setup

### Start Development Server

```bash
npm run dev
```

### Test Checklist

- [ ] Home page loads at http://localhost:3000
- [ ] Can click "Connect Wallet" and authenticate
- [ ] Can access editor at /editor
- [ ] Rich text editor loads and works
- [ ] Can save draft (creates article in database)
- [ ] Can publish article (triggers IP registration)
- [ ] Dashboard shows articles at /dashboard
- [ ] Article view page displays content

### Test IP Registration

1. Create a test article
2. Add some content
3. Click "Publish"
4. Wait 1-2 minutes
5. Check article page for IP Asset ID
6. Verify transaction on Sepolia Etherscan

## Step 8: Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Add all environment variables
4. Deploy

### Production Checklist

- [ ] Update `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Add production URL to Openfort redirects
- [ ] Use production Supabase instance
- [ ] Enable Vercel analytics
- [ ] Set up custom domain
- [ ] Enable HTTPS
- [ ] Test all functionality in production

## Troubleshooting

### "Failed to fetch articles"

**Cause**: Database connection issue

**Solution**:
1. Check Supabase URL and keys
2. Verify SQL schema was run
3. Check RLS policies are enabled

### "IPFS upload failed"

**Cause**: Pinata authentication issue

**Solution**:
1. Verify Pinata JWT is valid
2. Check API keys are correct
3. Ensure gateway URL is correct

### "Story Protocol registration failed"

**Cause**: Transaction or contract issue

**Solution**:
1. Check you have Sepolia ETH
2. Verify contract address
3. Check private key is correct
4. Verify RPC URL is working

### Authentication not working

**Cause**: Openfort configuration issue

**Solution**:
1. Verify Openfort keys
2. Check redirect URLs are configured
3. Clear browser cache
4. Try incognito mode

## Advanced Configuration

### Custom NFT Contract

Deploy your own ERC721:

```solidity
// contracts/OnScribeNFT.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract OnScribeNFT is ERC721 {
    constructor() ERC721("OnScribe", "ONSC") {}
}
```

### Custom License Terms

Modify Story Protocol integration:

```typescript
// lib/story-protocol.ts
const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
  // ... customize license terms
});
```

### Add Image Upload

Replace URL input with file upload:

```typescript
// Use uploadImageToIPFS from lib/ipfs.ts
const imageHash = await uploadImageToIPFS(file);
const imageUrl = getIPFSUrl(imageHash);
```

## Next Steps

1. Customize the design to match your brand
2. Add more authentication methods
3. Implement search and filtering
4. Add analytics and tracking
5. Build revenue sharing features
6. Add content moderation
7. Implement notifications
8. Create mobile app

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Story Protocol Docs](https://docs.storyprotocol.xyz)
- [Openfort Docs](https://docs.openfort.xyz)
- [Supabase Docs](https://supabase.com/docs)
- [Pinata Docs](https://docs.pinata.cloud)

## Support

Need help? Reach out:
- GitHub Issues
- Discord Community
- Email: support@onscribe.xyz
