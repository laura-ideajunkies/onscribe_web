# OnScribe - Quick Start Guide

Get OnScribe up and running in 15 minutes.

---

## Prerequisites

Before you begin, make sure you have:

- ✅ Node.js 18+ installed
- ✅ npm installed
- ✅ A code editor (VS Code recommended)
- ✅ Git installed

---

## Step 1: Install Dependencies (2 minutes)

```bash
cd onscribe_web
npm install
```

This installs all required packages including Next.js, React, Supabase, Story Protocol SDK, and more.

---

## Step 2: Set Up Services (10 minutes)

### A. Supabase (Database)

1. Go to [supabase.com](https://supabase.com)
2. Create new project (choose a region close to you)
3. Wait for database to provision (~2 minutes)
4. Go to SQL Editor
5. Copy-paste contents from `supabase-schema.sql`
6. Run the SQL
7. Go to Settings > API
8. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

### B. Openfort (Authentication)

1. Go to [openfort.xyz](https://openfort.xyz)
2. Sign up and create project
3. Enable Email authentication
4. Add redirect URL: `http://localhost:3000`
5. Copy:
   - Publishable key
   - Secret key

### C. Pinata (IPFS Storage)

1. Go to [pinata.cloud](https://pinata.cloud)
2. Sign up for free account
3. Go to API Keys
4. Create new key (enable all permissions)
5. Copy:
   - API Key
   - API Secret
   - JWT
6. Go to Gateways
7. Copy your gateway URL (e.g., `mygateway.mypinata.cloud`)

### D. Story Protocol (Blockchain)

1. Get Sepolia testnet ETH from [sepoliafaucet.com](https://sepoliafaucet.com)
2. Export your MetaMask private key (keep it secret!)
3. Get RPC URL from [Infura](https://infura.io) or [Alchemy](https://alchemy.com)
   - Or use public RPC: `https://rpc.sepolia.org`
4. Use Story Protocol's default NFT contract or deploy your own

---

## Step 3: Configure Environment (2 minutes)

Create `.env` file:

```bash
cp .env.example .env
```

Fill in with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Openfort
NEXT_PUBLIC_OPENFORT_PUBLIC_KEY=pk_test_your_key
OPENFORT_SECRET_KEY=sk_test_your_key

# Story Protocol
NEXT_PUBLIC_STORY_PROTOCOL_CHAIN_ID=11155111
NEXT_PUBLIC_STORY_PROTOCOL_RPC_URL=your_rpc_url
STORY_PROTOCOL_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS

# Pinata IPFS
NEXT_PUBLIC_PINATA_GATEWAY=your-gateway.mypinata.cloud
PINATA_JWT=your_jwt
PINATA_API_KEY=your_api_key
PINATA_API_SECRET=your_api_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: Never commit `.env` to git!

---

## Step 4: Run Development Server (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the OnScribe home page!

---

## Step 5: Test the Application (5 minutes)

### Test Authentication

1. Click "Connect Wallet"
2. Enter your email
3. Check your email for OTP
4. Enter OTP code
5. You should be authenticated

### Test Article Creation

1. Click "Write"
2. Add a title: "My First Article"
3. Write some content
4. Click "Publish"
5. Wait for success message
6. You'll be redirected to your article

### Test IP Registration

1. Wait 1-2 minutes
2. Refresh the article page
3. The "IP Pending" badge should change to "Protected IP"
4. You should see blockchain details:
   - IP Asset ID
   - Token ID
   - IPFS Hash
   - Transaction Hash
5. Click transaction link to view on Etherscan

### Test Dashboard

1. Click "Dashboard"
2. You should see your published article
3. View stats (total articles, published, drafts)
4. Test deleting an article (if you want)

---

## Common Issues

### "Failed to fetch articles"

**Solution**: Check your Supabase credentials in `.env`

```bash
# Verify these are correct
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### "IPFS upload failed"

**Solution**: Check Pinata credentials

```bash
# Verify these are correct
PINATA_JWT=...
PINATA_API_KEY=...
```

### "Story Protocol registration failed"

**Solution**: Check you have Sepolia ETH and correct RPC

```bash
# Verify these are correct
NEXT_PUBLIC_STORY_PROTOCOL_RPC_URL=...
STORY_PROTOCOL_PRIVATE_KEY=0x...
```

### Port 3000 already in use

**Solution**: Use a different port

```bash
PORT=3001 npm run dev
```

### Authentication not working

**Solution**: Check Openfort redirect URL

1. Go to Openfort dashboard
2. Settings > Authentication
3. Add: `http://localhost:3000`

---

## Next Steps

### Customize the Platform

1. **Update Branding**
   - Edit logo in header
   - Change colors in `tailwind.config.ts`
   - Update meta tags in `app/layout.tsx`

2. **Add Content**
   - Write test articles
   - Upload cover images
   - Test different content types

3. **Test Features**
   - Try all formatting options
   - Test draft saving
   - Check mobile responsiveness

### Learn More

- Read [README.md](README.md) for full feature list
- Check [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- See [DEPLOYMENT.md](DEPLOYMENT.md) when ready to deploy

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

---

## File Structure Quick Reference

```
Key files you might want to modify:

📄 Homepage: app/page.tsx
📄 Editor: app/editor/page.tsx
📄 Dashboard: app/dashboard/page.tsx
📄 Article View: app/article/[slug]/page.tsx

🎨 Styles: app/globals.css
🎨 Theme: tailwind.config.ts

🔧 API Routes: app/api/**
🔧 Database: supabase-schema.sql

📦 Components: components/**
📦 Utilities: lib/**
📦 Types: types/**
```

---

## Getting Help

If you get stuck:

1. Check the error message carefully
2. Review the relevant documentation file
3. Verify your `.env` file
4. Check service status (Supabase, Openfort, Pinata)
5. Open a GitHub issue
6. Join our Discord community

---

## Success Checklist

Before moving to production:

- [ ] All tests pass
- [ ] Authentication works
- [ ] Can create articles
- [ ] Can publish articles
- [ ] IP registration completes
- [ ] Articles display correctly
- [ ] Dashboard functions properly
- [ ] Mobile view looks good
- [ ] No console errors
- [ ] Environment variables documented

---

## You're Ready!

🎉 Congratulations! You now have OnScribe running locally.

Start writing, publish your first article, and see your work protected on the blockchain!

**Questions?** Check the other documentation files or reach out for support.

---

*Happy writing! Your voice, your ownership, your proof.*
