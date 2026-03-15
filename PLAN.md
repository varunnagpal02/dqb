# 🍛 Desi Quick Bite — Production-Ready MVP Plan

> **Version:** 1.0  
> **Date:** February 25, 2026  
> **Status:** Draft — Awaiting Approval  

---

## 1. Product Overview

**Desi Quick Bite** is an AI-enabled food ordering website that helps users discover and order food effortlessly. A built-in AI chatbot understands natural language queries and recommends dishes based on budget, cuisine, mood, dietary preferences, and macronutrient constraints.

### 1.1 Target Users

| Segment | Pain Point |
|---|---|
| Busy Professionals | No time to browse; need quick, smart suggestions |
| Students | Budget-conscious; want affordable meal combos |
| Fitness-Conscious Customers | Need macro-aware recommendations (calories, protein, carbs, fat) |
| Families | Ordering group meals across varied preferences |

### 1.2 Core Problems Solved

- Users feel **overwhelmed** by large menus
- Users want food based on **mood, diet, or budget** — not just category
- **Calorie/macro information** is not clearly visible on most platforms
- Users want **quick suggestions** instead of browsing long menus

---

## 2. Feature Breakdown (MVP Scope)

### Phase 1 — MVP (Target: 4–6 weeks)

| # | Feature | Priority | Description |
|---|---|---|---|
| F1 | **Menu Display** | P0 | Multi-cuisine menu with categories, images, prices, and macro info |
| F2 | **Configurable Menu (Admin)** | P0 | Simple admin panel/config to add, edit, remove menu items |
| F3 | **Shopping Cart** | P0 | Add to cart, update quantities, remove items |
| F4 | **User Signup/Login** | P0 | Email-based signup at checkout (guest browsing allowed) |
| F5 | **Order Placement** | P0 | Place order with delivery details |
| F6 | **Email Notifications** | P0 | Order confirmation email to user on successful placement |
| F7 | **AI Chatbot** | P0 | Natural language chatbot for food recommendations |
| F8 | **Responsive Design** | P0 | Mobile-first, works on all devices |
| F9 | **Meal Plans** | P0 | Pre-made weekly meal plans (Vegetarian, Vegan, Combination, Meat) at Budget (<$60), Standard (<$80), and Premium ($80+) tiers. Custom meal plan builder with menu browser. |
| F10 | **Order Scheduling** | P0 | Schedule delivery for a future date/time from checkout page |
| F11 | **Cart-Aware Chatbot** | P0 | AI chatbot knows current cart contents; answers scheduling/checkout questions with cart context |
| F12 | **Menu Item Images** | P0 | High-quality food photos for all menu items (Unsplash), with emoji fallback |

### Phase 2 — Location-Aware Landing, Smart Search & Menu Enhancements

> **Version:** 2.0  
> **Date:** March 14, 2026  
> **Status:** Draft — Awaiting Approval  
> **Prerequisite:** Phase 1 complete (all 12 features shipped, 73 tests passing)

#### 2.1 Phase 2 Overview

Phase 2 transforms Desi Quick Bite from a browse-first experience into a **location-aware, conversion-optimized** ordering flow. The landing page becomes a clean entry gate that captures delivery context upfront (address + timing), validates serviceability, and funnels users into a redesigned menu page with AI-powered search, smart sorting, and quick-access navigation.

**Core Thesis:** Users who enter their address and schedule upfront have **higher checkout conversion** because:
1. They've already committed intent (I want food delivered HERE at THIS TIME)
2. Unserviceable areas are caught early, not at checkout (reduces frustration)
3. Delivery context is available throughout the session for the AI chatbot

#### 2.2 Feature Breakdown

| # | Feature | Priority | Description |
|---|---|---|---|
| P2-F1 | **Location-Aware Landing Page** | P0 | New clean landing page: address input + "Order Now" / schedule time picker. On entry, auto-validates serviceability and navigates directly to `/menu` (no explicit button). Stores address + timing in context. Clean branding: "Homemade goodness on the go", health/organic messaging. |
| P2-F2 | **Serviceability Check** | P0 | Client-side serviceable area validation (configurable ZIP/city list). Serviceable → green checkmark → proceed to menu. Unserviceable → amber banner "We're not in your area yet — but we're expanding! Browse our menu anyway." → allows menu browsing but **blocks checkout**. |
| P2-F3 | **Signup/Register on Landing** | P0 | Optional signup/login section below address+time on landing page. "Already have an account? Sign in" / "Create account" links. Uses existing Supabase Auth. Pre-fills saved address if user is logged in. |
| P2-F4 | **Checkout Serviceability Gate** | P0 | Checkout page checks `isServiceable` from context. If unserviceable: shows prominent banner — "🚫 Delivery is not available in your area at this time. We're expanding — check back soon!" Disables "Place Order" button. User can still browse menu, build cart, use chatbot. |
| P2-F5 | **AI-Powered Menu Search** | P0 | Search bar on menu page accepts natural language queries like "food under $20", "high protein vegan meals", "spicy comfort food". Sends query to `/api/chat` (or new lightweight `/api/search` endpoint) → parses intent + filters → renders filtered menu items in-page (same grid). Falls back to text search for simple queries. |
| P2-F6 | **Recommended/Popular Items First** | P0 | Menu page shows "Recommended for You" section at top (items tagged with `mood_tags: ["popular"]` or a new `is_recommended` flag). Sorted by recommendation score before other items. |
| P2-F7 | **Quick-Access Navigation Bar** | P0 | Horizontal scrollable icon bar at top of menu page with Indian food categories: 🏷️ Deals, 🌅 Breakfast, 🍛 Lunch, 🌙 Dinner, 🥘 Appetizers, 🍲 Mains, 🫓 Breads, 🥤 Drinks, 🍛 North Indian, 🥘 South Indian, 🥡 Indo-Chinese, 🍢 Street Food, 🍮 Desserts, 📋 Meal Plans. Tapping a category filters the menu grid to that food type. Meal Plans links to `/meal-plans`. |
| P2-F8 | **Enhanced Sorting & Filters** | P0 | Add sort options: Price (low/high), Calories (low/high), Protein (high/low), Rating/Popularity. Add filter options: Price range slider, Calorie range, Spice level selector. Combine with existing cuisine + dietary filters. |
| P2-F9 | **Preserve All Phase 1 Features** | P0 | All existing features remain functional: AI chatbot (cart-aware), meal plans page, order scheduling, promo codes, admin panel, cart toggle in recommendations. |
| P2-F10 | **Documentation Update** | P0 | Update ARCHITECTURE.md, PROJECT_CONTEXT.md with new components, contexts, data flows. |
| P2-F11 | **Test Plan & Execution** | P0 | New comprehensive test plan covering all Phase 2 features + regression for Phase 1. Target: all tests passing. |

