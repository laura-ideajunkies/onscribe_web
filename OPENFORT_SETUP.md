# Openfort Setup Guide for OnScribe

Complete step-by-step guide to enable authentication on OnScribe.

---

## 📋 What You'll Need

1. **Openfort Account** (free)
2. **4 API Keys** from Openfort Dashboard
3. **5 minutes** of your time

---

## Step 1: Create Openfort Account

1. Go to: **https://dashboard.openfort.xyz/register**
2. Sign up with your email
3. Verify your email
4. You'll be taken to the Openfort Dashboard

---

## Step 2: Get Your API Keys

### A. Main API Keys

1. In Openfort Dashboard, click **"API Keys"** in the sidebar
2. You'll see two keys:

**Copy these:**
```
Publishable Key: pk_test_XXXXXXXXXXXXXXXX
Secret Key: sk_test_XXXXXXXXXXXXXXXX
```

### B. Shield Keys (For Embedded Wallets)

1. Scroll down to the **"Shield"** section
2. Click **"Create Shield Keys"**
3. **IMPORTANT:** A popup will show your encryption share
   - ⚠️ **Save this immediately!** You'll only see it once
   - Store it in a password manager or secure note
4. After saving, you'll get:

**Copy these:**
```
Shield Publishable Key: pk_shield_XXXXXXXXXXXXXXXX
Shield Secret Key: sk_shield_XXXXXXXXXXXXXXXX
```

---

## Step 3: Configure Authentication Providers

1. In Openfort Dashboard, go to **"Authentication"**
2. Enable these providers:
   - ✅ **Email** (with OTP codes)
   - ✅ **Google** (OAuth)
   - ⬜ **Guest** (optional - for testing)

3. **Configure Redirect URLs:**
   - Click on each provider
   - Add authorized redirect URLs:
     - `http://localhost:3000`
     - `http://localhost:3000/dashboard`
     - `http://localhost:3000/editor`

---

## Step 4: Set Up Recovery Endpoint (Backend)

We need a backend endpoint for automatic wallet recovery. **Choose ONE option:**

### Option A: One-Click Deploy (Easiest)

Click one of these to deploy a pre-built endpoint:

**Cloudflare Workers:**
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/openfort-xyz/cloudflare-shield-encryption-endpoint)

**Vercel Functions:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/openfort-xyz/vercel-shield-encryption-endpoint)

After deploying:
1. Copy the endpoint URL (e.g., `https://your-project.workers.dev/api/shield-session`)
2. Add your Shield Secret Key as an environment variable in the deployment

### Option B: Use OnScribe's Built-in Endpoint

We can create the endpoint directly in OnScribe's API routes. I'll set this up for you once you provide the Shield Secret Key.

---

## Step 5: Add Keys to OnScribe

Once you have all 4 keys, update your `.env` file:

```bash
# Openfort - Main API Keys
NEXT_PUBLIC_OPENFORT_PUBLIC_KEY=pk_test_YOUR_KEY_HERE
OPENFORT_SECRET_KEY=sk_test_YOUR_KEY_HERE

# Openfort Shield - Embedded Wallet Keys
NEXT_PUBLIC_SHIELD_PUBLISHABLE_KEY=pk_shield_YOUR_KEY_HERE
SHIELD_SECRET_KEY=sk_shield_YOUR_KEY_HERE

# Recovery Endpoint URL (if using external deployment)
NEXT_PUBLIC_RECOVERY_ENDPOINT_URL=https://your-endpoint.com/api/shield-session
```

---

## Step 6: Install Openfort Package

Run this in your terminal:

```bash
npm install @openfort/react wagmi viem@2.22.0 @tanstack/react-query
```

---

## Step 7: Restart Development Server

```bash
# Stop the server (Ctrl + C)
# Then restart:
npm run dev
```

---

## 🎯 What To Provide Me

Send me these 4 keys (you can send them one at a time if needed):

1. **Publishable Key** (pk_test_...)
2. **Secret Key** (sk_test_...)
3. **Shield Publishable Key** (pk_shield_...)
4. **Shield Secret Key** (sk_shield_...)

**Optional:**
5. **Recovery Endpoint URL** (if you deployed externally)

---

## ✅ Once Configured, Users Can:

1. Click "Sign Up" button
2. See Openfort modal with options:
   - **Sign up with Email** (enter email → verify OTP)
   - **Continue with Google** (OAuth)
3. Openfort automatically:
   - Creates user account
   - Generates embedded wallet (no seed phrase!)
   - Manages authentication session
4. User is logged in and redirected to dashboard

---

## 🔒 Security Notes

**Safe to expose (client-side):**
- ✅ Publishable Key (pk_test_...)
- ✅ Shield Publishable Key (pk_shield_...)

**MUST keep secret (server-side only):**
- ❌ Secret Key (sk_test_...)
- ❌ Shield Secret Key (sk_shield_...)
- ❌ Encryption share (from Shield setup)

---

## 🐛 Troubleshooting

**"Unauthorized redirect URI"**
- Add your URL to authorized redirects in Openfort Dashboard

**"Invalid publishable key"**
- Check you copied the full key including pk_test_ prefix
- Restart dev server after updating .env

**Modal doesn't open**
- Check browser console for errors
- Verify Openfort package is installed
- Clear browser cache and try again

---

## 📚 Resources

- [Openfort Dashboard](https://dashboard.openfort.xyz)
- [Openfort Docs](https://www.openfort.xyz/docs)
- [Shield Encryption Guide](https://www.openfort.xyz/docs/products/embedded-wallet/shield)

---

**Ready?** Just provide me the 4 keys and I'll get everything set up! 🚀
