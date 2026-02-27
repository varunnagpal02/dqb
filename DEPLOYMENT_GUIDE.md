# 🚀 Desi Quick Bite — Deployment Guide

> **Version:** 1.0  
> **Date:** February 25, 2026  
> **Covers:** Local Development, Production (Vercel), Database Setup, Service Configuration

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Local Development Setup](#2-local-development-setup)
3. [Supabase Setup (Database & Auth)](#3-supabase-setup-database--auth)
4. [OpenAI Setup (AI Chatbot)](#4-openai-setup-ai-chatbot)
5. [Resend Setup (Email Notifications)](#5-resend-setup-email-notifications)
6. [Environment Variables Reference](#6-environment-variables-reference)
7. [Running Locally](#7-running-locally)
8. [Local Testing Checklist](#8-local-testing-checklist)
9. [Production Deployment (Vercel)](#9-production-deployment-vercel)
10. [Production Deployment (Other Hosts)](#10-production-deployment-other-hosts)
11. [Post-Deployment Verification](#11-post-deployment-verification)
12. [Database Seeding](#12-database-seeding)
13. [Troubleshooting](#13-troubleshooting)
14. [Maintenance & Updates](#14-maintenance--updates)

---

## 1. Prerequisites

### 1.1 Required Software

| Software | Version | Check Command | Install From |
|---|---|---|---|
| **Node.js** | v18+ LTS | `node --version` | [nodejs.org](https://nodejs.org) |
| **npm** | v9+ | `npm --version` | Bundled with Node.js |
| **Git** | Latest | `git --version` | [git-scm.com](https://git-scm.com) |

### 1.2 Required Accounts (All Free Tier)

| Service | Purpose | Sign Up |
|---|---|---|
| **GitHub** | Code hosting + CI/CD trigger | [github.com](https://github.com) |
| **Supabase** | Database (PostgreSQL) + Auth | [supabase.com](https://supabase.com) |
| **OpenAI** | AI chatbot (GPT-4o-mini) | [platform.openai.com](https://platform.openai.com) |
| **Resend** | Order confirmation emails | [resend.com](https://resend.com) |
| **Vercel** | Production hosting | [vercel.com](https://vercel.com) |

### 1.3 Free Tier Limits

| Service | Limit |
|---|---|
| Supabase | 500 MB database, 1 GB storage, 50,000 auth users |
| OpenAI GPT-4o-mini | Pay-per-use (~$0.15/1M input tokens — extremely cheap) |
| Resend | 3,000 emails/month, 100 emails/day |
| Vercel (Hobby) | Unlimited static sites, 100 GB bandwidth |

---

## 2. Local Development Setup

### 2.1 Clone & Install

```powershell
# Clone the repository
git clone https://github.com/YOUR_USERNAME/dqb.git
cd dqb

# Install dependencies
npm install
```

### 2.2 Create Environment File

```powershell
# Copy the example env file
Copy-Item env.example .env.local
```

Edit `.env.local` with your actual values (see sections 3–5 for how to obtain each key):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key

# OpenAI
OPENAI_API_KEY=sk-...your-openai-key

# Resend (Email)
RESEND_API_KEY=re_...your-resend-key
EMAIL_FROM=onboarding@resend.dev

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Desi Quick Bite

# Admin
ADMIN_EMAIL=your-email@example.com
```

### 2.3 Start Development Server

```powershell
npm run dev
```

The app will start at **http://localhost:3000** (or next available port like 3001, 3002).

---

## 3. Supabase Setup (Database & Auth)

### 3.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name:** `desi-quick-bite`
   - **Database Password:** (save this — you won't see it again)
   - **Region:** Choose closest to your users
4. Click **"Create new project"** and wait ~2 minutes

### 3.2 Get Your API Keys

1. In your Supabase project dashboard, go to **Settings → API**
2. Copy these values to your `.env.local`:

| Field in Supabase | Env Variable | Notes |
|---|---|---|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| **anon / public** key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Safe for browser |
| **service_role** key | `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ Server-only, never expose |

### 3.3 Run Database Migration

1. In your Supabase project, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Click **"Run"**
5. Verify: Go to **Table Editor** — you should see these tables:
   - `cuisines`
   - `categories`
   - `menu_items`
   - `user_profiles`
   - `orders`
   - `order_items`

### 3.4 Seed the Database (Optional)

To populate the database with sample menu items:

1. In the project, run:
   ```powershell
   npx tsx -e "const { generateSeedSQL } = require('./src/data/seed-menu.ts'); console.log(generateSeedSQL())"
   ```
   Or manually open `src/data/seed-menu.ts`, find the `generateSeedSQL()` function, and run its output in the Supabase SQL Editor.

2. Alternatively, the app works without DB seeding — the menu pages currently use **client-side seed data** from `src/data/seed-menu.ts` directly. The Supabase database is used by the API routes.

### 3.5 Configure Authentication

Supabase Auth is pre-configured. Optional customization:

1. Go to **Authentication → Settings**
2. **Email Auth** is enabled by default ✅
3. (Optional) Under **Email Templates**, customize the confirmation email
4. (Optional) Under **URL Configuration**, set:
   - **Site URL:** `http://localhost:3000` (dev) or `https://your-domain.com` (prod)
   - **Redirect URLs:** Add your production domain

---

## 4. OpenAI Setup (AI Chatbot)

### 4.1 Get API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in or create account
3. Navigate to **API Keys** (left sidebar)
4. Click **"Create new secret key"**
5. Copy the key → paste into `.env.local` as `OPENAI_API_KEY`

### 4.2 Add Billing (Required)

OpenAI requires a payment method even for minimal usage:

1. Go to **Settings → Billing**
2. Add a payment method
3. (Recommended) Set a **monthly usage limit** of $5–10 for MVP
4. GPT-4o-mini costs ~$0.15/1M input tokens — very affordable

### 4.3 Verify

The AI chatbot won't function without a valid `OPENAI_API_KEY`. The app handles missing keys gracefully — an error will show in the chat widget, but the rest of the app works fine.

---

## 5. Resend Setup (Email Notifications)

### 5.1 Get API Key

1. Go to [resend.com](https://resend.com) and sign in
2. Navigate to **API Keys**
3. Click **"Create API Key"**
   - **Name:** `dqb-production`
   - **Permission:** `Sending access`
   - **Domain:** `All domains` (for dev)
4. Copy the key → paste into `.env.local` as `RESEND_API_KEY`

### 5.2 Sender Address

- **Development:** Use `onboarding@resend.dev` (Resend's test domain — works immediately)
- **Production:** Add & verify your own domain in Resend Dashboard → **Domains**

Set the `EMAIL_FROM` env var accordingly:
```env
# Development
EMAIL_FROM=Desi Quick Bite <onboarding@resend.dev>

# Production (after domain verification)
EMAIL_FROM=Desi Quick Bite <orders@yourdomain.com>
```

### 5.3 Verify

Place a test order through the app. Check:
- Terminal logs for "Email sent" confirmation
- Recipient inbox for the order confirmation email
- Resend Dashboard → **Logs** for delivery status

> **Note:** Email sending is non-blocking — if Resend fails, orders still get created successfully.

---

## 6. Environment Variables Reference

| Variable | Required | Client/Server | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Client | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Client | Supabase anonymous key (safe for browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Server only | Supabase admin key (bypasses RLS) |
| `OPENAI_API_KEY` | ✅ | Server only | OpenAI API key for chatbot |
| `RESEND_API_KEY` | ✅ | Server only | Resend email API key |
| `EMAIL_FROM` | ❌ | Server only | Sender email (default: `onboarding@resend.dev`) |
| `NEXT_PUBLIC_APP_URL` | ❌ | Client | App base URL (default: `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_NAME` | ❌ | Client | App display name (default: `Desi Quick Bite`) |
| `ADMIN_EMAIL` | ✅ | Server only | Email address for admin access |

### Security Rules

- ✅ `NEXT_PUBLIC_*` variables are safe for the browser (Supabase anon key is designed to be public)
- ⛔ All other variables are **server-only** — never import them in client components
- ⛔ Never commit `.env.local` to Git (it's already in `.gitignore`)

---

## 7. Running Locally

### 7.1 Development Mode

```powershell
npm run dev
```

| Feature | URL |
|---|---|
| Home page | http://localhost:3000 |
| Menu | http://localhost:3000/menu |
| Cart | http://localhost:3000/cart |
| Checkout | http://localhost:3000/checkout |
| Auth | http://localhost:3000/auth/signin |
| Order History | http://localhost:3000/orders |
| Admin Dashboard | http://localhost:3000/admin |
| Admin Menu | http://localhost:3000/admin/menu |
| Admin Orders | http://localhost:3000/admin/orders |

### 7.2 Production Build (Local Test)

```powershell
# Build the production bundle
npm run build

# Start the production server
npm run start
```

This simulates exactly what will run on Vercel. Use this to catch build errors before deploying.

### 7.3 Lint Check

```powershell
npm run lint
```

---

## 8. Local Testing Checklist

Use this checklist to verify core features work before deploying.

### 8.1 No External Services Required

These features work without Supabase/OpenAI/Resend configured:

| # | Test | How to Verify | ✅ |
|---|---|---|---|
| 1 | Home page loads | Visit `/` — hero, cuisines, featured items visible | ⬜ |
| 2 | Menu page loads | Visit `/menu` — all 45+ items displayed | ⬜ |
| 3 | Menu search works | Type "biryani" — filtered results shown | ⬜ |
| 4 | Cuisine filter works | Click a cuisine pill — items filtered | ⬜ |
| 5 | Dietary filters work | Toggle "Vegetarian" — only veg items shown | ⬜ |
| 6 | Sort works | Select "Price: Low → High" — items re-ordered | ⬜ |
| 7 | Add to cart | Click "Add" on a menu item — cart count in header updates | ⬜ |
| 8 | Cart page | Visit `/cart` — added items visible with quantities | ⬜ |
| 9 | Cart quantity controls | Click +/- buttons — quantity and totals update | ⬜ |
| 10 | Cart persistence | Refresh the page — cart items still present | ⬜ |
| 11 | Empty cart state | Remove all items — "Your cart is empty" shown | ⬜ |
| 12 | Checkout page | Visit `/checkout` with items in cart — form visible | ⬜ |
| 13 | Empty cart redirect | Visit `/checkout` with empty cart — redirected to `/cart` | ⬜ |
| 14 | Admin dashboard | Visit `/admin` — 3 management cards visible | ⬜ |
| 15 | Admin menu table | Visit `/admin/menu` — all items in table | ⬜ |
| 16 | Responsive design | Resize browser to mobile width — layout adapts | ⬜ |
| 17 | Mobile navigation | On mobile, hamburger menu opens/closes | ⬜ |

### 8.2 Requires Supabase

| # | Test | How to Verify | ✅ |
|---|---|---|---|
| 18 | Sign Up | Visit `/auth/signin` → switch to sign up → register | ⬜ |
| 19 | Sign In | Sign in with registered credentials | ⬜ |
| 20 | Place order | Fill checkout form → submit → order created | ⬜ |
| 21 | Order history | Visit `/orders` while signed in → see orders | ⬜ |
| 22 | Admin orders | Visit `/admin/orders` as admin → see all orders | ⬜ |

### 8.3 Requires OpenAI

| # | Test | How to Verify | ✅ |
|---|---|---|---|
| 23 | Chat widget opens | Click chat bubble (bottom-right) → chat window opens | ⬜ |
| 24 | Chat sends message | Type a message → AI responds with text | ⬜ |
| 25 | Chat recommendations | Ask "spicy under $10" → recommendation cards shown | ⬜ |
| 26 | Quick prompts work | Click a quick prompt chip → message sent | ⬜ |

### 8.4 Requires Resend

| # | Test | How to Verify | ✅ |
|---|---|---|---|
| 27 | Order email sent | Place order → check email inbox | ⬜ |
| 28 | Email content correct | Email has order items, totals, address | ⬜ |

---

## 9. Production Deployment (Vercel)

### 9.1 Push to GitHub

```powershell
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Desi Quick Bite MVP"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/dqb.git
git branch -M main
git push -u origin main
```

### 9.2 Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..." → "Project"**
3. Select your `dqb` repository
4. Vercel auto-detects Next.js — settings should be:
   - **Framework:** Next.js
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

### 9.3 Set Environment Variables

Before clicking "Deploy", expand **"Environment Variables"** and add ALL of these:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `RESEND_API_KEY` | Your Resend API key |
| `EMAIL_FROM` | `Desi Quick Bite <onboarding@resend.dev>` |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | `Desi Quick Bite` |
| `ADMIN_EMAIL` | Your admin email address |

> ⚠️ **Important:** All env vars must be set BEFORE the first deploy, or the build will fail for features that require them.

### 9.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~1-2 minutes)
3. Vercel provides your URL: `https://your-app.vercel.app`

### 9.5 Custom Domain (Optional)

1. In Vercel project → **Settings → Domains**
2. Add your domain: `desiquickbite.com`
3. Follow DNS configuration instructions:
   - **Option A (recommended):** CNAME record → `cname.vercel-dns.com`
   - **Option B:** A record → Vercel IP addresses
4. SSL certificate is auto-provisioned

### 9.6 Continuous Deployment

Once connected, every `git push` to `main` branch triggers automatic deployment:

```powershell
# Make changes, commit, and push
git add .
git commit -m "Update menu items"
git push origin main
# → Vercel automatically builds and deploys (~60 seconds)
```

### 9.7 Preview Deployments

Every pull request gets a unique preview URL:

```
https://dqb-git-feature-branch-username.vercel.app
```

Great for testing changes before merging to production.

---

## 10. Production Deployment (Other Hosts)

### 10.1 Self-Hosted (VPS / Docker)

If you're not using Vercel, you can deploy to any Node.js hosting:

```powershell
# Build
npm run build

# Start production server
npm run start
# → Runs on port 3000 by default
```

**With a process manager (recommended for VPS):**

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "dqb" -- start

# Auto-restart on crash
pm2 save
pm2 startup
```

### 10.2 Docker Deployment

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

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

> **Note:** To use standalone output, add `output: 'standalone'` to `next.config.mjs`.

Build and run:

```bash
docker build -t dqb .
docker run -p 3000:3000 --env-file .env.local dqb
```

### 10.3 Railway / Render / Fly.io

These platforms support Next.js out of the box:

| Platform | Free Tier | Deploy Method |
|---|---|---|
| [Railway](https://railway.app) | $5/month credit | Connect GitHub repo |
| [Render](https://render.com) | 750 hrs/month | Connect GitHub repo |
| [Fly.io](https://fly.io) | 3 shared VMs free | `flyctl launch` CLI |

Steps are similar to Vercel:
1. Connect your GitHub repo
2. Set environment variables
3. Deploy

---

## 11. Post-Deployment Verification

Run through this checklist after deploying to production:

### 11.1 Critical Path (Must Pass)

| # | Test | Expected | ✅ |
|---|---|---|---|
| 1 | Visit production URL | Home page loads, no console errors | ⬜ |
| 2 | Navigate to `/menu` | All menu items render | ⬜ |
| 3 | Add item to cart | Cart count updates in header | ⬜ |
| 4 | Open `/cart` | Items displayed with correct totals | ⬜ |
| 5 | Open `/checkout` | Form renders, order summary visible | ⬜ |
| 6 | Sign up new user | Account created, confirmation email received | ⬜ |
| 7 | Sign in | Login successful, redirected to home | ⬜ |
| 8 | Place an order | Order created, confirmation page shown | ⬜ |
| 9 | Check email | Order confirmation email received | ⬜ |
| 10 | View `/orders` | Order visible in history | ⬜ |
| 11 | Open AI chat | Chat widget opens, responds to messages | ⬜ |
| 12 | Admin access | `/admin` accessible with admin email | ⬜ |

### 11.2 Performance Checks

| # | Check | Target | Tool |
|---|---|---|---|
| 1 | Lighthouse Performance Score | ≥ 80 | Chrome DevTools → Lighthouse |
| 2 | First Contentful Paint | < 1.5s | Lighthouse |
| 3 | Time to Interactive | < 3s | Lighthouse |
| 4 | Total Bundle Size (shared) | < 100 KB | `npm run build` output |
| 5 | Mobile usability | No issues | Google Mobile-Friendly Test |

### 11.3 Security Checks

| # | Check | How | ✅ |
|---|---|---|---|
| 1 | HTTPS active | URL starts with `https://` | ⬜ |
| 2 | API keys not in browser | View Page Source → search for `sk-` and `re_` | ⬜ |
| 3 | Admin routes protected | Visit `/api/admin/menu` logged out → 401 | ⬜ |
| 4 | Non-admin rejected | Visit `/api/admin/menu` as regular user → 403 | ⬜ |
| 5 | `.env.local` not in repo | Check GitHub — no secrets committed | ⬜ |

---

## 12. Database Seeding

### 12.1 Using SQL Editor (Recommended)

1. Open the **Supabase SQL Editor** in your project dashboard
2. Copy and paste each block below in order:

**Step 1: Insert cuisines**
```sql
INSERT INTO cuisines (name, slug, sort_order, is_active) VALUES
  ('North Indian', 'north-indian', 1, true),
  ('South Indian', 'south-indian', 2, true),
  ('Indo-Chinese', 'indo-chinese', 3, true),
  ('Street Food', 'street-food', 4, true),
  ('Desserts', 'desserts', 5, true),
  ('Beverages', 'beverages', 6, true);
```

**Step 2: Insert categories** (uses the cuisine IDs from step 1)
```sql
INSERT INTO categories (cuisine_id, name, slug, sort_order, is_active)
SELECT c.id, cat.name, cat.slug, cat.sort_order, true
FROM (VALUES
  ('north-indian', 'Curries', 'curries', 1),
  ('north-indian', 'Breads', 'breads', 2),
  ('north-indian', 'Rice Dishes', 'rice-dishes', 3),
  ('north-indian', 'Tandoori', 'tandoori', 4),
  ('south-indian', 'Dosa & Uttapam', 'dosa-uttapam', 1),
  ('south-indian', 'Rice & Sambar', 'rice-sambar', 2),
  ('indo-chinese', 'Starters', 'starters', 1),
  ('indo-chinese', 'Noodles & Rice', 'noodles-rice', 2),
  ('street-food', 'Chaats', 'chaats', 1),
  ('street-food', 'Snacks', 'snacks', 2),
  ('desserts', 'Sweets', 'sweets', 1),
  ('beverages', 'Hot Drinks', 'hot-drinks', 1),
  ('beverages', 'Cold Drinks', 'cold-drinks', 2)
) AS cat(cuisine_slug, name, slug, sort_order)
JOIN cuisines c ON c.slug = cat.cuisine_slug;
```

**Step 3: Insert menu items** — Use the `generateSeedSQL()` output from `src/data/seed-menu.ts` or manually insert items.

### 12.2 Using the Seed Script

The project includes seed data at `src/data/seed-menu.ts` with 45+ menu items. The menu page and chat API already use this data directly (client-side) so the app works even without database seeding.

---

## 13. Troubleshooting

### 13.1 Common Issues

| Issue | Cause | Fix |
|---|---|---|
| **Build fails: "Missing credentials"** | OpenAI/Resend client initialized eagerly | Already fixed — clients use lazy initialization |
| **Build fails: "Supabase URL required"** | Browser Supabase client needs URL | Already fixed — placeholder used when env vars missing |
| **Port 3000 already in use** | Another process on that port | Next.js auto-picks next port (3001, 3002) |
| **Chat widget: "Something went wrong"** | Missing `OPENAI_API_KEY` | Add key to `.env.local` |
| **Order email not received** | Missing `RESEND_API_KEY` or invalid sender | Check Resend dashboard logs |
| **Admin routes return 403** | User email ≠ `ADMIN_EMAIL` env var | Update `ADMIN_EMAIL` in `.env.local` |
| **"Auth required" on orders** | Not signed in | Sign in at `/auth/signin` |
| **Styles look broken** | Tailwind CSS not processing | Run `npm run dev` — Tailwind compiles on save |
| **TypeScript errors after pull** | Dependencies out of sync | Run `npm install` |

### 13.2 Debug Commands

```powershell
# Check Node version
node --version

# Clear Next.js cache
Remove-Item -Recurse -Force .next

# Rebuild from scratch
Remove-Item -Recurse -Force .next
npm run build

# Check for lint errors
npm run lint

# Check environment variables are loaded
# (Add this temporarily to any API route)
# console.log("ENV CHECK:", !!process.env.OPENAI_API_KEY)
```

### 13.3 Vercel Deployment Fails

1. **Check Build Logs:** Vercel Dashboard → Deployments → click failed deploy → View Build Logs
2. **Environment Variables:** Ensure ALL required vars are set in Vercel Settings → Environment Variables
3. **Node Version:** Vercel uses Node 18 by default. Ensure `package.json` doesn't specify an incompatible engine
4. **Build locally first:** Run `npm run build` locally to catch errors before pushing

---

## 14. Maintenance & Updates

### 14.1 Updating Dependencies

```powershell
# Check for outdated packages
npm outdated

# Update to latest compatible versions
npm update

# Update a specific package
npm install next@latest
```

### 14.2 Database Migrations

For future schema changes:

1. Create a new migration file: `supabase/migrations/002_add_feature.sql`
2. Test the SQL in Supabase SQL Editor on a dev project
3. Run on production Supabase SQL Editor
4. Update TypeScript types in `src/types/index.ts`

### 14.3 Monitoring

| What | Where |
|---|---|
| App errors | Vercel Dashboard → Functions → Logs |
| Database health | Supabase Dashboard → Database → Overview |
| API usage (OpenAI) | platform.openai.com → Usage |
| Email delivery | Resend Dashboard → Logs |
| Auth users | Supabase Dashboard → Authentication → Users |

### 14.4 Backup

| Data | Backup Method |
|---|---|
| Code | GitHub repository (auto-backed up) |
| Database | Supabase Dashboard → Database → Backups (daily on free tier) |
| Environment variables | Store in a password manager (1Password, Bitwarden) |

---

## Quick Start Summary

```
┌─────────────────────────────────────────────────────────┐
│                    QUICK START                           │
│                                                          │
│  1. git clone → npm install                              │
│  2. Copy env.example → .env.local                        │
│  3. Create Supabase project → get keys                   │
│  4. Run migration SQL in Supabase SQL Editor             │
│  5. Get OpenAI API key → add to .env.local               │
│  6. Get Resend API key → add to .env.local               │
│  7. npm run dev → http://localhost:3000                   │
│                                                          │
│  PRODUCTION:                                             │
│  8. Push to GitHub                                       │
│  9. Import repo on Vercel → set env vars → Deploy        │
│  10. Your app is live! 🎉                                │
└─────────────────────────────────────────────────────────┘
```

---

*Last updated: February 25, 2026*