#### 2.3 Detailed Technical Design

##### P2-F1: Location-Aware Landing Page (`src/app/page.tsx`)

**New Page Layout:**
```
┌──────────────────────────────────────────────┐
│            🍛 Desi Quick Bite                │
│     "Homemade goodness on the go"            │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  📍 Enter your delivery address        │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │ Street address, city, ZIP...     │  │  │
│  │  └──────────────────────────────────┘  │  │
│  │                                        │  │
│  │  🕐 When do you want it?              │  │
│  │  ○ Order Now   ○ Schedule for Later    │  │
│  │  [Date picker]  [Time slot dropdown]   │  │
│  │                                        │  │
│  │  (Auto-navigates to /menu once          │  │
│  │   address + timing are entered)         │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ── or ──                                    │
│  Sign up / Log in                            │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │🚫 No     │ │🌿 Organic│ │🧹 No     │     │
│  │Seed Oils │ │Ingredients│ │Preserv.  │     │
│  └──────────┘ └──────────┘ └──────────┘     │
└──────────────────────────────────────────────┘
```

**Behavior:**
1. User enters address (text input with city/ZIP)
2. User selects "Order Now" or "Schedule" (date + time)
3. On completing both fields → serviceability check runs automatically, navigates to `/menu` (no button click needed)
4. Serviceable → redirect to `/menu` with green toast "Delivering to [address]!"
5. Unserviceable → amber toast "We're not in your area yet — browse our menu anyway!" → redirect to `/menu`
6. Address + timing + serviceability stored in new `DeliveryContext`

**New Context: `DeliveryContext`**
```typescript
interface DeliveryState {
  address: string;
  city: string;
  zipCode: string;
  isServiceable: boolean;
  orderTiming: "now" | "scheduled";
  scheduledDate?: string;    // ISO date
  scheduledTime?: string;    // "11:00 AM" etc.
  hasEnteredAddress: boolean;
}
```
- Persisted in `localStorage` (`dqb-delivery`)
- Available globally via `useDelivery()` hook
- Pre-fills checkout address fields

##### P2-F2: Serviceability Check

**Implementation:**
- Configurable list of serviceable ZIP codes / cities in `src/data/serviceable-areas.ts`
- Client-side validation (no API call needed for MVP)
- ZIP-code or city-name match (case-insensitive)
- Returns `{ isServiceable: boolean, message: string }`

**Serviceable Areas (Initial — configurable):**
```typescript
export const SERVICEABLE_ZIPS = ["10001", "10002", "10003", ...]; // NYC example
export const SERVICEABLE_CITIES = ["New York", "Manhattan", "Brooklyn", ...];
```

**Admin can expand list** by editing the data file (future: admin UI for service areas).

##### P2-F3: Signup on Landing

- Compact signup/login section below the address form
- "Already have an account? **Sign in**" link → expands inline form (email + password)
- "New here? **Create account**" → expands signup form
- Uses existing `AuthContext` + Supabase Auth
- If logged in, shows "Welcome back, [name]!" with saved address pre-filled
- Optional — user can skip and proceed as guest

##### P2-F4: Checkout Serviceability Gate

**Changes to `src/app/checkout/page.tsx`:**
- Read `isServiceable` from `DeliveryContext`
- If `!isServiceable`:
  - Show full-width amber/red banner at top:
    > "🚫 We're not delivering to your area yet. We're expanding fast — check back soon! You can still browse our menu and build your cart."
  - Disable "Place Order" button (grayed out)
  - Show "Change Address" link → redirects to landing page
- Pre-fill address fields from `DeliveryContext` (if user entered on landing)

##### P2-F5: AI-Powered Menu Search

**How it works:**
1. User types in search bar: "meals under $20" or "high protein vegan"
2. Client detects if query is "smart" (contains price keywords like `$`, `under`, `budget`, or nutritional terms like `protein`, `calories`, `low carb`)
3. **Smart query** → POST to `/api/menu-search` (lightweight variant of `/api/chat`):
   - Sends only the query (no chat history needed)
   - AI returns `{ filters: ChatFilters }` → client applies filters to menu items
   - No conversation — just filter extraction
4. **Plain text query** → existing client-side text search (name, description, keywords)
5. Results render in the same MenuGrid — seamless UX

**New API: `/api/menu-search`**
```typescript
// POST /api/menu-search
// Body: { query: string }
// Response: { filters: ChatFilters, message: string }
```
- Uses same LangChain setup but simpler prompt (just extract filters, no conversation)
- Much cheaper per query (shorter prompt, no history)

##### P2-F6: Recommended Items First

**Approach:**
- Add `is_recommended: boolean` field to `SeedMenuItem` type
- Tag ~8-10 popular items as recommended (Butter Chicken, Chicken Biryani, Masala Dosa, Paneer Tikka, etc.)
- Menu page renders "⭐ Recommended" section above the main grid
- Recommended items appear first in default sort order
- Items in recommended section also appear in their cuisine category (not removed from grid)

##### P2-F7: Quick-Access Navigation Bar (Food Type Categories)

