# 🍛 Desi Quick Bite — Project Context

> **Last Updated:** March 7, 2026

## Quick Reference

| Field | Value |
|---|---|
| **Project Name** | Desi Quick Bite (DQB) |
| **Type** | AI-enabled food ordering website |
| **Framework** | Next.js 14 (App Router) + TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (email/password) |
| **AI** | OpenAI GPT-4o-mini via LangChain.js |
| **AI Framework** | LangChain (messages, prompts, output parsing) |
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
│   ├── checkout/           → Auth gate + order placement + schedule date/time
│   ├── meal-plans/         → Pre-made & custom meal plan builder
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
│   ├── openai.ts           → LangChain model setup, system prompt, message-based chat completion
│   ├── email.ts            → Resend email helper
│   └── utils.ts            → Shared utility functions
├── hooks/                  → Custom React hooks (useCart, useAuth, useChat)
├── context/                → React contexts (CartContext, AuthContext)
├── types/                  → TypeScript type definitions
└── data/                   → Seed data for menu items + menu-images.ts (image URL map)
```

## Key Patterns

1. **Server Components by Default** — Pages are server components; client interactivity via `'use client'` directive
2. **API Routes for Server Logic** — All DB writes, AI calls, email happen in `/api/` routes
3. **Cart in Client State** — React Context + localStorage; no DB until checkout
4. **Auth Gate at Checkout** — Users browse freely; signup required to place orders
5. **AI Structured Output (LangChain)** — LangChain ChatOpenAI with SystemMessage + message history → returns JSON with intent + filters → server routes by intent (recommendation, meal_plan, schedule_order, not_available, off_topic, clarification). Recommendations are shuffled for varied results on repeated queries.
6. **Chatbot Cart Integration** — RecommendationCard toggles Add/Remove from cart on click. MealPlanCard shows per-meal Add to Cart buttons that look up actual menu items by name.
7. **Promo Code System** — Client-side promo code validation at checkout with percentage & flat discounts (WELCOME10, FIRST20, CLEAN5, ORGANIC15)
8. **Order Scheduling** — Checkout includes optional date/time picker. Customers can schedule delivery for a future date (min: today) with 30-min time slots from 11am–9pm. Defaults to ASAP if left empty.
9. **Meal Plans** — `/meal-plans` page with two tabs: Pre-Made Plans (12 plans: 4 diets × 3 price tiers) and Build Your Own (custom plan builder with menu browser). Pre-made plans: Vegetarian, Vegan, Combination, Meat at Budget (<$60/week), Standard (<$80/week), Premium ($80+/week). Plans show weekly breakdown by day, avg calories/day, "Add All to Cart" button. Custom builder lets users search/filter menu items, build a plan, and add all to cart. AI chatbot CTA on the page.
10. **Clean Ingredients Branding** — Seed oil free, organic, no preservatives messaging throughout hero, footer, and dedicated homepage section
11. **Chat Widget Global Event** — ChatWidget listens for `open-chat-widget` CustomEvent, allowing any page to trigger the chat (e.g., "Ask AI Bot" button on homepage, meal plans page)
12. **Session Tracking** — Server-side session timestamps with 30-min TTL auto-cleanup; chat history (last 10 messages) passed per request as LangChain message objects
13. **Navigation** — Header navLinks: Home, Menu, Meal Plans, Orders. Meal Plans section also featured on home page with diet category cards.
14. **Cart-Aware Chatbot** — ChatWidget reads current cart via `useCart()`, builds a `cartSummary` string (item names, quantities, prices, total), and sends it with each `/api/chat` request. The AI system prompt dynamically includes cart contents so the chatbot can answer scheduling, checkout, and cart-related questions.
15. **Menu Item Images** — `src/data/menu-images.ts` exports `MENU_ITEM_IMAGES` (slug → Unsplash URL) and `getMenuItemImage()` helper. Used by MenuItem cards and home page featured items with emoji fallback.
16. **Home Page Layout** — Sections ordered: Hero → Explore Cuisines → Weekly Meal Plans → Popular Picks → AI-Powered Ordering → Clean Food Promise → Macro Banner. Content-first layout with discovery sections above promotional sections.

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
