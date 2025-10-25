# OnScribe Deployment Guide

This guide covers deploying OnScribe to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database schema applied to production
- [ ] Supabase RLS policies enabled
- [ ] Openfort production keys obtained
- [ ] Story Protocol contract deployed
- [ ] Pinata production account setup
- [ ] Domain name registered (if applicable)
- [ ] SSL certificate configured

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the best integration with Next.js.

#### Steps

1. **Connect Repository**
   ```bash
   # Push code to GitHub
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/onscribe.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select "onscribe_web" directory

3. **Configure Environment Variables**

   In Vercel dashboard, add all environment variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_OPENFORT_PUBLIC_KEY=
   OPENFORT_SECRET_KEY=
   NEXT_PUBLIC_STORY_PROTOCOL_CHAIN_ID=
   NEXT_PUBLIC_STORY_PROTOCOL_RPC_URL=
   STORY_PROTOCOL_PRIVATE_KEY=
   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=
   NEXT_PUBLIC_PINATA_GATEWAY=
   PINATA_JWT=
   PINATA_API_KEY=
   PINATA_API_SECRET=
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Get deployment URL

5. **Custom Domain (Optional)**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Configure DNS records as shown
   - Wait for SSL certificate

#### Vercel Configuration

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### Option 2: Docker

Deploy using Docker for any cloud provider.

#### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    restart: unless-stopped
```

#### Deploy

```bash
# Build
docker build -t onscribe .

# Run
docker run -p 3000:3000 --env-file .env.production onscribe
```

### Option 3: AWS

Deploy to AWS using Amplify or EC2.

#### AWS Amplify

1. Connect GitHub repository
2. Configure build settings
3. Add environment variables
4. Deploy

#### AWS EC2

1. Launch EC2 instance (Ubuntu)
2. SSH into instance
3. Install Node.js and npm
4. Clone repository
5. Install dependencies
6. Build application
7. Run with PM2

```bash
# On EC2 instance
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

git clone https://github.com/yourusername/onscribe.git
cd onscribe/onscribe_web
npm install
npm run build

# Install PM2
sudo npm install -g pm2

# Start application
pm2 start npm --name "onscribe" -- start
pm2 save
pm2 startup
```

## Post-Deployment

### 1. Update Openfort

Update redirect URLs in Openfort dashboard:
- Add production URL: `https://yourdomain.com`
- Add callback URLs

### 2. Test Application

- [ ] Home page loads correctly
- [ ] Authentication works
- [ ] Can create and publish articles
- [ ] IP registration completes
- [ ] Articles display correctly
- [ ] Dashboard functions properly

### 3. Configure DNS

For custom domain:
```
Type: A
Name: @
Value: [Vercel IP]

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4. Enable HTTPS

Vercel automatically provides SSL certificates.

For self-hosted:
```bash
# Install certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com
```

### 5. Set Up Analytics

- Google Analytics
- Vercel Analytics
- Custom event tracking

### 6. Configure Monitoring

- Error tracking (Sentry)
- Uptime monitoring (UptimeRobot)
- Performance monitoring (New Relic)

## Environment-Specific Configuration

### Production

```env
# Use production URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Use production keys
OPENFORT_SECRET_KEY=sk_live_...

# Use mainnet (when ready)
NEXT_PUBLIC_STORY_PROTOCOL_CHAIN_ID=1

# Enable production features
NODE_ENV=production
```

### Staging

```env
# Use staging URLs
NEXT_PUBLIC_APP_URL=https://staging.yourdomain.com

# Use test keys
OPENFORT_SECRET_KEY=sk_test_...

# Use testnet
NEXT_PUBLIC_STORY_PROTOCOL_CHAIN_ID=11155111
```

## Database Migration

### Production Database Setup

1. **Create Production Supabase Project**
   ```bash
   # In Supabase dashboard
   # Create new project
   # Note the production URL and keys
   ```

2. **Run Schema**
   ```sql
   -- Copy from supabase-schema.sql
   -- Run in Supabase SQL Editor
   ```

3. **Enable RLS**
   ```sql
   -- Ensure RLS is enabled on all tables
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE ip_registrations ENABLE ROW LEVEL SECURITY;
   ```

### Data Migration (if needed)

```bash
# Export from development
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql

# Import to production
psql -h db.yyy.supabase.co -U postgres -d postgres < backup.sql
```

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test

    - name: Build
      run: npm run build

    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

## Backup Strategy

### Database Backups

Supabase provides automatic backups:
- Daily backups retained for 7 days (Free tier)
- Point-in-time recovery (Pro tier)

Manual backup:
```bash
# Schedule with cron
0 2 * * * pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup-$(date +\%Y\%m\%d).sql
```

### File Backups

IPFS content is permanent, but backup:
- Environment variables
- Configuration files
- Database schema

## Scaling Considerations

### Horizontal Scaling

Vercel automatically scales with traffic.

For self-hosted:
- Use load balancer (Nginx)
- Multiple application instances
- Redis for session storage
- CDN for static assets

### Database Scaling

- Connection pooling (PgBouncer)
- Read replicas for queries
- Separate analytics database
- Database partitioning

### IPFS Scaling

- Use dedicated gateway
- Pin important content
- Consider Filecoin for storage deals

### Blockchain Scaling

- Transaction batching
- Off-chain indexing
- Caching blockchain data

## Monitoring

### Application Monitoring

```javascript
// lib/monitoring.ts
export function trackEvent(event: string, data?: any) {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics
    console.log('Event:', event, data);
  }
}
```

### Health Checks

Create `/api/health`:

```typescript
export async function GET() {
  // Check database
  // Check IPFS
  // Check blockchain

  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
}
```

### Alerts

Set up alerts for:
- Application errors
- API failures
- Database issues
- Transaction failures
- High response times

## Security Checklist

- [ ] Environment variables secured
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Content sanitization in place
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Security headers
- [ ] Regular dependency updates
- [ ] Security audits

## Troubleshooting

### Build Failures

Check:
- All dependencies installed
- Environment variables set
- No TypeScript errors
- Build command correct

### Runtime Errors

Check:
- Database connection
- API credentials valid
- Blockchain RPC working
- IPFS gateway accessible

### Performance Issues

Check:
- Database query optimization
- API response caching
- Image optimization
- Bundle size

## Rollback Procedure

### Vercel

1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

### Self-Hosted

```bash
# Revert to previous commit
git revert HEAD

# Or checkout previous version
git checkout <commit-hash>

# Rebuild and deploy
npm run build
pm2 restart onscribe
```

## Support

For deployment issues:
- Check documentation
- Review logs
- Contact support
- Join Discord community