**Horizontal scrollable pill/icon bar at top of menu page — tailored for Indian cuisine:**
```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 🏷️ Deals │ 🌅 Breakfast │ 🍛 Lunch │ 🌙 Dinner │ 🥘 Appetizers │ 🍲 Mains │ 🫓 Breads │
│ 🥤 Drinks │ 🍛 North Indian │ 🥘 South Indian │ 🥡 Indo-Chinese │ 🍢 Street Food │  │
│ 🍮 Desserts │ 📋 Meal Plans                                                       │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Category → Filter Mapping:**
| Category | Filter Behavior |
|---|---|
| Deals | Items tagged with `mood_tags: ["deal", "value"]` — budget-friendly picks |
| Breakfast | Items tagged with `mood_tags: ["breakfast"]` (idli, dosa, paratha, chai, etc.) |
| Lunch | Items tagged with `mood_tags: ["lunch"]` (mains, rice, biryani, thalis) |
| Dinner | Items tagged with `mood_tags: ["dinner"]` (curries, biryani, tandoori) |
| Appetizers | Category filter: `ni-starters`, `ic-starters`, `sf-chaat` |
| Mains | Category filter: `ni-mains`, `si-mains`, `ic-noodles` |
| Breads | Category filter: `ni-breads` |
| Drinks | Category filter: `bv-hot`, `bv-cold` |
| North Indian | Cuisine filter: `north-indian` |
| South Indian | Cuisine filter: `south-indian` |
| Indo-Chinese | Cuisine filter: `indo-chinese` |
| Street Food | Cuisine filter: `street-food` |
| Desserts | Cuisine filter: `desserts` |
| Meal Plans | `<Link href="/meal-plans">` — navigates to existing meal plans page |

**UX:** Horizontally scrollable on mobile, wraps on desktop. Active category highlighted in orange. Tapping toggles the filter (tap again to clear). Multiple categories can be active.

##### P2-F8: Enhanced Sorting & Filters

**New Sort Options** (added to existing dropdown):
| Option | Sort Logic |
|---|---|
| Recommended | `is_recommended` first, then default order |
| Price: Low → High | Ascending by price |
| Price: High → Low | Descending by price |
| Calories: Low → High | Ascending by calories |
| Protein: High → Low | Descending by protein_g |

**New Filter Controls:**
- **Price Range**: Min/Max input fields (e.g., $5 – $20)
- **Calorie Range**: Max calories slider or input
- **Spice Level**: 1-5 selector (show items at or below selected level)

#### 2.4 User Flow Diagram

```
┌───────────────────┐
│   User lands on   │
│   desiquickbite.com│
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Landing Page     │
│  - Enter address  │
│  - Select timing  │
│  - Optional signup│
└────────┬──────────┘
         │
         ▼
┌───────────────────┐     ┌─────────────────────────┐
│ Serviceability    │────►│ NOT serviceable:        │
│ Check             │     │ Amber banner shown      │
│ (ZIP/city match)  │     │ User proceeds to /menu  │
└────────┬──────────┘     │ Checkout BLOCKED later  │
         │                └─────────────────────────┘
         │ ✅ Serviceable
         ▼
