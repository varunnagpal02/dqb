# 🏗️ Desi Quick Bite — Architecture Document

> **Version:** 1.1 | **Date:** March 7, 2026

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                       │
│                                                             │
│  ┌──────────┐ ┌────────┐ ┌──────────┐ ┌───────────┐ ┌───────────┐│
│  │Menu Pages│ │  Cart  │ │ Checkout │ │AI Chatbot │ │Meal Plans ││
│  │(SSR/SSG) │ │(Client)│ │ (Client) │ │ (Client)  │ │ (Client)  ││
│  └────┬─────┘ └───┬────┘ └────┬─────┘ └─────┬─────┘ └─────┬─────┘│
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
│   │       │   ├── RecommendationCard[] (AI results — toggle Add/Remove from cart)
│   │       │   ├── MealPlanCard (weekly meal plan with per-meal Add to Cart)
│   │       │   ├── ScheduleBadge (scheduled order day)
│   │       │   ├── FollowUpChip (AI-suggested follow-up)
│   │       │   ├── QuickPrompts (chip buttons — includes Meal Plan, Schedule)
│   │       │   └── ChatInput (text + send button)
│   │       ├── (closed state: just the bubble icon)
│   │       └── (cart-aware: sends cartSummary with each API request)
```

---

## 6. State Management

| State | Storage | Scope | Persistence |
|---|---|---|---|
| Cart items | React Context + localStorage | Global | Survives page refresh |
| Auth session | Supabase Auth (cookies) | Global | Survives page refresh |
| Chat messages | React useState | ChatWidget | Lost on page refresh |
| Chat session ID | React useState | ChatWidget | Lost on page refresh |
| Chat open state | React useState + CustomEvent | ChatWidget (global listener) | Lost on page refresh |
| LangChain history | Server-side message array (last 10) | Per request | Rebuilt each request from client history |
| Promo code | React useState (checkout) | Checkout page | Lost on navigation |
| Menu data | Server Component fetch | Per-page | Re-fetched on navigation |
| Admin data | Server Component fetch | Per-page | Re-fetched on navigation |

---

## 7. API Contract Summary

### Public APIs (No Auth)
```
GET  /api/menu?cuisine=X&vegetarian=true&maxPrice=15&search=chicken
GET  /api/cuisines
POST /api/chat  { message: string, history: ChatMessage[], sessionId: string, cartSummary?: string }
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
