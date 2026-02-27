# 🏗️ Desi Quick Bite — Architecture Document

> **Version:** 1.0 | **Date:** February 25, 2026

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                       │
│                                                             │
│  ┌───────────┐  ┌────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ Menu Pages│  │  Cart  │  │ Checkout │  │ AI Chatbot  │  │
│  │ (SSR/SSG) │  │(Client)│  │ (Client) │  │  (Client)   │  │
│  └─────┬─────┘  └───┬────┘  └────┬─────┘  └──────┬──────┘  │
│        │            │            │               │          │
│  CartContext ←──────┘            │         ChatState        │
│  (localStorage)                  │         (useState)       │
└────────┼────────────────────────┼───────────────┼───────────┘
         │                        │               │
         ▼                        ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│               NEXT.JS SERVER (API Routes)                   │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │  /api/menu   │ │ /api/orders  │ │    /api/chat         │ │
│  │  /api/cuisines│ │ /api/auth   │ │  1. Parse user query │ │
│  │              │ │              │ │  2. Call OpenAI      │ │
│  │  Read-only   │ │ Auth-gated   │ │  3. Extract filters  │ │
│  │  Public      │ │ Write ops    │ │  4. Query Supabase   │ │
│  └──────┬───────┘ └──────┬───────┘ │  5. Return results   │ │
│         │                │         └──────────┬───────────┘ │
│  ┌──────────────────┐    │                    │             │
│  │  /api/admin/*    │    │                    │             │
│  │  Admin-gated     │    │                    │             │
│  └────────┬─────────┘    │                    │             │
└───────────┼──────────────┼────────────────────┼─────────────┘
            │              │                    │
            ▼              ▼                    ▼
     ┌─────────────────────────────────┐  ┌──────────┐
     │         SUPABASE                │  │  OpenAI  │
     │  ┌──────────┐  ┌────────────┐   │  │ GPT-4o-  │
     │  │PostgreSQL│  │  Auth      │   │  │  mini    │
     │  │  + RLS   │  │ (JWT)     │   │  └──────────┘
     │  └──────────┘  └────────────┘   │
     │  ┌──────────┐                   │  ┌──────────┐
     │  │ Storage  │                   │  │  Resend  │
     │  │ (Images) │                   │  │ (Email)  │
     │  └──────────┘                   │  └──────────┘
     └─────────────────────────────────┘
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

### 2.2 AI Chatbot Flow

```
User types: "spicy food under $12"
  │
  ▼
POST /api/chat { message: "spicy food under $12", history: [...] }
  │
  ├─→ OpenAI API (GPT-4o-mini)
  │     System prompt + user message
  │     Returns: { filters: { budget_max: 12, mood: ["spicy"] }, message: "..." }
  │
  ├─→ Supabase Query
  │     SELECT * FROM menu_items
  │     WHERE price <= 12
  │     AND 'spicy' = ANY(mood_tags)
  │     AND is_available = true
  │     ORDER BY price ASC
  │     LIMIT 5
  │
  └─→ Response: { message: "...", recommendations: [...items] }
       → Render RecommendationCards with "Add to Cart" buttons
```

### 2.3 Order Placement Flow

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
  └─→ POST /api/orders { items: [...], delivery_address, promo_code, discount, notes }
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
│   │   ├── Header
│   │   │   ├── Logo
│   │   │   ├── NavLinks (Menu, Cart, Orders, Admin)
│   │   │   ├── CartIcon (item count badge)
│   │   │   └── MobileNav (hamburger menu)
│   │   │
│   │   ├── <Page Content> (varies by route)
│   │   │
│   │   ├── Footer
│   │   │   ├── Brand info
│   │   │   ├── Quick links
│   │   │   └── Social/contact
│   │   │
│   │   └── ChatWidget (floating, global)
│   │       ├── ChatBubble (toggle button)
│   │       ├── ChatWindow
│   │       │   ├── ChatMessage[] (user + bot messages)
│   │       │   ├── RecommendationCard[] (AI results)
│   │       │   ├── QuickPrompts (chip buttons)
│   │       │   └── ChatInput (text + send button)
│   │       └── (closed state: just the bubble icon)
```

---

## 6. State Management

| State | Storage | Scope | Persistence |
|---|---|---|---|
| Cart items | React Context + localStorage | Global | Survives page refresh |
| Auth session | Supabase Auth (cookies) | Global | Survives page refresh |
| Chat messages | React useState | ChatWidget | Lost on page refresh |
| Chat open state | React useState + CustomEvent | ChatWidget (global listener) | Lost on page refresh |
| Promo code | React useState (checkout) | Checkout page | Lost on navigation |
| Menu data | Server Component fetch | Per-page | Re-fetched on navigation |
| Admin data | Server Component fetch | Per-page | Re-fetched on navigation |

---

## 7. API Contract Summary

### Public APIs (No Auth)
```
GET  /api/menu?cuisine=X&vegetarian=true&maxPrice=15&search=chicken
GET  /api/cuisines
POST /api/chat  { message: string, history: ChatMessage[] }
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