┌───────────────────┐
│  /menu page       │
│  - Quick nav bar  │
│  - AI search      │
│  - Recommended    │
│  - Full menu grid │
│  - Enhanced sorts │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Cart → Checkout  │
│  (address pre-    │
│   filled from     │
│   landing page)   │
│  Serviceable? ──► Place Order ✅
│  Unserviceable?─► Blocked 🚫
└───────────────────┘
```

#### 2.5 New Files & Components

| File | Type | Purpose |
|---|---|---|
| `src/context/DeliveryContext.tsx` | Context | Address, timing, serviceability state |
| `src/hooks/useDelivery.ts` | Hook | Shortcut to DeliveryContext consumer |
| `src/data/serviceable-areas.ts` | Data | Configurable ZIP/city serviceability list |
| `src/app/api/menu-search/route.ts` | API | AI-powered filter extraction for search |
| `src/components/menu/QuickNav.tsx` | Component | Cuisines / Deals / Meal Plans icon bar |
| `src/components/menu/PriceFilter.tsx` | Component | Min/max price range inputs |
| `src/components/menu/SortDropdown.tsx` | Component | Enhanced sort dropdown |
| `src/components/landing/AddressForm.tsx` | Component | Address + timing entry form |
| `src/components/landing/AuthSection.tsx` | Component | Inline signup/login on landing |

#### 2.6 Modified Files

| File | Changes |
|---|---|
| `src/app/page.tsx` | Complete redesign → location-aware landing |
| `src/app/menu/page.tsx` | Add quick nav, AI search, recommended section, enhanced sort/filter |
| `src/app/checkout/page.tsx` | Add serviceability gate, pre-fill address from DeliveryContext |
| `src/app/layout.tsx` | Wrap with `<DeliveryProvider>` |
| `src/data/seed-menu.ts` | Add `is_recommended` field to ~8-10 popular items. Add meal-time tags (`breakfast`, `lunch`, `dinner`) and `deal` tag to `mood_tags` for quick-nav filtering. |
| `src/types/index.ts` | Add `DeliveryState`, `is_recommended` to MenuItem, search types |
| `src/lib/openai.ts` | Add lightweight search prompt variant |
| `src/components/layout/Header.tsx` | Show delivery address badge when set |

#### 2.7 What's Preserved (No Breaking Changes)

All Phase 1 features remain intact:
- ✅ AI Chatbot (cart-aware, all 9 intents)
- ✅ Meal Plans page (pre-made + custom builder)
- ✅ Cart system (add/remove/update, localStorage)
- ✅ Promo codes (WELCOME10, FIRST20, CLEAN5, ORGANIC15)
- ✅ Order scheduling (date + time on checkout)
- ✅ Admin panel (menu CRUD, order management)
- ✅ Auth system (Supabase email/password)
- ✅ Email notifications (Resend)
- ✅ Quick prompts in chatbot
- ✅ Toggle add/remove in recommendation cards
- ✅ Meal plan cards with per-meal add to cart

#### 2.8 Implementation Steps (Ordered)

| Step | Task | Dependencies |
|---|---|---|
| 1 | Create `DeliveryContext` + `useDelivery` hook | None |
| 2 | Create `serviceable-areas.ts` data file | None |
| 3 | Redesign landing page (`page.tsx`) with address form + auth section | Steps 1-2 |
| 4 | Add `is_recommended` to seed data + types | None |
| 5 | Create `/api/menu-search` endpoint | `openai.ts` |
| 6 | Redesign menu page (quick nav, AI search, recommended section, enhanced sorting/filters) | Steps 4-5 |
| 7 | Add serviceability gate to checkout | Step 1 |
| 8 | Wrap layout with DeliveryProvider | Step 1 |
| 9 | Update Header with delivery address badge | Step 1 |
| 10 | Update ARCHITECTURE.md + PROJECT_CONTEXT.md | Steps 1-9 |
| 11 | Write + run comprehensive test plan | Steps 1-9 |

### Phase 3 — Future Enhancements

| # | Feature | Priority |
|---|---|---|
| F13 | Payment gateway integration (Stripe/Razorpay) | P1 |
| F14 | Order history & reordering | P1 |
| F15 | Real-time order tracking | P2 |
| F16 | Reviews & ratings | P2 |
| F17 | Loyalty/rewards program | P3 |
| F18 | Multi-language support | P3 |
| F19 | Google Maps autocomplete for address | P1 |
| F20 | Admin UI for managing serviceable areas | P2 |
| F21 | Deals/promo tagging for menu items (admin) | P2 |

---

## 3. Tech Stack

> **Guiding Principles:** Simple, low-cost, easy to deploy, open-source first.

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | **Next.js 14 (React)** | SSR/SSG for SEO, App Router, great DX, easy deployment on Vercel (free tier) |
| **Styling** | **Tailwind CSS** | Rapid UI development, responsive out of the box |
| **Backend/API** | **Next.js API Routes** | No separate backend server needed; full-stack in one project |
| **Database** | **Supabase (PostgreSQL)** | Free tier: 500MB DB, 1GB storage, built-in Auth, REST API, real-time |
| **Authentication** | **Supabase Auth** | Free, email/password sign-up, magic links, OAuth ready |
| **Email Service** | **Resend** (or **EmailJS**) | Resend: 3,000 free emails/month; simple API |
| **AI/Chatbot** | **OpenAI API (GPT-4o-mini) + LangChain** | LangChain framework for chains, prompt templates, memory management; GPT-4o-mini as LLM (~$0.15/1M input tokens) |
| **AI Framework** | **LangChain.js** | Structured prompt management, message-based conversation history, composable chains, easy model switching |
| **AI Alternative** | **Google Gemini API (free tier)** | 15 requests/min free; LangChain makes model switching trivial |
| **Hosting** | **Vercel** | Free tier for Next.js; automatic deployments from Git |
| **Image Storage** | **Supabase Storage** | Free 1GB; serves menu item images |
| **Version Control** | **GitHub** | Free private repos |

### 3.1 Cost Estimate (MVP Monthly)

| Service | Cost |
|---|---|
| Vercel (Hobby) | **$0** |
| Supabase (Free) | **$0** |
| Resend (Free tier) | **$0** |
| OpenAI GPT-4o-mini | **~$2–5** (low volume MVP) |
| Domain name | **~$10–12/year** |
| **Total** | **~$2–5/month** + domain |

### 3.2 Why Next.js Over Plain React?

Next.js **is** React — it's a full-stack framework built on top of React, not a replacement.

| Concern | Plain React (Vite) | Next.js |
|---|---|---|
| Rendering | Client-side only (SPA) | SSR + SSG + Client (hybrid) |
| SEO | ❌ Poor (empty HTML until JS loads) | ✅ Pre-rendered HTML, great for food site discoverability |
| API/Backend | ❌ Need separate Express server (2 deployments) | ✅ Built-in API routes (1 deployment) |
| Routing | Manual (react-router) | ✅ File-based, automatic |
| Deployment | Configure hosting + server separately | ✅ One-click Vercel deploy (free) |
| Image Optimization | Manual | ✅ Built-in `next/image` |

**Verdict:** Next.js saves us from running a separate backend server. Without it, we'd need React + Express/Fastify (2 projects, 2 deployments, more cost). For a food ordering site with SEO needs, API routes, and AI integration — Next.js is the right choice.

### 3.3 Prerequisites (Install Before Starting)

| Prerequisite | Version | Purpose | Install From |
|---|---|---|---|
| **Node.js** | v18+ LTS | JavaScript runtime | [nodejs.org](https://nodejs.org) |
| **npm** (or pnpm) | Bundled with Node | Package manager | Comes with Node.js |
| **Git** | Latest | Version control | [git-scm.com](https://git-scm.com) |
| **Docker Desktop** | Latest *(optional)* | Local Supabase only | [docker.com](https://docker.com) |
| **VS Code** | Latest | IDE | Already installed ✅ |

**Accounts Needed (all free tier):**

| Service | Purpose | Sign Up |
|---|---|---|
| GitHub | Code repository + Vercel CI/CD | [github.com](https://github.com) |
| Supabase | Database + Auth + Storage | [supabase.com](https://supabase.com) |
| OpenAI | AI chatbot (GPT-4o-mini) | [platform.openai.com](https://platform.openai.com) |
| Resend | Order confirmation emails | [resend.com](https://resend.com) |
| Vercel | Hosting & deployment | [vercel.com](https://vercel.com) |

**npm dependencies** (auto-installed via `package.json`):
- `next`, `react`, `react-dom` — core framework
- `tailwindcss`, `postcss`, `autoprefixer` — styling
- `@supabase/supabase-js`, `@supabase/ssr` — database & auth client
- `langchain`, `@langchain/openai`, `@langchain/core` — AI framework (chains, prompts, memory)
- `openai` — OpenAI SDK (used by LangChain internally)
- `resend` — email service SDK
- `zod` — runtime input validation & security
- `typescript`, `@types/react`, `@types/node` — type safety

### 3.4 Database — Where Does It Run?

The database is a **separate service**, NOT packaged inside the app. This is standard for production apps.

```
┌──────────────────────────────────────────────────┐
│             DEVELOPMENT (Local Machine)           │
│                                                  │
│   Next.js App ←→ Supabase CLI (Docker)           │
│   localhost:3000   localhost:54321                │
│                    └── PostgreSQL in container    │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│             PRODUCTION (Cloud)                    │
│                                                  │
│   Next.js App ←→ Supabase Cloud                  │
│   Vercel          https://xxxx.supabase.co       │
│                   └── Managed PostgreSQL (AWS)    │
└──────────────────────────────────────────────────┘
```

**Local development options:**

| Option | How | Docker Required? |
|---|---|---|
| Supabase CLI | `npx supabase start` — full local Supabase (DB + Auth + Storage) | Yes |
| Direct PostgreSQL | Install PostgreSQL locally, connect via connection string | No |
| Supabase Cloud only | Use the free cloud instance even during development | No |

**Recommended approach:** Use **Supabase Cloud** (free) for both dev and prod to keep things simple. Switch to local Supabase CLI if you need offline development.

---

## 4. Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                  │
│  ┌─────────────┐  ┌──────────┐  ┌────────────────┐  │
│  │  Menu Pages  │  │   Cart   │  │  AI Chatbot UI │  │
│  └──────┬──────┘  └────┬─────┘  └───────┬────────┘  │
│         │              │                │            │
└─────────┼──────────────┼────────────────┼────────────┘
          │              │                │
          ▼              ▼                ▼
┌─────────────────────────────────────────────────────┐
│              NEXT.JS API ROUTES (Server)             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │ /api/menu│ │/api/order│ │/api/auth │ │/api/chat│  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘  │
│       │            │            │            │       │
└───────┼────────────┼────────────┼────────────┼───────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐
│  Supabase DB │ │  Resend  │ │ Supabase │ │ OpenAI  │
│ (PostgreSQL) │ │ (Email)  │ │  Auth    │ │   API   │
└──────────────┘ └──────────┘ └──────────┘ └─────────┘
```

