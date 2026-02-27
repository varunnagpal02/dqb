# 🍛 Desi Quick Bite — Project Context

> **Last Updated:** February 27, 2026

## Quick Reference

| Field | Value |
|---|---|
| **Project Name** | Desi Quick Bite (DQB) |
| **Type** | AI-enabled food ordering website |
| **Framework** | Next.js 14 (App Router) + TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (email/password) |
| **AI** | OpenAI GPT-4o-mini |
| **Email** | Resend |
| **Hosting** | Vercel |
| **Package Manager** | npm |

## Directory Map

```
src/
├── app/                    → Next.js pages & API routes (App Router)
│   ├── page.tsx            → Home/landing page
│   ├── layout.tsx          → Root layout (Header, Footer, Providers)
│   ├── menu/               → Menu browsing pages
│   ├── cart/               → Shopping cart
│   ├── checkout/           → Auth gate + order placement
│   ├── order-confirmation/ → Post-order confirmation
│   ├── orders/             → Order history
│   ├── admin/              → Admin panel (menu CRUD, order management)
│   └── api/                → Server-side API routes
│       ├── menu/           → GET menu data
│       ├── cuisines/       → GET cuisines
│       ├── chat/           → POST AI chatbot
│       ├── orders/         → POST/GET orders
│       └── admin/          → Admin CRUD APIs
├── components/
│   ├── ui/                 → Reusable primitives (Button, Card, Input, Badge, Modal)
│   ├── layout/             → Header, Footer, MobileNav
│   ├── menu/               → MenuGrid, MenuItem, Filters, MacroDisplay
│   ├── cart/               → CartItem, CartSummary, CartIcon
│   ├── chatbot/            → ChatWidget, ChatMessage, RecommendationCard
│   └── admin/              → MenuForm, OrderTable
├── lib/
│   ├── supabase/           → Supabase client configs (browser, server, admin)
│   ├── openai.ts           → OpenAI client + system prompt
│   ├── email.ts            → Resend email helper
│   └── utils.ts            → Shared utility functions
├── hooks/                  → Custom React hooks (useCart, useAuth, useChat)
├── context/                → React contexts (CartContext, AuthContext)
├── types/                  → TypeScript type definitions
└── data/                   → Seed data for menu items
```

## Key Patterns

1. **Server Components by Default** — Pages are server components; client interactivity via `'use client'` directive
2. **API Routes for Server Logic** — All DB writes, AI calls, email happen in `/api/` routes
3. **Cart in Client State** — React Context + localStorage; no DB until checkout
4. **Auth Gate at Checkout** — Users browse freely; signup required to place orders
5. **AI Structured Output** — Chatbot returns JSON filters → server queries DB → returns ranked results
6. **Promo Code System** — Client-side promo code validation at checkout with percentage & flat discounts (WELCOME10, FIRST20, CLEAN5, ORGANIC15)
7. **Clean Ingredients Branding** — Seed oil free, organic, no preservatives messaging throughout hero, footer, and dedicated homepage section
8. **Chat Widget Global Event** — ChatWidget listens for `open-chat-widget` CustomEvent, allowing any page to trigger the chat (e.g., "Ask AI Bot" button on homepage)

## Environment Variables

See `.env.example` for all required variables. Copy to `.env.local` and fill in values.

## Common Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

## External Service Setup

1. **Supabase** → Create project at supabase.com → Run migration SQL → Copy URL + keys
2. **OpenAI** → Get API key at platform.openai.com → Add to .env.local
3. **Resend** → Create account at resend.com → Verify domain → Copy API key
4. **Vercel** → Connect GitHub repo → Set env vars → Deploy
