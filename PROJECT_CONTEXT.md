# 🍛 Desi Quick Bite — Project Context

> **Last Updated:** March 14, 2026 (Phase 2.1 — Dark Glassmorphism Redesign)

## Quick Reference

| Field | Value |
|---|---|
| **Project Name** | Desi Quick Bite (DQB) |
| **Type** | AI-enabled food ordering website |
| **Framework** | Next.js 14 (App Router) + TypeScript |
| **Styling** | Tailwind CSS + Dark Glassmorphism Design System |
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
│   ├── page.tsx            → Dark glassmorphism landing page (single address bar + autocomplete + timing + auth)
│   ├── layout.tsx          → Root layout (Providers incl. DeliveryProvider, LayoutShell)
│   ├── menu/               → Search-first menu (no heading, QuickNav, AI search, enhanced filters)
│   ├── cart/               → Shopping cart
│   ├── checkout/           → Order placement + serviceability gate + promo codes
│   ├── meal-plans/         → Pre-made & custom meal plan builder
│   ├── order-confirmation/ → Post-order confirmation
│   ├── orders/             → Order history
│   ├── admin/              → Admin panel (menu CRUD, order management)
│   └── api/                → Server-side API routes
│       ├── menu/           → GET menu data
│       ├── menu-search/    → POST AI-powered filter extraction
│       ├── cuisines/       → GET cuisines
│       ├── chat/           → POST AI chatbot
│       ├── orders/         → POST/GET orders
│       └── admin/          → Admin CRUD APIs
├── components/
│   ├── ui/                 → Reusable primitives (Button, Card, Input, Badge, Modal)
│   ├── layout/             → LayoutShell (conditional chrome), Header (glass nav), Footer
│   ├── menu/               → MenuGrid, MenuItem (glass-card), Filters, QuickNav, MacroDisplay
│   ├── cart/               → CartItem, CartSummary, CartIcon
│   ├── chatbot/            → ChatWidget, ChatMessage, RecommendationCard
│   └── admin/              → MenuForm, OrderTable
├── lib/
│   ├── supabase/           → Supabase client configs (browser, server, admin)
│   ├── openai.ts           → LangChain model setup, system prompt, message-based chat completion
│   ├── email.ts            → Resend email helper
│   └── utils.ts            → Shared utility functions
├── hooks/                  → Custom React hooks (useCart, useAuth, useChat)
├── context/                → React contexts (CartContext, AuthContext, DeliveryContext)
├── types/                  → TypeScript type definitions (incl. DeliveryState)
└── data/                   → Seed data (menu items, serviceable areas incl. Ontario cities, menu-images)
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
16. **Home Page Layout** — Dark glassmorphism landing page with NO header/footer/chatbot (standalone via LayoutShell). Single address bar with autocomplete dropdown (50+ area suggestions including Ontario cities). Timing pills ("Deliver Now" / "Schedule"). "Find Food Near You" CTA. Auth modal overlay (Sign In / Create Account). Trust badges (No Seed Oils, Organic, Homemade, AI). Ambient glow effects for depth. Auto-navigates to /menu on form completion after serviceability check.
17. **DeliveryContext (Phase 2)** — Global React Context (DeliveryProvider) wrapping the app. Stores address, city, ZIP, isServiceable, orderTiming (now/scheduled), scheduledDate/Time, hasEnteredAddress. Persisted in localStorage (`dqb-delivery`). Used by landing page, checkout (pre-fill + gate), and header (address badge).
18. **Serviceability Check (Phase 2)** — Client-side ZIP/city matching via `src/data/serviceable-areas.ts`. Supports US 5-digit ZIP codes and Canadian postal codes (FSA matching). 40+ Ontario cities included (Kitchener, Waterloo, Cambridge, Guelph, Toronto, Mississauga, Brampton, Hamilton, London, Ottawa, etc.) plus NYC boroughs. Returns `{ isServiceable, message }`. Serviceable → green toast + proceed. Not serviceable → amber toast + browse-only (checkout blocked).
19. **AI Menu Search (Phase 2)** — Search-first menu page layout (no heading). Glass-input search bar at top with AI Search button. Detects "smart" queries (containing $, protein, calories, etc.). Smart queries POST to `/api/menu-search` for LangChain filter extraction (lightweight, no chat history). Results applied as in-page filters. Falls back to text search for plain queries. Advanced filters collapsed behind toggle.
20. **Quick-Access Nav Bar (Phase 2)** — Horizontal scrollable pill bar on menu page with 14 categories: Deals, Breakfast, Lunch, Dinner, Appetizers, Mains, Breads, Drinks, North Indian, South Indian, Indo-Chinese, Street Food, Desserts, Meal Plans. Categories filter by mood_tags, category_slug, or cuisine_slug. Meal Plans links to /meal-plans.
21. **Recommended Items (Phase 2)** — `is_recommended` boolean on SeedMenuItem. ~10 popular items flagged. Menu page shows "⭐ Recommended for You" section when no filters are active. Default sort: recommended first.
22. **Enhanced Filters (Phase 2)** — Sort by: Recommended, Price (asc/desc), Calories (asc), Protein (desc). Filter by: max price, max calories, max spice level. Combined with existing cuisine pills, dietary toggles, and QuickNav. Filters in collapsible glass-card section.
23. **Dark Glassmorphism Design System** — Unified dark theme across ALL user-facing pages. Global bg `#0f0f1a`, text `#f1f5f9`. CSS classes in `globals.css`: `.glass-card` (frosted panels with `backdrop-blur:24px`), `.glass-card-light` (lighter variant), `.glass-input` (dark inputs with orange focus ring). Accent: `orange-400/500`. Dividers: `border-white/[0.06]`. All components (MenuItem, CartItem, CartSummary, Input, Button ghost variant, Header, Footer) use glass styling.
24. **LayoutShell** — `src/components/layout/LayoutShell.tsx` conditionally renders Header, Footer, and ChatWidget. Hidden on landing page (`/`) for a clean standalone experience. Shown on all other routes.

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