### 4.1 Key Design Decisions

1. **Monorepo / Single Project** — Frontend + Backend in one Next.js app. Simpler deployment, fewer moving parts.
2. **Menu as Database** — Menu items stored in Supabase PostgreSQL, editable via admin panel (not hardcoded).
3. **AI Layer is Server-Side** — API key stays on server; chatbot queries go through `/api/chat` route.
4. **Cart in Local State** — Cart stored in React context + localStorage (no DB needed until checkout).
5. **Auth at Checkout** — Users browse freely; signup required only when placing an order.

---

## 5. Database Schema

### 5.1 Tables

```sql
-- ============================================
-- CUISINES
-- ============================================
CREATE TABLE cuisines (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,          -- e.g., "North Indian", "South Indian", "Chinese"
    slug        VARCHAR(100) UNIQUE NOT NULL,
    image_url   TEXT,
    sort_order  INT DEFAULT 0,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- MENU CATEGORIES
-- ============================================
CREATE TABLE categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cuisine_id  UUID REFERENCES cuisines(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,          -- e.g., "Starters", "Main Course", "Breads"
    slug        VARCHAR(100) NOT NULL,
    sort_order  INT DEFAULT 0,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- MENU ITEMS
-- ============================================
CREATE TABLE menu_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id     UUID REFERENCES categories(id) ON DELETE CASCADE,
    name            VARCHAR(200) NOT NULL,       -- "Butter Chicken"
    description     TEXT,                        -- "Creamy tomato-based curry..."
    price           DECIMAL(8,2) NOT NULL,       -- 14.99
    image_url       TEXT,
    
    -- Dietary Tags
    is_vegetarian   BOOLEAN DEFAULT false,
    is_vegan        BOOLEAN DEFAULT false,
    is_gluten_free  BOOLEAN DEFAULT false,
    is_spicy        BOOLEAN DEFAULT false,
    spice_level     INT DEFAULT 0,               -- 0-5 scale
    
    -- Macronutrients (per serving)
    calories        INT,                         -- kcal
    protein_g       DECIMAL(6,1),                -- grams
    carbs_g         DECIMAL(6,1),                -- grams
    fat_g           DECIMAL(6,1),                -- grams
    fiber_g         DECIMAL(6,1),                -- grams
    
    -- Metadata for AI
    mood_tags       TEXT[],                      -- {"comfort", "light", "celebratory", "spicy"}
    keywords        TEXT[],                      -- {"creamy", "tandoori", "grilled"}
    
    -- Status
    is_available    BOOLEAN DEFAULT true,
    is_active       BOOLEAN DEFAULT true,
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- USERS (managed by Supabase Auth, extended)
-- ============================================
CREATE TABLE user_profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name       VARCHAR(200),
    phone           VARCHAR(20),
    email           VARCHAR(255) NOT NULL,
    default_address TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES auth.users(id),
    order_number    SERIAL,
    status          VARCHAR(50) DEFAULT 'placed',  -- placed, confirmed, preparing, ready, delivered, cancelled
    subtotal        DECIMAL(10,2) NOT NULL,
    tax             DECIMAL(10,2) DEFAULT 0,
    total           DECIMAL(10,2) NOT NULL,
    delivery_address TEXT,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ORDER ITEMS
-- ============================================
CREATE TABLE order_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id    UUID REFERENCES menu_items(id),
    item_name       VARCHAR(200) NOT NULL,       -- Denormalized for history
    quantity        INT NOT NULL DEFAULT 1,
    unit_price      DECIMAL(8,2) NOT NULL,
    total_price     DECIMAL(10,2) NOT NULL,
    special_instructions TEXT
);

-- ============================================
-- INDEXES for AI query performance
-- ============================================
CREATE INDEX idx_menu_items_price ON menu_items(price);
CREATE INDEX idx_menu_items_calories ON menu_items(calories);
CREATE INDEX idx_menu_items_dietary ON menu_items(is_vegetarian, is_vegan, is_gluten_free);
CREATE INDEX idx_menu_items_mood ON menu_items USING GIN(mood_tags);
CREATE INDEX idx_menu_items_available ON menu_items(is_available, is_active);
CREATE INDEX idx_orders_user ON orders(user_id);
```

