# 🏗️ Desi Quick Bite — Architecture Document

> **Version:** 2.1 | **Date:** March 14, 2026

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                       │
│                                                             │
│  ┌──────────┐ ┌────────┐ ┌──────────┐ ┌───────────┐ ┌───────────┐│
│  │Landing   │ │  Cart  │ │ Checkout │ │AI Chatbot │ │Meal Plans ││
│  │(Location)│ │(Client)│ │ (Client) │ │ (Client)  │ │ (Client)  ││
│  └────┬─────┘ └───┬────┘ └────┬─────┘ └─────┬─────┘ └─────┬─────┘│
│       │            │            │               │          │      │
│  DeliveryContext    │            │         ChatState        │      │
│  CartContext ←──────┘            │         (useState)       │      │
│  (both localStorage)             │                          │      │
│  ┌──────────┐                    │                                 │
│  │Menu Page │── AI Search ──────►/api/menu-search                  │
│  │(QuickNav)│                                                      │
│  └──────────┘                                                      │
└────────┼────────────────────────┼───────────────┼───────────┘
         │                        │               │
         ▼                        ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│               NEXT.JS SERVER (API Routes)                   │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │  /api/menu   │ │ /api/orders  │ │    /api/chat         │ │
│  │  /api/cuisines│ │ /api/auth   │ │  1. Build LangChain  │ │
│  │              │ │              │ │     chain            │ │
│  │  Read-only   │ │ Auth-gated   │ │  2. Invoke with msg  │ │
│  │  Public      │ │ Write ops    │ │     + memory + ctx   │ │
│  └──────┬───────┘ └──────┬───────┘ │  3. Route by intent  │ │
│         │                │         │  4. Filter menu data │ │
│  ┌──────────────────┐    │         │  5. Return results   │ │
│  │  /api/admin/*    │    │         └──────────┬───────────┘ │
│  │  /api/admin/*    │    │                    │             │
│  │  Admin-gated     │    │                    │             │
│  └────────┬─────────┘    │                    │             │
└───────────┼──────────────┼────────────────────┼─────────────┘
            │              │                    │
            ▼              ▼                    ▼
     ┌───────────────────────────────────┐  ┌────────────┐
     │         SUPABASE                │  │  OpenAI   │
     │  ┌──────────┐  ┌────────────┐   │  │ GPT-4o-  │
     │  │PostgreSQL│  │  Auth      │   │  │  mini    │
     │  │  + RLS   │  │ (JWT)     │   │  └────┬───────┘
     │  └──────────┘  └────────────┘   │       │
     │  ┌──────────┐                   │  ┌────▼───────┐
     │  │ Storage  │                   │  │ LangChain │
     │  │ (Images) │                   │  │  Chains + │
     │  └──────────┘                   │  │  Memory   │
     └───────────────────────────────────┘  │  └───────────┘
                                          ┌──────────┐
                                          │  Resend  │
                                          │ (Email)  │
                                          └──────────┘
```

---

## 2. Data Flow Diagrams

### 2.1 Menu Browsing (No Auth)

```
Browser → GET /api/menu?cuisine=north-indian&vegetarian=true
       → Supabase query with filters
       → Return JSON array of menu items
       → Render MenuGrid with MenuItem cards
```

### 2.2 AI Chatbot Flow (LangChain)

```
User types: "spicy food under $12"
  │
  ▼
POST /api/chat { message: "spicy food under $12", history: [...], sessionId: "abc", cartSummary: "Butter Chicken x2 ($29.98) | Total: $29.98" }
  │
  ├─→ LangChain Message-based Invocation:
  │     1. SystemMessage (system prompt with menu context + cart summary injected)
  │     2. AIMessage/HumanMessage array (last 10 exchanges)
  │     3. HumanMessage (current user input)
  │     4. ChatOpenAI (GPT-4o-mini, temp=0.4)
  │     5. StringOutputParser → JSON parse
  │     Returns: { intent: "recommendation", filters: { budget_max: 12, mood: ["spicy"] }, message: "..." }
  │
  ├─→ Intent Router:
  │     - recommendation → filter menuItems array with extracted filters
  │     - not_available → fuzzy search for similar items
  │     - meal_plan → return structured weekly plan
  │     - schedule_order → confirm scheduling
  │     - off_topic → polite rejection
  │     - clarification → ask for more info
  │
  └─→ Response: { reply: "...", recommendations: [...items], intent, follow_up, meal_plan, schedule_day }
       → Render RecommendationCards (toggle Add/Remove) / MealPlanCard (per-meal Add to Cart) / ScheduleBadge
```

### 2.2.1 Supported Intents

| Intent | Trigger | Response |
|---|---|---|
| recommendation | Food request with filters | Filtered dish list with "Add to Cart" |
| not_available | Dish not on menu | Apology + similar alternatives |
| meal_plan | "Plan my meals for the week" | Follow-up questions → 7-day plan card |
| schedule_order | "Schedule order for Friday" | Day confirmation + order prompt |
| off_topic | "What's the weather?" | Polite redirect to food topics |
| clarification | "asdf" or vague text | Request for clearer input |
| greeting | "Hello" / "Hi" | Welcome + capability list |
| question | "What are your hours?" | Helpful answer |

### 2.3 Delivery & Serviceability Flow (Phase 2)

```
User lands on homepage (dark glassmorphism landing — no header/footer/chatbot)
  │
  ├─→ Single address bar with autocomplete (50+ areas: NYC, Ontario cities)
  │   Type → suggestions dropdown → select or free-type
  ├─→ Select timing: "Deliver Now" or "Schedule" (date + time)
  │
  ▼
parseAddressForServiceability(fullAddress) → { city, zip }
  Supports US 5-digit ZIP and Canadian FSA postal codes
  │
  ▼
checkServiceability(zip, city)
  │
  ├─→ Serviceable (ZIP/city/FSA match) → Green toast → /menu
  ├─→ Not serviceable → Amber toast → /menu (checkout blocked)
  │
  └─→ DeliveryContext stores: address, city, zip, isServiceable, timing, hasEnteredAddress
       Persisted in localStorage (dqb-delivery)
       Header shows address badge (green/amber dot) — on all pages except landing
       Checkout pre-fills address, disables "Place Order" if unserviceable
```

### 2.4 AI-Powered Menu Search Flow (Phase 2)

```
Menu Page Layout (search-first, no heading):
  ┌──────────────────────────────────────────┐
  │  Search Bar (glass-input, AI Search btn) │  ← Top of page
  │  QuickNav Pills (Deals, Breakfast, etc.) │  ← Category shortcuts
  │  Advanced Filters toggle (collapsible)   │  ← Cuisine, dietary, sort, price
  │  Recommended Section (if no search)      │  ← Curated picks
  │  Menu Grid                               │  ← All matching items
  └──────────────────────────────────────────┘

User types: "vegan meals under $12"
  │
  ├─→ Client detects smart query (contains $, protein, calories, etc.)
  ├─→ POST /api/menu-search { query: "vegan meals under $12" }
  │     │
  │     ├─→ LangChain (GPT-4o-mini, temp=0.1, max 300 tokens)
  │     │   Lightweight prompt: extract filters only (no conversation)
  │     │   Returns: { is_vegan: true, max_price: 12, message: "..." }
  │     │
  │     └─→ Client applies AI filters to menu items in-page
  │
  └─→ Plain text query → existing client-side text search (name, desc, keywords)
```

### 2.5 Order Placement Flow

```
Cart (localStorage) → Checkout Page
  │
  ├─→ If not authenticated → Show signup/login form
  │     POST Supabase Auth → signup/signInWithPassword
  │     Store JWT session
  │
  ├─→ (Optional) Apply promo code → client-side validation
  │     WELCOME10 (10%), FIRST20 (20%, min $25), CLEAN5 ($5 flat), ORGANIC15 (15%, min $30)
  │     Discount applied to subtotal → tax recalculated on discounted amount
  │
  ├─→ Enter delivery details
  │
  ├─→ (Optional) Schedule order for future date/time
  │     Date picker (min: today) + time slot selector (11am-9pm)
  │     scheduled_date & scheduled_time sent in order payload
  │
  └─→ POST /api/orders { items: [...], delivery_address, promo_code, discount, scheduled_date, scheduled_time, notes }
        │
        ├─→ Validate with Zod schema
        ├─→ Verify all menu_item_ids exist & prices match
        ├─→ INSERT into orders + order_items tables
        ├─→ Send confirmation email via Resend
        └─→ Return { order_id, order_number }
             → Redirect to /order-confirmation/[id]
             → Clear cart
```

### 2.4 Admin Flow

```
Admin logs in (email matches ADMIN_EMAIL env var)
  │
  ├─→ /admin → Dashboard (order count, revenue)
  ├─→ /admin/menu → CRUD menu items
  │     POST/PUT/DELETE /api/admin/menu
  │     Uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS)
  └─→ /admin/orders → View & update order statuses
        PUT /api/admin/orders/[id] { status: "preparing" }
```

---

## 3. Security Architecture

```
┌─────────────────────────────────────────────────┐
│                  SECURITY LAYERS                 │
│                                                  │
│  Layer 1: HTTPS (Vercel automatic SSL)           │
│  Layer 2: Supabase Auth (JWT tokens)             │
│  Layer 3: Row Level Security (PostgreSQL RLS)    │
│  Layer 4: Zod Input Validation (API routes)      │
│  Layer 5: Server-only API Keys                   │
│  Layer 6: Rate Limiting (/api/chat)              │
│  Layer 7: React XSS Protection (auto-escape)     │
└─────────────────────────────────────────────────┘
```

### Key Rules
- `NEXT_PUBLIC_*` vars → Safe for browser (Supabase URL, anon key)
- All other env vars → Server-only (OpenAI key, service role key, Resend key)
- RLS policies enforce data isolation per user
- Admin routes check `user.email === ADMIN_EMAIL` server-side

---

## 4. Database Schema (ER Diagram)

```
┌──────────┐     ┌────────────┐     ┌─────────────┐
│ cuisines │────<│ categories │────<│ menu_items  │
│          │  1:N│            │  1:N│             │
│ id (PK)  │     │ id (PK)    │     │ id (PK)     │
│ name     │     │ cuisine_id │     │ category_id │
│ slug     │     │ name       │     │ name        │
│ image_url│     │ slug       │     │ description │
│ sort_order│    │ sort_order │     │ price       │
│ is_active│     │ is_active  │     │ image_url   │
└──────────┘     └────────────┘     │ is_veg/vegan│
                                     │ calories    │
                                     │ protein_g   │
                                     │ carbs_g     │
                                     │ fat_g       │
                                     │ mood_tags[] │
                                     │ keywords[]  │
                                     │ is_available│
                                     └──────┬──────┘
                                            │
┌───────────────┐     ┌─────────────┐       │
│ user_profiles │     │   orders    │       │
│               │     │             │       │
│ id (PK/FK)   │────<│ id (PK)     │       │
│ full_name    │  1:N│ user_id(FK) │       │
│ phone        │     │ order_number│       │
│ email        │     │ status      │       │
│ default_addr │     │ subtotal    │       │
└───────────────┘     │ tax         │       │
                      │ total       │       │
                      │ delivery_addr│      │
                      └──────┬──────┘       │
                             │              │
                      ┌──────┴──────┐       │
                      │ order_items │───────┘
                      │             │   N:1
                      │ id (PK)     │
                      │ order_id(FK)│
                      │ menu_item_id│
                      │ item_name   │
                      │ quantity    │
                      │ unit_price  │
                      │ total_price │
                      └─────────────┘
```

---

## 5. Component Tree

```
RootLayout
├── CartProvider (Context)
│   ├── AuthProvider (Context)
│   │   ├── DeliveryProvider (Context — address, timing, serviceability)
│   │   │   ├── LayoutShell (conditionally renders Header/Footer/ChatWidget)
│   │   │   │   │
│   │   │   │   ├── [Landing Page — / path] (standalone, no shell chrome)
│   │   │   │   │   ├── Dark glassmorphism hero (bg-[#0f0f1a])
│   │   │   │   │   ├── Single address bar + autocomplete dropdown
│   │   │   │   │   ├── Timing pills (Deliver Now / Schedule)
│   │   │   │   │   ├── Auth modal overlay (Sign In / Create Account)
│   │   │   │   │   └── Trust badges (No Seed Oils, Organic, Homemade, AI)
│   │   │   │   │
│   │   │   │   ├── Header (all pages except /)
│   │   │   │   │   ├── Logo
│   │   │   │   │   ├── NavLinks (Home, Menu, Meal Plans, Orders)
│   │   │   │   │   ├── DeliveryBadge (address + green/amber dot)
│   │   │   │   │   ├── CartIcon (item count badge)
│   │   │   │   │   └── MobileNav (hamburger menu)
│   │   │   │   │
│   │   │   │   ├── <Page Content> (varies by route)
│   │   │   │   │   ├── Menu Page (search bar top, QuickNav, filters, recommended)
│   │   │   │   │   ├── Cart Page
│   │   │   │   │   ├── Checkout (serviceability gate, pre-filled address)
│   │   │   │   │   ├── Meal Plans
│   │   │   │   │   └── ... (other pages)
│   │   │   │   │
│   │   │   │   ├── Footer (all pages except /)
│   │   │   │   └── ChatWidget (floating, all pages except /)
```

---

## 6. Design System — Dark Glassmorphism

All user-facing pages use a unified dark glassmorphism theme:

| Token | Value | Usage |
|---|---|---|
| `--background` | `#0f0f1a` | Global body background |
| `--foreground` | `#f1f5f9` | Primary text color |
| `.glass-card` | `rgba(255,255,255,0.04)` + `backdrop-blur:24px` + `border:rgba(255,255,255,0.06)` | Cards, panels, sections |
| `.glass-card-light` | `rgba(255,255,255,0.06)` variant | Lighter glass panels |
| `.glass-input` | `rgba(255,255,255,0.08)` + orange focus ring | All text inputs |
| Accent color | `orange-400` / `orange-500` | CTAs, prices, active pills, links |
| Muted text | `gray-400` | Secondary text, descriptions |
| Dividers | `border-white/[0.06]` | Section separators |

**LayoutShell** (`src/components/layout/LayoutShell.tsx`): Conditionally renders Header, Footer, and ChatWidget on all routes except the landing page (`/`). The landing page has its own standalone dark layout with no shell chrome.

Ambient glow effects (radial gradients) are used on the landing page and menu page for depth.

---

## 7. State Management

| State | Storage | Scope | Persistence |
|---|---|---|---|
| Cart items | React Context + localStorage | Global | Survives page refresh |
| Delivery state | React Context + localStorage | Global | Survives page refresh |
| Auth session | Supabase Auth (cookies) | Global | Survives page refresh |
| Chat messages | React useState | ChatWidget | Lost on page refresh |
| Chat session ID | React useState | ChatWidget | Lost on page refresh |
| Chat open state | React useState + CustomEvent | ChatWidget (global listener) | Lost on page refresh |
| LangChain history | Server-side message array (last 10) | Per request | Rebuilt each request from client history |
| Promo code | React useState (checkout) | Checkout page | Lost on navigation |
| Menu data | Server Component fetch | Per-page | Re-fetched on navigation |
| Admin data | Server Component fetch | Per-page | Re-fetched on navigation |
| AI search filters | React useState (menu page) | Menu page | Lost on navigation |

---

## 8. API Contract Summary

### Public APIs (No Auth)
```
GET  /api/menu?cuisine=X&vegetarian=true&maxPrice=15&search=chicken
GET  /api/cuisines
POST /api/chat  { message: string, history: ChatMessage[], sessionId: string, cartSummary?: string }
POST /api/menu-search  { query: string } → { filters: ChatFilters, message: string }
```

### Authenticated APIs
```
POST /api/orders  { items: OrderItem[], delivery_address: string, notes?: string }
GET  /api/orders
GET  /api/orders/[id]
```

### Admin APIs (Admin Email Check)
```
POST   /api/admin/menu     { ...menuItemData }
PUT    /api/admin/menu/[id] { ...menuItemData }
DELETE /api/admin/menu/[id]
GET    /api/admin/orders
PUT    /api/admin/orders/[id] { status: string }
```
