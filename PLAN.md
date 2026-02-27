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

### Phase 2 — Post-MVP (Future)

| # | Feature | Priority |
|---|---|---|
| F9 | Payment gateway integration (Stripe/Razorpay) | P1 |
| F10 | Order history & reordering | P1 |
| F11 | Real-time order tracking | P2 |
| F12 | Reviews & ratings | P2 |
| F13 | Loyalty/rewards program | P3 |
| F14 | Multi-language support | P3 |

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
| **AI/Chatbot** | **OpenAI API (GPT-4o-mini)** | Cheapest capable model (~$0.15/1M input tokens); natural language understanding |
| **AI Alternative** | **Google Gemini API (free tier)** | 15 requests/min free; good fallback to keep costs at $0 |
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
- `openai` — AI API client
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

## 6. AI Chatbot — Design

### 6.1 How It Works

```
User Input (natural language)
        │
        ▼
┌─────────────────────┐
│  Next.js /api/chat  │
│                     │
│  1. Send user query │──────────────────────┐
│     + menu context  │                      │
│     to OpenAI       │                      ▼
│                     │              ┌──────────────┐
│  2. OpenAI returns  │◄─────────────│   OpenAI API │
│     structured JSON │              │  (GPT-4o-mini)│
│     with filters    │              └──────────────┘
│                     │
│  3. Query Supabase  │
│     with filters    │
│                     │
│  4. Return ranked   │
│     recommendations │
└─────────┬───────────┘
          │
          ▼
   Chatbot UI shows
   recommendation cards
   with "Add to Cart" button
```

### 6.2 AI System Prompt (Template)

```
You are "DQB Bot", the AI food assistant for Desi Quick Bite restaurant.

Your job is to help customers find the perfect dish based on their preferences.

When a user asks for food recommendations, extract the following from their message:
- budget_max: maximum price (number or null)
- budget_min: minimum price (number or null)  
- cuisine: preferred cuisine type (string or null)
- dietary: dietary restrictions ["vegetarian", "vegan", "gluten_free"] or []
- mood: eating mood ["comfort", "light", "celebratory", "spicy", "healthy"] or []
- max_calories: maximum calories per serving (number or null)
- min_protein: minimum protein in grams (number or null)
- max_carbs: maximum carbs in grams (number or null)
- max_fat: maximum fat in grams (number or null)
- query_text: general search terms (string)

Respond ONLY with valid JSON in this format:
{
  "message": "A friendly, short response to the user",
  "filters": { ... extracted filters above ... },
  "intent": "recommendation" | "question" | "greeting" | "other"
}
```

### 6.3 Example Conversations

| User Says | Bot Extracts | Bot Recommends |
|---|---|---|
| "Something spicy under $12" | budget_max: 12, mood: ["spicy"] | Spicy Paneer Tikka ($9.99), Chicken Vindaloo ($11.49) |
| "High protein, low carb meal" | min_protein: 30, max_carbs: 20 | Tandoori Chicken ($13.99, 42g protein, 8g carbs) |
| "I'm feeling sad, comfort food please" | mood: ["comfort"] | Butter Chicken, Dal Makhani, Kheer |
| "Vegan options for a family of 4 under $40" | dietary: ["vegan"], budget_max: 40 | Chana Masala, Aloo Gobi, Veg Biryani, Gulab Jamun (vegan) |
| "What's the healthiest thing you have?" | mood: ["healthy"], sort by calories asc | Tandoori Salad (180 cal), Grilled Fish (220 cal) |

### 6.4 Chatbot UI

- **Floating chat bubble** (bottom-right corner)
- Expandable chat window with message history
- Recommendation cards with: image, name, price, calories, "Add to Cart" button
- Quick-prompt chips: "🌶️ Spicy", "💪 High Protein", "💰 Under $10", "🥗 Healthy"
- Typing indicator while AI processes

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