---

## 6. AI Chatbot — Design (LangChain-Powered)

### 6.1 How It Works

```
User Input (natural language)
        │
        ▼
┌───────────────────────────┐
│    Next.js /api/chat      │
│                           │
│  1. Build LangChain chain │
│     (ChatPromptTemplate + │
│      ChatOpenAI + Parser) │──────────────────────┐
│                           │                      │
│  2. Pass user query +     │                      ▼
│     menu context +        │              ┌──────────────┐
│     chat history          │              │   OpenAI API │
│     (message history)     │              │  (GPT-4o-mini)│
│                           │              └──────┬───────┘
│  3. LangChain returns     │◄─────────────────────┘
│     structured JSON with  │
│     intent + filters      │
│                           │
│  4. Route by intent:      │
│     - recommendation →    │
│       filter menu items   │
│     - not_available →     │
│       find similar items  │
│     - meal_plan →         │
│       structured plan     │
│     - schedule_order →    │
│       confirm scheduling  │
│     - off_topic →         │
│       polite rejection    │
│                           │
│  5. Return ranked results │
└─────────┬─────────────────┘
          │
          ▼
   Chatbot UI shows:
   - Recommendation cards with "Add to Cart"
   - Meal plan cards (weekly view)
   - Follow-up suggestion chips
   - Schedule order badges
```

### 6.2 LangChain Architecture

The chatbot uses a **LangChain RunnableSequence** chain:

```typescript
// Chain: ChatPromptTemplate → ChatOpenAI → StringOutputParser
const chain = RunnableSequence.from([
  ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_PROMPT],       // Includes menu context
    new MessagesPlaceholder("chat_history"),  // Conversation memory
    ["human", "{input}"],
  ]),
  new ChatOpenAI({ modelName: "gpt-4o-mini" }),
  new StringOutputParser(),
]);
```

**Key LangChain features used:**
- `SystemMessage` + `HumanMessage` + `AIMessage` — structured message-based prompts
- Message history: last 10 exchanges passed as `BaseMessage[]` per request
- `ChatOpenAI` → `StringOutputParser` — model invocation pipeline
- Session tracking with automatic TTL cleanup (30 min)
- Randomized recommendation results for varied suggestions on repeated queries

### 6.3 Intent Types

| Intent | Description | Bot Behavior |
|---|---|---|
| `recommendation` | User wants food suggestions | Extract filters → query menu → show results |
| `not_available` | Dish not on menu | Apologize → show similar alternatives |
| `meal_plan` | Weekly meal planning | Ask follow-ups → build structured weekly plan |
| `schedule_order` | Schedule future order | Confirm day → ask what to order |
| `off_topic` | Unrelated message | Politely decline, redirect to food |
| `clarification` | Vague/incomplete message | Ask for more details |
| `greeting` | Hello/hi | Welcome message with capabilities |
| `question` | About restaurant/dish | Answer helpfully |

### 6.4 Example Conversations

| User Says | Intent | Bot Behavior |
|---|---|---|
| "Something spicy under $12" | recommendation | Filters: budget_max=12, mood=["spicy"] → shows matching dishes |
| "I want vegan food" | recommendation | Immediately shows vegan options, no lecture |
| "I want butter chicken" | recommendation | Confirms available, asks: "Spicy or mild? Want naan with it?" |
| User clicks Add on recommendation | — | Item added to cart; click again to remove (toggle) |
| Meal plan generated | meal_plan | Each meal shows Add/Remove button to add to cart |
| "Show me vegan food" (repeated) | recommendation | Returns randomized selection from matching items each time |
| "Do you have pizza?" | not_available | "Sorry, no pizza. Try: Stuffed Paratha, Paneer Kathi Roll" |
| "Plan my meals for the week" | meal_plan | Asks budget/diet → returns 7-day plan with prices & calories |
| "Schedule order for Friday" | schedule_order | "Got it! What would you like for Friday?" |
| "What's the weather today?" | off_topic | "I can only help with food! What are you craving?" |
| "asdf" | clarification | "I didn't understand. Try: 'spicy food under $12'" |
| "High protein low carb" | recommendation | Filters: min_protein=30, max_carbs=20 → shows matching |

### 6.5 Chatbot UI

- **Floating chat bubble** (bottom-right corner)
- Expandable chat window with message history
- **LangChain powered** badge in header
- Recommendation cards with: name, price, calories, protein, "Add to Cart" button
- **Meal plan cards** — weekly view with daily meals, prices, and calorie totals
- **Schedule order badges** — shows confirmed scheduling day
- **Follow-up suggestion chips** — clickable AI-suggested follow-up questions
- Quick-prompt chips: "🌶️ Spicy", "💪 High Protein", "💰 Under $10", "🥗 Healthy", "📅 Meal Plan", "⏰ Schedule"
- Typing indicator while AI processes
- Session-based conversation memory (persists across messages, resets on page refresh)

---

## 7. API Routes

| Method | Route | Description | Auth Required |
|---|---|---|---|
| GET | `/api/menu` | Get full menu (with filters) | No |
| GET | `/api/menu/[id]` | Get single menu item | No |
| GET | `/api/cuisines` | List all cuisines | No |
| POST | `/api/chat` | Send message to AI chatbot | No |
| POST | `/api/auth/signup` | Email signup | No |
| POST | `/api/auth/login` | Email login | No |
| POST | `/api/orders` | Place an order | Yes |
| GET | `/api/orders` | Get user's orders | Yes |
| GET | `/api/orders/[id]` | Get order details | Yes |
| **Admin Routes** | | | |
| POST | `/api/admin/menu` | Add menu item | Admin |
| PUT | `/api/admin/menu/[id]` | Update menu item | Admin |
| DELETE | `/api/admin/menu/[id]` | Delete menu item | Admin |
| GET | `/api/admin/orders` | View all orders | Admin |
| PUT | `/api/admin/orders/[id]` | Update order status | Admin |

---

## 8. Page Structure

```
/                           → Landing page with hero, featured items, CTA
/menu                       → Full menu with cuisine filters, search, dietary toggles
/menu/[cuisine-slug]        → Filtered menu by cuisine
/cart                       → Shopping cart with item list, totals
/checkout                   → Signup/login + delivery details + place order
/order-confirmation/[id]    → Order confirmation page
/orders                     → Order history (authenticated)
/admin                      → Admin dashboard (protected)
/admin/menu                 → Menu management (CRUD)
/admin/orders               → Order management
```

---

## 9. Project Folder Structure

```
dqb/
├── public/
│   ├── images/
│   │   ├── hero.jpg
│   │   ├── logo.svg
│   │   └── cuisines/
│   └── favicon.ico
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   ├── menu/
│   │   │   ├── page.tsx              # Menu listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Cuisine-filtered menu
│   │   ├── cart/
│   │   │   └── page.tsx              # Cart page
│   │   ├── checkout/
│   │   │   └── page.tsx              # Checkout (auth + order)
│   │   ├── order-confirmation/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── orders/
│   │   │   └── page.tsx              # Order history
│   │   ├── admin/
│   │   │   ├── page.tsx              # Admin dashboard
│   │   │   ├── menu/
│   │   │   │   └── page.tsx          # Menu CRUD
│   │   │   └── orders/
│   │   │       └── page.tsx          # Order management
│   │   └── api/
│   │       ├── menu/
│   │       │   └── route.ts
│   │       ├── cuisines/
│   │       │   └── route.ts
│   │       ├── chat/
│   │       │   └── route.ts          # AI chatbot endpoint
│   │       ├── orders/
│   │       │   └── route.ts
│   │       ├── auth/
│   │       │   └── route.ts
│   │       └── admin/
│   │           ├── menu/
│   │           │   └── route.ts
│   │           └── orders/
│   │               └── route.ts
│   ├── components/
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── menu/
│   │   │   ├── MenuGrid.tsx
│   │   │   ├── MenuItem.tsx
│   │   │   ├── CuisineFilter.tsx
│   │   │   ├── DietaryFilter.tsx
│   │   │   └── MacroDisplay.tsx
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── CartIcon.tsx
│   │   ├── chatbot/
│   │   │   ├── ChatWidget.tsx        # Floating chat bubble + window
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── RecommendationCard.tsx
│   │   │   └── QuickPrompts.tsx
│   │   └── admin/
│   │       ├── MenuForm.tsx
│   │       └── OrderTable.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser Supabase client
│   │   │   ├── server.ts             # Server Supabase client
│   │   │   └── admin.ts              # Admin Supabase client
│   │   ├── openai.ts                 # OpenAI client setup
│   │   ├── email.ts                  # Resend email helper
│   │   └── utils.ts                  # Shared utilities
│   ├── hooks/
│   │   ├── useCart.ts                # Cart state management
│   │   ├── useAuth.ts               # Auth state hook
│   │   └── useChat.ts               # Chatbot state hook
│   ├── context/
│   │   ├── CartContext.tsx
│   │   └── AuthContext.tsx
│   ├── types/
│   │   └── index.ts                  # TypeScript type definitions
│   └── data/
│       └── seed-menu.ts              # Initial menu seed data
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    # Database migration
├── .env.local                        # Environment variables (not committed)
├── .env.example                      # Template for env vars
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── README.md
└── PLAN.md                           # This file
```

---

## 10. Environment Variables

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=sk-xxxx

# Resend (Email)
RESEND_API_KEY=re_xxxx
EMAIL_FROM=orders@desiquickbite.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Desi Quick Bite

# Admin (simple admin check for MVP)
ADMIN_EMAIL=admin@desiquickbite.com
```

---

## 11. Menu Configuration Strategy

The menu is **fully database-driven**, making it easy to add/remove items without code changes.

### 11.1 Admin Panel Features
- **Add/Edit/Delete** menu items with a form
- **Toggle availability** (out of stock) without deleting
- **Reorder items** via drag-and-drop or sort_order field
- **Upload images** to Supabase Storage
- **Bulk import** via CSV/JSON (future)

### 11.2 Seed Data Approach
- Initial menu loaded via a seed script (`src/data/seed-menu.ts`)
- Covers 5–6 cuisines, 40–60 items with full macro data
- Cuisines: North Indian, South Indian, Indo-Chinese, Street Food, Desserts, Beverages

---

## 12. Email Notification Flow

```
Order Placed → /api/orders (POST)
    │
    ├── 1. Save order to DB
    ├── 2. Send confirmation email via Resend
    │       Subject: "🍛 Order #1042 Confirmed — Desi Quick Bite"
    │       Body:  Order summary, items, total, estimated time
    │
    └── 3. Return order confirmation to client
```

### Email Template (HTML)
- Branded header with logo
- Order number & timestamp
- Itemized list with quantities and prices
- Subtotal, tax, total
- Delivery address
- "Track your order" link (Phase 2)

---

## 13. Implementation Roadmap

### Sprint 1 (Week 1–2): Foundation
- [x] Project setup (Next.js + Tailwind + Supabase)
- [ ] Database schema & migrations
- [ ] Seed menu data (40+ items with macros)
- [ ] Menu display pages (grid, filters, search)
- [ ] Individual menu item view with macros
- [ ] Responsive header/footer layout

### Sprint 2 (Week 2–3): Cart & Auth
- [ ] Cart context + localStorage persistence
- [ ] Cart page UI
- [ ] Supabase Auth integration (email signup/login)
- [ ] Checkout flow (auth gate → delivery details → place order)
- [ ] Order placement API
- [ ] Email notification via Resend

### Sprint 3 (Week 3–4): AI Chatbot
- [ ] OpenAI integration (`/api/chat`)
- [ ] System prompt engineering & intent extraction
- [ ] Database query builder from AI-extracted filters
- [ ] Chat widget UI (floating bubble, message list)
- [ ] Recommendation cards with "Add to Cart"
- [ ] Quick prompt chips

### Sprint 4 (Week 4–5): Admin & Polish
- [ ] Admin authentication (role-based)
- [ ] Admin menu CRUD panel
- [ ] Admin order view & status updates
- [ ] SEO optimization (meta tags, OG images)
- [ ] Performance optimization (image lazy loading, caching)
- [ ] Error handling & loading states

### Sprint 5 (Week 5–6): Testing & Deployment
- [ ] End-to-end testing of all flows
- [ ] Mobile responsiveness QA
- [ ] Chatbot prompt tuning & edge case handling
- [ ] Vercel production deployment
- [ ] Custom domain setup
- [ ] Monitoring & analytics (Vercel Analytics — free)

---

## 14. Deployment Checklist

- [ ] Supabase project created (free tier)
- [ ] Database migrations applied
- [ ] Menu seeded with initial data
- [ ] OpenAI API key provisioned
- [ ] Resend account & domain verified
- [ ] Environment variables set in Vercel
- [ ] GitHub repo connected to Vercel
- [ ] Custom domain configured
- [ ] SSL certificate active (automatic on Vercel)
- [ ] Admin account created

---

## 15. Risk Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| OpenAI API cost spikes | Medium | Rate limiting, GPT-4o-mini (cheapest), cache frequent queries |
| Supabase free tier limits | Low | 500MB is plenty for MVP; upgrade only if traffic demands |
| Chatbot hallucinations | Medium | Structured JSON output, validate against real menu data |
| Email deliverability | Low | Resend has good reputation; verify domain DNS |
| Menu images too large | Low | Compress on upload, use Next.js Image component |

---

## 16. Security Design

### 16.1 API Key Protection

| Variable | Scope | Exposed to Browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | ✅ Yes (safe — it's just the project URL) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | ✅ Yes (safe — restricted by RLS policies) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | ❌ Never — bypasses RLS, admin use only |
| `OPENAI_API_KEY` | Server only | ❌ Never — only used in `/api/chat` route |
| `RESEND_API_KEY` | Server only | ❌ Never — only used in `/api/orders` route |

**Rule:** Only variables prefixed with `NEXT_PUBLIC_` are sent to the browser. All other secrets stay on the server in API routes.

### 16.2 Row Level Security (RLS) — Supabase

RLS ensures users can only access their own data, even if someone crafts malicious API requests.

```sql
-- Menu: publicly readable (no auth needed)
CREATE POLICY "Public menu read" ON menu_items
    FOR SELECT USING (is_active = true AND is_available = true);

-- Orders: users see only their own
CREATE POLICY "Users view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

-- Orders: users create only for themselves
CREATE POLICY "Users create own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items: accessible via order ownership
CREATE POLICY "Users view own order items" ON order_items
    FOR SELECT USING (
        order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
    );

-- Admin: full access via service_role key (server-side only)
```

### 16.3 Input Validation

All API inputs are validated server-side using **Zod** schemas:

```typescript
// Example: Order placement validation
const orderSchema = z.object({
  items: z.array(z.object({
    menu_item_id: z.string().uuid(),
    quantity: z.number().int().min(1).max(50),
    special_instructions: z.string().max(500).optional(),
  })).min(1).max(100),
  delivery_address: z.string().min(10).max(500),
  notes: z.string().max(1000).optional(),
});
```

### 16.4 Security Summary

| Threat | Protection |
|---|---|
| SQL Injection | Supabase uses parameterized queries; no raw SQL |
| XSS (Cross-Site Scripting) | React auto-escapes JSX; user inputs sanitized |
| CSRF | Supabase Auth uses httpOnly cookies + CSRF tokens |
| Unauthorized Data Access | Row Level Security on all tables |
| API Abuse / DDoS | Rate limiting on `/api/chat` (10 req/min per IP); Vercel edge protection |
| Man-in-the-Middle | HTTPS enforced by Vercel (automatic SSL) + Supabase TLS |
| Admin Route Access | Server-side admin email check; service_role key never exposed |
| Secrets in Source Code | `.env.local` in `.gitignore`; production secrets in Vercel dashboard |
| Email Spam via Order API | Auth required to place orders; Resend domain verification (SPF/DKIM) |
| Chatbot Prompt Injection | Structured JSON output only; AI responses validated against real menu DB |

---

## 17. Future Enhancements (Post-MVP)

1. **Payment Integration** — Stripe or Razorpay for online payments
2. **Order Tracking** — Real-time status updates via Supabase Realtime
3. **Progressive Web App (PWA)** — Install on mobile, offline menu browsing
4. **Voice Input** — "Hey DQB, I want something spicy under $10"
5. **Meal Planning** — Weekly meal suggestions based on macro goals
6. **Multi-Restaurant Support** — Platform model for multiple vendors
7. **Reviews & Ratings** — User reviews with AI-summarized sentiment
8. **Recommendation Learning** — Track what users order after AI suggestions to improve recommendations

---

## 18. Success Metrics (MVP)

| Metric | Target |
|---|---|
| Menu load time | < 2 seconds |
| Chatbot response time | < 3 seconds |
| Chatbot recommendation relevance | > 80% user satisfaction |
| Order completion rate | > 60% of cart additions |
| Monthly hosting cost | < $10 |
| Time to first order (new user) | < 3 minutes |

---

## ✅ Approval

> **To proceed with implementation, please review and confirm:**
> 1. Tech stack (Next.js + Supabase + OpenAI + Resend)
> 2. Feature scope (MVP features F1–F8)
> 3. Database schema
> 4. AI chatbot approach
> 5. Implementation timeline (4–6 weeks)
>
> Reply with **"Approved"** to begin Sprint 1, or provide feedback for adjustments.
