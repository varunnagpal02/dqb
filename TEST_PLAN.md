# 🧪 Desi Quick Bite — Test Plan & Test Cases

> **Version:** 2.0  
> **Date:** March 14, 2026  
> **Coverage:** UI Components, Pages, API Routes, Context/State, AI Chatbot, Admin, E2E Flows, Phase 2 Features

---

## Table of Contents

1. [Testing Strategy](#1-testing-strategy)
2. [Test Environment Setup](#2-test-environment-setup)
3. [Unit Tests — Utilities & Helpers](#3-unit-tests--utilities--helpers)
4. [Unit Tests — Cart Context](#4-unit-tests--cart-context)
5. [Unit Tests — Auth Context](#5-unit-tests--auth-context)
6. [Component Tests — UI Components](#6-component-tests--ui-components)
7. [Component Tests — Menu Components](#7-component-tests--menu-components)
8. [Component Tests — Cart Components](#8-component-tests--cart-components)
9. [Component Tests — Chat Components](#9-component-tests--chat-components)
10. [Page Tests — Home Page](#10-page-tests--home-page)
11. [Page Tests — Menu Page](#11-page-tests--menu-page)
12. [Page Tests — Cart Page](#12-page-tests--cart-page)
13. [Page Tests — Checkout Page](#13-page-tests--checkout-page)
14. [Page Tests — Auth Page](#14-page-tests--auth-page)
15. [Page Tests — Orders Page](#15-page-tests--orders-page)
16. [Page Tests — Admin Pages](#16-page-tests--admin-pages)
17. [API Tests — /api/menu](#17-api-tests--apimenu)
18. [API Tests — /api/chat](#18-api-tests--apichat)
19. [API Tests — /api/orders](#19-api-tests--apiorders)
20. [API Tests — /api/cuisines](#20-api-tests--apicuisines)
21. [API Tests — /api/admin/menu](#21-api-tests--apiadminmenu)
22. [API Tests — /api/admin/orders](#22-api-tests--apiadminorders)
23. [Integration Tests — AI Chatbot Flow](#23-integration-tests--ai-chatbot-flow)
24. [Integration Tests — Email Service](#24-integration-tests--email-service)
25. [End-to-End Tests](#25-end-to-end-tests)
26. [Non-Functional Tests](#26-non-functional-tests)
27. [Test Verification Matrix](#27-test-verification-matrix)

---

## 1. Testing Strategy

### 1.1 Test Pyramid

| Layer | Tool | Coverage Target |
|---|---|---|
| **Unit Tests** | Jest + React Testing Library | Utilities, Contexts, Pure functions |
| **Component Tests** | Jest + RTL | All UI & feature components |
| **API Tests** | Jest + Supertest / Next.js test utils | All API route handlers |
| **Integration Tests** | Jest + MSW (Mock Service Worker) | AI chatbot, email, auth flows |
| **E2E Tests** | Playwright / Cypress | Critical user journeys |

### 1.2 Test Naming Convention

```
[AREA]-[FEATURE]-[SCENARIO]-[EXPECTED]
TC-CART-001: Add single item to empty cart — cart has 1 item
```

### 1.3 Test Data

- **Seed Menu Data:** `src/data/seed-menu.ts` (45+ items across 6 cuisines)
- **Mock Users:** `test@example.com` (user), `admin@dqb.com` (admin)
- **Mock Cart Items:** Derived from seed menu items

---

## 2. Test Environment Setup

### 2.1 Required Packages

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D ts-jest @types/jest jest-environment-jsdom
npm install -D msw   # For API mocking
```

### 2.2 Jest Configuration

```js
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterSetup: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
```

### 2.3 Environment Variables (Test)

```env
NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-anon-key
SUPABASE_SERVICE_ROLE_KEY=test-service-key
OPENAI_API_KEY=test-openai-key
RESEND_API_KEY=test-resend-key
ADMIN_EMAIL=admin@dqb.com
```

---

## 3. Unit Tests — Utilities & Helpers

**File:** `src/lib/utils.ts`

| ID | Test Case | Input | Expected Output | Status |
|---|---|---|---|---|
| UT-UTIL-001 | `cn()` merges class names | `cn("px-4", "py-2")` | `"px-4 py-2"` | ⬜ |
| UT-UTIL-002 | `cn()` handles conditional classes | `cn("base", false && "hidden")` | `"base"` | ⬜ |
| UT-UTIL-003 | `cn()` resolves Tailwind conflicts | `cn("px-4", "px-6")` | `"px-6"` | ⬜ |
| UT-UTIL-004 | `formatPrice()` formats whole numbers | `formatPrice(12)` | `"$12.00"` | ⬜ |
| UT-UTIL-005 | `formatPrice()` formats decimals | `formatPrice(9.99)` | `"$9.99"` | ⬜ |
| UT-UTIL-006 | `formatPrice()` formats zero | `formatPrice(0)` | `"$0.00"` | ⬜ |
| UT-UTIL-007 | `calculateTax()` computes 8.5% | `calculateTax(100)` | `8.5` | ⬜ |
| UT-UTIL-008 | `calculateTax()` rounds to 2 decimals | `calculateTax(33.33)` | `2.83` | ⬜ |
| UT-UTIL-009 | `slugify()` converts name to slug | `slugify("North Indian")` | `"north-indian"` | ⬜ |
| UT-UTIL-010 | `slugify()` handles special chars | `slugify("Indo-Chinese!")` | `"indo-chinese"` | ⬜ |
| UT-UTIL-011 | `truncate()` truncates long text | `truncate("hello world", 5)` | `"hello..."` | ⬜ |
| UT-UTIL-012 | `truncate()` skips short text | `truncate("hi", 5)` | `"hi"` | ⬜ |
| UT-UTIL-013 | `formatDate()` returns readable date | Valid ISO string | Formatted date string | ⬜ |
| UT-UTIL-014 | `getStatusColor()` returns correct color class | `"placed"` | `"bg-blue-100 text-blue-800"` (unmapped keys like `"pending"` return fallback gray) | ⬜ |
| UT-UTIL-015 | `formatMacro()` formats macros with unit | `formatMacro(25, "g")` | `"25g"` | ⬜ |
| UT-UTIL-016 | `formatMacro()` handles null/undefined | `formatMacro(null, "g")` | `"—"` or fallback | ⬜ |
| UT-UTIL-017 | `getDietaryBadges()` returns veg badge | `{ is_vegetarian: true, is_vegan: false, is_gluten_free: false, is_spicy: false }` | Array containing `"Veg"` | ⬜ |
| UT-UTIL-018 | `getDietaryBadges()` — vegan takes precedence over veg | `{ is_vegetarian: true, is_vegan: true, is_gluten_free: true, is_spicy: false }` | `["Vegan", "GF"]` (else-if: vegan overrides veg) | ⬜ |
| UT-UTIL-019 | `generateId()` returns unique strings | Call twice | Two different strings | ⬜ |

---

## 4. Unit Tests — Cart Context

**File:** `src/context/CartContext.tsx`

### 4.1 Cart Reducer

| ID | Test Case | Action | Expected State | Status |
|---|---|---|---|---|
| UT-CART-001 | Add item to empty cart | `ADD_ITEM` with MenuItem + qty 1 | `items.length === 1` | ⬜ |
| UT-CART-002 | Add same item twice | `ADD_ITEM` same id twice | `items.length === 1, qty === 2` | ⬜ |
| UT-CART-003 | Add different items | `ADD_ITEM` two different items | `items.length === 2` | ⬜ |
| UT-CART-004 | Remove item from cart | `REMOVE_ITEM` by id | Item removed from items | ⬜ |
| UT-CART-005 | Remove non-existent item | `REMOVE_ITEM` invalid id | No change, no error | ⬜ |
| UT-CART-006 | Update quantity to valid number | `UPDATE_QUANTITY` to 5 | `item.quantity === 5` | ⬜ |
| UT-CART-007 | Update quantity to 0 removes item | `UPDATE_QUANTITY` to 0 | Item removed | ⬜ |
| UT-CART-008 | Update quantity to negative removes item | `UPDATE_QUANTITY` to -1 | Item removed | ⬜ |
| UT-CART-009 | Update special instructions | `UPDATE_INSTRUCTIONS` | Instructions set on item | ⬜ |
| UT-CART-010 | Clear cart | `CLEAR_CART` | `items === []` | ⬜ |
| UT-CART-011 | Load cart from saved state | `LOAD_CART` | State matches saved data | ⬜ |

### 4.2 Cart Computed Values

| ID | Test Case | Input State | Expected | Status |
|---|---|---|---|---|
| UT-CART-012 | Subtotal with 1 item, qty 2 | price=10, qty=2 | subtotal=20 | ⬜ |
| UT-CART-013 | Subtotal with multiple items | 2 items, various qty | Sum of (price × qty) | ⬜ |
| UT-CART-014 | Tax calculation (8.5%) | subtotal=100 | tax=8.5 | ⬜ |
| UT-CART-015 | Total = subtotal + tax | subtotal=100 | total=108.5 | ⬜ |
| UT-CART-016 | Total items count | 3 items, qty 1,2,3 | totalItems=6 | ⬜ |
| UT-CART-017 | Empty cart values | No items | subtotal=0, tax=0, total=0, totalItems=0 | ⬜ |
| UT-CART-018 | Floating point behavior | price=9.99, qty=3 | subtotal=29.97 (note: subtotal is NOT explicitly rounded — only `total` is rounded via `toFixed(2)`) | ⬜ |

### 4.3 Cart Persistence

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| UT-CART-019 | Save to localStorage on change | Add item | localStorage `"dqb-cart"` updated | ⬜ |
| UT-CART-020 | Load from localStorage on mount | Saved cart exists | Cart state restored | ⬜ |
| UT-CART-021 | Handle corrupted localStorage | Invalid JSON in storage | Cart initializes empty, no crash | ⬜ |
| UT-CART-022 | Handle missing localStorage | Key doesn't exist | Cart initializes empty | ⬜ |
| UT-CART-023 | Handle localStorage disabled | Private browsing | Save may throw (no try/catch on setItem — only load has error handling) | ⬜ |

---

## 5. Unit Tests — Auth Context

**File:** `src/context/AuthContext.tsx`

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| UT-AUTH-001 | Initial state is loading | Mount AuthProvider | `loading === true, user === null` | ⬜ |
| UT-AUTH-002 | Gets session on mount | Supabase returns session | `user` is set, `loading === false` | ⬜ |
| UT-AUTH-003 | No session on mount | Supabase returns null | `user === null, loading === false` | ⬜ |
| UT-AUTH-004 | signUp calls Supabase with metadata | `signUp("a@b.com", "pw", "Name")` | Calls supabase with `full_name` in metadata | ⬜ |
| UT-AUTH-005 | signUp returns error on failure | Supabase error | Error object returned | ⬜ |
| UT-AUTH-006 | signIn calls Supabase | `signIn("a@b.com", "pw")` | Calls `signInWithPassword` | ⬜ |
| UT-AUTH-007 | signIn returns error on failure | Wrong password | Error object returned | ⬜ |
| UT-AUTH-008 | signOut clears user | After sign out | `user === null` | ⬜ |
| UT-AUTH-009 | Auth state listener updates user | Session change event | `user` updated | ⬜ |
| UT-AUTH-010 | useAuth outside provider throws | No AuthProvider | Throws error | ⬜ |

---

## 6. Component Tests — UI Components

### 6.1 Button (`src/components/ui/Button.tsx`)

| ID | Test Case | Props | Expected | Status |
|---|---|---|---|---|
| CT-BTN-001 | Renders with children | `children="Click"` | Text "Click" visible | ⬜ |
| CT-BTN-002 | Primary variant styling | `variant="primary"` | Has `bg-orange-600` class | ⬜ |
| CT-BTN-003 | Secondary variant styling | `variant="secondary"` | Has `bg-gray-600` class | ⬜ |
| CT-BTN-004 | Outline variant styling | `variant="outline"` | Has `border` class | ⬜ |
| CT-BTN-005 | Loading state shows spinner | `loading={true}` | Spinner SVG rendered, children hidden | ⬜ |
| CT-BTN-006 | Loading state disables button | `loading={true}` | `disabled` attribute present | ⬜ |
| CT-BTN-007 | Disabled state | `disabled={true}` | `disabled` attribute, opacity class | ⬜ |
| CT-BTN-008 | Size variants | `size="sm"/"md"/"lg"` | Correct padding classes | ⬜ |
| CT-BTN-009 | Click handler fires | `onClick` prop | Handler called on click | ⬜ |
| CT-BTN-010 | Custom className merged | `className="custom"` | Custom class applied | ⬜ |

### 6.2 Card (`src/components/ui/Card.tsx`)

| ID | Test Case | Props | Expected | Status |
|---|---|---|---|---|
| CT-CARD-001 | Card renders children | `children=<div>` | Children visible | ⬜ |
| CT-CARD-002 | CardHeader renders | — | Header section visible | ⬜ |
| CT-CARD-003 | CardContent renders | — | Content section visible | ⬜ |
| CT-CARD-004 | CardFooter renders | — | Footer section visible | ⬜ |
| CT-CARD-005 | Custom className applied | `className="custom"` | Custom class merged | ⬜ |

### 6.3 Input (`src/components/ui/Input.tsx`)

| ID | Test Case | Props | Expected | Status |
|---|---|---|---|---|
| CT-INP-001 | Input renders with placeholder | `placeholder="Search"` | Placeholder visible | ⬜ |
| CT-INP-002 | Input onChange fires | Type text | onChange handler called | ⬜ |
| CT-INP-003 | Input error state | `error="Required"` | Error message displayed, red border | ⬜ |
| CT-INP-004 | Input label renders | `label="Name"` | Label text visible | ⬜ |
| CT-INP-005 | Textarea renders | Textarea component | Textarea element present | ⬜ |

### 6.4 Badge (`src/components/ui/Badge.tsx`)

| ID | Test Case | Props | Expected | Status |
|---|---|---|---|---|
| CT-BDG-001 | Default variant | `variant="default"` | Gray styling | ⬜ |
| CT-BDG-002 | Success variant | `variant="success"` | Green styling | ⬜ |
| CT-BDG-003 | Warning variant | `variant="warning"` | Yellow styling | ⬜ |
| CT-BDG-004 | Danger variant | `variant="danger"` | Red styling | ⬜ |
| CT-BDG-005 | Info variant | `variant="info"` | Blue styling | ⬜ |

### 6.5 Modal (`src/components/ui/Modal.tsx`)

| ID | Test Case | Props | Expected | Status |
|---|---|---|---|---|
| CT-MOD-001 | Modal renders when open | `isOpen={true}` | Modal content visible | ⬜ |
| CT-MOD-002 | Modal hidden when closed | `isOpen={false}` | Nothing rendered | ⬜ |
| CT-MOD-003 | Close on backdrop click | Click outside modal | `onClose` called | ⬜ |
| CT-MOD-004 | Close on Escape key | Press Escape | `onClose` called | ⬜ |
| CT-MOD-005 | Title rendered | `title="Edit"` | "Edit" visible in header | ⬜ |
| CT-MOD-006 | Size variants | `size="sm"/"md"/"lg"` | Correct width classes | ⬜ |

---

## 7. Component Tests — Menu Components

### 7.1 MenuItemCard (`src/components/menu/MenuItem.tsx`)

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| CT-MI-001 | Renders item name and price | Pass MenuItem | Name and formatted price visible | ⬜ |
| CT-MI-002 | Shows veg icon for vegetarian | `is_vegetarian: true` | Green dot/icon shown | ⬜ |
| CT-MI-003 | Shows non-veg icon | `is_vegetarian: false` | Red dot/icon shown | ⬜ |
| CT-MI-004 | Shows spicy indicator | `is_spicy: true` | Flame icon visible | ⬜ |
| CT-MI-005 | Displays macros (cal, protein, carbs, fat) | With macro values | Macro chips visible | ⬜ |
| CT-MI-006 | Add to cart button works | Click "Add" | `addItem` called with item | ⬜ |
| CT-MI-007 | Shows quantity controls when in cart | Item already in cart | +/- buttons visible | ⬜ |
| CT-MI-008 | Increment quantity | Click "+" | `updateQuantity` called with qty+1 | ⬜ |
| CT-MI-009 | Decrement quantity | Click "-" | `updateQuantity` called with qty-1 | ⬜ |
| CT-MI-010 | Handles null calories/macros | `calories: null` | No crash, displays gracefully | ⬜ |

### 7.2 CuisineFilter (`src/components/menu/CuisineFilter.tsx`)

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| CT-CF-001 | Renders "All Cuisines" button | — | "All Cuisines" pill visible | ⬜ |
| CT-CF-002 | Renders all cuisine pills | 6 cuisines | 7 buttons total (including "All") | ⬜ |
| CT-CF-003 | "All Cuisines" highlighted when none selected | `selected=[]` | Orange styling on "All" | ⬜ |
| CT-CF-004 | Selected cuisine highlighted | `selected=["North Indian"]` | That cuisine orange, "All" gray | ⬜ |
| CT-CF-005 | Toggle cuisine calls onToggle | Click cuisine | `onToggle("North Indian")` called | ⬜ |
| CT-CF-006 | Clear all deselects | Click "All Cuisines" | All previously selected toggled off | ⬜ |

### 7.3 DietaryFilter (`src/components/menu/DietaryFilter.tsx`)

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| CT-DF-001 | Renders all dietary options | — | 4 pills: Vegetarian, Vegan, Gluten-Free, Spicy | ⬜ |
| CT-DF-002 | Active filter highlighted | `filters.vegetarian: true` | Vegetarian pill has active class | ⬜ |
| CT-DF-003 | Toggle calls onToggle with key | Click Vegan | `onToggle("vegan")` called | ⬜ |
| CT-DF-004 | Inactive filter has default styling | All false | All pills gray | ⬜ |

### 7.4 MenuGrid (`src/components/menu/MenuGrid.tsx`)

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| CT-MG-001 | Renders grid of items | 4 items | 4 MenuItemCard rendered | ⬜ |
| CT-MG-002 | Empty state | 0 items | Empty message or no cards | ⬜ |
| CT-MG-003 | Responsive grid | Resize viewport | 1→2→3 columns | ⬜ |

---

## 8. Component Tests — Cart Components

### 8.1 CartItemCard (`src/components/cart/CartItem.tsx`)

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| CT-CI-001 | Renders item name | CartItem with menu_item | Name visible | ⬜ |
| CT-CI-002 | Renders quantity and price | qty=2, price=10 | "2" and "$20.00" visible | ⬜ |
| CT-CI-003 | Increment button works | Click "+" | `updateQuantity(id, qty+1)` called | ⬜ |
| CT-CI-004 | Decrement button works | Click "-" | `updateQuantity(id, qty-1)` called | ⬜ |
| CT-CI-005 | Remove button works | Click remove | `removeItem(id)` called | ⬜ |
| CT-CI-006 | Shows dietary badges | `is_vegetarian: true` | Veg badge visible | ⬜ |

### 8.2 CartSummary (`src/components/cart/CartSummary.tsx`)

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| CT-CS-001 | Displays subtotal | Cart with items | Subtotal shown | ⬜ |
| CT-CS-002 | Displays tax | — | Tax amount shown | ⬜ |
| CT-CS-003 | Displays total | — | Total (subtotal + tax) shown | ⬜ |
| CT-CS-004 | Checkout button links to /checkout | — | Link to checkout page | ⬜ |
| CT-CS-005 | Empty cart summary | No items | $0.00 values | ⬜ |

---

## 9. Component Tests — Chat Components

### 9.1 ChatWidget (`src/components/chatbot/ChatWidget.tsx`)

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| CT-CW-001 | Renders floating button | Initial state | Chat bubble visible bottom-right | ⬜ |
| CT-CW-002 | Opens on click | Click bubble | Chat window opens | ⬜ |
| CT-CW-003 | Closes on X click | Click close | Chat window closes | ⬜ |
| CT-CW-004 | Shows welcome message | First open | Welcome message visible | ⬜ |
| CT-CW-005 | Quick prompts visible initially | ≤1 message | Quick prompt chips visible | ⬜ |
| CT-CW-006 | Quick prompts hidden after messages | >1 message | Quick prompts not visible | ⬜ |
| CT-CW-007 | Sends message on submit | Type + Enter/Send | Message added to chat | ⬜ |
| CT-CW-008 | Empty message prevented | Submit empty | No message sent | ⬜ |
| CT-CW-009 | Loading state during API call | After send | Loader shown, input disabled | ⬜ |
| CT-CW-010 | Displays AI response | After API response | Assistant message visible | ⬜ |
| CT-CW-011 | Displays recommendations | API returns recommendations | RecommendationCards visible | ⬜ |
| CT-CW-012 | Error handling | API failure | Error message shown | ⬜ |
| CT-CW-013 | Auto-scroll on new message | Send message | Chat scrolls to bottom | ⬜ |

### 9.2 ChatMessage (`src/components/chatbot/ChatMessage.tsx`)

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| CT-CM-001 | User message styled differently | `role="user"` | Right-aligned, orange bg | ⬜ |
| CT-CM-002 | Assistant message styled differently | `role="assistant"` | Left-aligned, gray bg | ⬜ |

### 9.3 QuickPrompts (`src/components/chatbot/QuickPrompts.tsx`)

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| CT-QP-001 | Renders prompt chips | — | Multiple prompt buttons visible | ⬜ |
| CT-QP-002 | Click fires onSelect | Click prompt | `onSelect(promptText)` called | ⬜ |

### 9.4 RecommendationCard (`src/components/chatbot/RecommendationCard.tsx`)

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| CT-RC-001 | Renders item name and price | Recommendation item | Name and price visible | ⬜ |
| CT-RC-002 | Shows dietary info | veg/vegan flags | Badges visible | ⬜ |
| CT-RC-003 | Shows macros | Calories, protein | Macro info displayed | ⬜ |

---

## 10. Page Tests — Home Page

**File:** `src/app/page.tsx`

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| PT-HOME-001 | Hero section renders | Load page | "Desi Quick Bite" heading visible | ⬜ |
| PT-HOME-002 | CTA buttons link correctly | — | "Browse Menu" → `/menu`, "Ask AI Bot" → `/menu` | ⬜ |
| PT-HOME-003 | Cuisine showcase displays 6 cuisines | — | 6 cuisine cards visible | ⬜ |
| PT-HOME-004 | Cuisine cards link to menu with filter | Click "North Indian" | Navigates to `/menu?cuisine=north-indian` | ⬜ |
| PT-HOME-005 | Featured items display 4 items | — | 4 menu item cards visible | ⬜ |
| PT-HOME-006 | Featured items show name/price/calories | — | All fields rendered | ⬜ |
| PT-HOME-007 | AI feature highlight shows 3 cards | — | Mood, AI, Recommendations cards | ⬜ |
| PT-HOME-008 | Macro-aware banner renders | — | Calories, protein, carbs, fat icons | ⬜ |

---

## 11. Page Tests — Menu Page

**File:** `src/app/menu/page.tsx`

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| PT-MENU-001 | Page loads with all items | No filters | Shows all 45+ items | ⬜ |
| PT-MENU-002 | Search by dish name | Search "biryani" | Only biryani items shown | ⬜ |
| PT-MENU-003 | Search by keyword | Search "paneer" | Items with paneer keyword | ⬜ |
| PT-MENU-004 | Search case-insensitive | Search "SAMOSA" | Samosa items found | ⬜ |
| PT-MENU-005 | Search with no results | Search "pizza" | "Showing 0 of X items" | ⬜ |
| PT-MENU-006 | Cuisine filter — single | Select "North Indian" | Only North Indian items | ⬜ |
| PT-MENU-007 | Cuisine filter — multi | Select "North Indian" + "South Indian" | Items from both cuisines | ⬜ |
| PT-MENU-008 | Cuisine filter — deselect | Deselect cuisine | All cuisines shown again | ⬜ |
| PT-MENU-009 | Dietary — vegetarian | Toggle vegetarian | Only `is_vegetarian: true` items | ⬜ |
| PT-MENU-010 | Dietary — vegan | Toggle vegan | Only `is_vegan: true` items | ⬜ |
| PT-MENU-011 | Dietary — gluten free | Toggle gluten-free | Only `is_gluten_free: true` items | ⬜ |
| PT-MENU-012 | Dietary — spicy | Toggle spicy | Only `spice_level >= 3` items | ⬜ |
| PT-MENU-013 | Combined filters | Vegetarian + North Indian | Intersection of both filters | ⬜ |
| PT-MENU-014 | Sort by price ascending | Select "Price: Low → High" | Items sorted by price asc | ⬜ |
| PT-MENU-015 | Sort by price descending | Select "Price: High → Low" | Items sorted by price desc | ⬜ |
| PT-MENU-016 | Sort by calories | Select "Calories: Low → High" | Items sorted by calories asc | ⬜ |
| PT-MENU-017 | Result count updates | Apply filters | Count reflects filtered items | ⬜ |
| PT-MENU-018 | Clear search restores all | Clear search input | All items shown again | ⬜ |

---

## 12. Page Tests — Cart Page

**File:** `src/app/cart/page.tsx`

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| PT-CART-001 | Empty cart shows empty state | No items in cart | "Your cart is empty" + link to menu | ⬜ |
| PT-CART-002 | Cart with items shows list | Items in cart | CartItemCards rendered | ⬜ |
| PT-CART-003 | CartSummary shows on right | Items in cart | Summary sidebar visible | ⬜ |
| PT-CART-004 | Item count in header updates | Add/remove items | Header cart badge updates | ⬜ |

---

## 13. Page Tests — Checkout Page

**File:** `src/app/checkout/page.tsx`

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| PT-CHK-001 | Redirects to /cart if empty | Empty cart | Redirected to `/cart` | ⬜ |
| PT-CHK-002 | Form renders all fields | Cart has items | Name, email, phone, address visible | ⬜ |
| PT-CHK-003 | Pre-fills email for auth user | User logged in | Email field pre-filled | ⬜ |
| PT-CHK-004 | Validation — required fields | Submit empty form | Error messages shown | ⬜ |
| PT-CHK-005 | Order summary shows items | Cart items | Items, subtotal, tax, total visible | ⬜ |
| PT-CHK-006 | Tax calculated at 8.5% | subtotal = $100 | Tax = $8.50, total = $108.50 | ⬜ |
| PT-CHK-007 | Email signup checkbox | Check/uncheck | Checkbox toggles | ⬜ |
| PT-CHK-008 | Submit creates order | Fill form + submit | POST to `/api/orders` called | ⬜ |
| PT-CHK-009 | Submit clears cart | Successful order | Cart emptied | ⬜ |
| PT-CHK-010 | Submit redirects to confirmation | Successful order | Navigate to `/order-confirmation/[id]` | ⬜ |
| PT-CHK-011 | Submit shows loading state | During API call | Button shows "Processing..." | ⬜ |
| PT-CHK-012 | API error displays message | API returns error | Error alert shown | ⬜ |
| PT-CHK-013 | Prevent double submit | Click twice fast | Only one API call | ⬜ |

---

## 14. Page Tests — Auth Page

**File:** `src/app/auth/signin/page.tsx`

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| PT-AUTH-001 | Sign In form renders | Load page | Email, password fields visible | ⬜ |
| PT-AUTH-002 | Sign Up form renders | Click "Sign up" toggle | Name, email, password fields | ⬜ |
| PT-AUTH-003 | Toggle between modes | Click toggle link | Form switches, errors cleared | ⬜ |
| PT-AUTH-004 | Sign In calls signIn | Submit sign-in form | `signIn(email, password)` called | ⬜ |
| PT-AUTH-005 | Sign Up calls signUp | Submit sign-up form | `signUp(email, password, name)` called | ⬜ |
| PT-AUTH-006 | Sign In success redirects | Auth succeeds | Navigate to `/` | ⬜ |
| PT-AUTH-007 | Sign Up success shows message | Auth succeeds | "Check your email" message | ⬜ |
| PT-AUTH-008 | Sign In error displays | Wrong password | Error message visible | ⬜ |
| PT-AUTH-009 | Sign Up error displays | Email taken | Error message visible | ⬜ |
| PT-AUTH-010 | Guest link available | — | "Browse as guest" link to `/menu` | ⬜ |
| PT-AUTH-011 | HTML required validation | Submit empty | Browser validation fires | ⬜ |

---

## 15. Page Tests — Orders Page

**File:** `src/app/orders/page.tsx`

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| PT-ORD-001 | Unauthenticated shows sign-in prompt | No user session | "Sign in" message visible | ⬜ |
| PT-ORD-002 | Loading state | Fetching orders | Spinner visible | ⬜ |
| PT-ORD-003 | Orders list displays | User has orders | Order cards rendered | ⬜ |
| PT-ORD-004 | Order shows status badge | Order with status | Color-coded badge visible | ⬜ |
| PT-ORD-005 | Order shows items | Order with items | Item names and quantities | ⬜ |
| PT-ORD-006 | Empty orders state | User has 0 orders | "No orders yet" message | ⬜ |
| PT-ORD-007 | Error state | API failure | Error message visible | ⬜ |

---

## 16. Page Tests — Admin Pages

### 16.1 Admin Dashboard (`src/app/admin/page.tsx`)

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| PT-ADM-001 | Dashboard renders cards | Load page | Menu, Orders, Chatbot cards visible | ⬜ |
| PT-ADM-002 | Cards link to sub-pages | — | Links to `/admin/menu`, `/admin/orders` | ⬜ |

### 16.2 Admin Menu (`src/app/admin/menu/page.tsx`)

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| PT-AMN-001 | Menu table renders items | Load page | All seed items in table | ⬜ |
| PT-AMN-002 | Search filters table | Search "butter" | Only matching items shown | ⬜ |
| PT-AMN-003 | Add button opens modal | Click "Add New Item" | Modal with empty form opens | ⬜ |
| PT-AMN-004 | Edit button opens modal | Click "Edit" on item | Modal pre-filled with item data | ⬜ |
| PT-AMN-005 | Delete shows confirm dialog | Click "Delete" | Confirm dialog appears | ⬜ |
| PT-AMN-006 | Table shows dietary badges | Item with flags | Veg/Vegan/GF badges visible | ⬜ |
| PT-AMN-007 | Table shows spice level | `spice_level: 3` | "🌶️3" visible | ⬜ |
| PT-AMN-008 | Table shows cuisine name | Item with category | Cuisine lookup result visible | ⬜ |

### 16.3 Admin Orders (`src/app/admin/orders/page.tsx`)

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| PT-AOR-001 | Status tabs render | Load page | All status filter tabs visible | ⬜ |
| PT-AOR-002 | Filter by status | Click "Pending" | Only pending orders shown | ⬜ |
| PT-AOR-003 | Update status | Change status dropdown | PUT to API, status updated locally | ⬜ |
| PT-AOR-004 | Error state with retry | API failure | Error message + retry button | ⬜ |
| PT-AOR-005 | Loading state | During fetch | Spinner visible | ⬜ |

---

## 17. API Tests — /api/menu

**File:** `src/app/api/menu/route.ts`

| ID | Test Case | Request | Expected Response | Status |
|---|---|---|---|---|
| AT-MENU-001 | GET all menu items | `GET /api/menu` | 200, array of items | ⬜ |
| AT-MENU-002 | Filter by cuisine | `GET /api/menu?cuisine=north-indian` | Items for that cuisine only | ⬜ |
| AT-MENU-003 | Filter by category | `GET /api/menu?category=curries` | Items for that category | ⬜ |
| AT-MENU-004 | Filter vegetarian | `GET /api/menu?vegetarian=true` | Only veg items | ⬜ |
| AT-MENU-005 | Filter vegan | `GET /api/menu?vegan=true` | Only vegan items | ⬜ |
| AT-MENU-006 | Filter gluten free | `GET /api/menu?glutenFree=true` | Only GF items | ⬜ |
| AT-MENU-007 | Filter by max price | `GET /api/menu?maxPrice=10` | Items ≤ $10 | ⬜ |
| AT-MENU-008 | Filter by max calories | `GET /api/menu?maxCalories=300` | Items ≤ 300 cal | ⬜ |
| AT-MENU-009 | Search by name | `GET /api/menu?search=biryani` | Matching items | ⬜ |
| AT-MENU-010 | Combined filters | Multiple params | Intersection of all filters | ⬜ |
| AT-MENU-011 | No matching items | Invalid filter combo | 200, empty array | ⬜ |
| AT-MENU-012 | Only available items returned | Mix of available/unavailable | Only `is_available: true` | ⬜ |
| AT-MENU-013 | Sorted by sort_order | — | Items in sort_order ascending | ⬜ |
| AT-MENU-014 | DB error returns 500 | Supabase error | 500, error message | ⬜ |

---

## 18. API Tests — /api/chat

**File:** `src/app/api/chat/route.ts`

| ID | Test Case | Request | Expected Response | Status |
|---|---|---|---|---|
| AT-CHAT-001 | Valid message returns response | `{ message: "hi" }` | 200, reply + recommendations | ⬜ |
| AT-CHAT-002 | Empty message rejected | `{ message: "" }` | 400, error message | ⬜ |
| AT-CHAT-003 | Missing message field | `{}` | 400, error message | ⬜ |
| AT-CHAT-004 | Greeting intent | `{ message: "hello" }` | Friendly greeting reply | ⬜ |
| AT-CHAT-005 | Recommendation with budget | `{ message: "under $10" }` | Filtered items ≤ $10 | ⬜ |
| AT-CHAT-006 | Recommendation with cuisine | `{ message: "south indian" }` | South Indian items only | ⬜ |
| AT-CHAT-007 | Recommendation with dietary | `{ message: "vegan options" }` | Only vegan items | ⬜ |
| AT-CHAT-008 | Recommendation with mood | `{ message: "comfort food" }` | Items with "comfort" mood tag | ⬜ |
| AT-CHAT-009 | Recommendation with macros | `{ message: "high protein" }` | Items sorted/filtered by protein | ⬜ |
| AT-CHAT-010 | Max 5 recommendations | Many matches | At most 5 items returned | ⬜ |
| AT-CHAT-011 | Chat history passed | Message + history array | Context-aware response | ⬜ |
| AT-CHAT-012 | OpenAI failure graceful | OpenAI error | 200, friendly error message | ⬜ |
| AT-CHAT-013 | No matching items | Very specific filters | Empty recommendations array | ⬜ |
| AT-CHAT-014 | Spice filter — mild | "mild food" | Items spice_level ≤ 1 | ⬜ |
| AT-CHAT-015 | Spice filter — hot | "very spicy" | Items spice_level ≥ 4 | ⬜ |

---

## 19. API Tests — /api/orders

**File:** `src/app/api/orders/route.ts`

### 19.1 POST — Create Order

| ID | Test Case | Request Body | Expected | Status |
|---|---|---|---|---|
| AT-ORD-001 | Create order with all fields | Full valid body | 201, order object | ⬜ |
| AT-ORD-002 | Missing customer name | No `customer_name` | 400, validation error | ⬜ |
| AT-ORD-003 | Missing email | No `customer_email` | 400, validation error | ⬜ |
| AT-ORD-004 | Missing address | No `delivery_address` | 400, validation error | ⬜ |
| AT-ORD-005 | Missing phone | No `customer_phone` | 400, validation error | ⬜ |
| AT-ORD-006 | Empty items array | `items: []` | 400, validation error | ⬜ |
| AT-ORD-007 | Guest order (no auth) | No session | 201, `user_id: null` | ⬜ |
| AT-ORD-008 | Authenticated order | With session | 201, `user_id` set | ⬜ |
| AT-ORD-009 | Order status is "pending" | — | status = "pending" | ⬜ |
| AT-ORD-010 | Email sent on success | Valid email | `sendOrderConfirmationEmail` called | ⬜ |
| AT-ORD-011 | Email failure doesn't block | Email service error | Order still created (201) | ⬜ |
| AT-ORD-012 | Email signup flag stored | `email_signup: true` | Logged to console (future feature) | ⬜ |
| AT-ORD-013 | DB error returns 500 | Supabase insert fails | 500, error message | ⬜ |

### 19.2 GET — User Orders

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| AT-ORD-014 | Authenticated user gets orders | Valid session | 200, array of orders | ⬜ |
| AT-ORD-015 | Unauthenticated returns 401 | No session | 401, error | ⬜ |
| AT-ORD-016 | Orders sorted by date desc | Multiple orders | Most recent first | ⬜ |
| AT-ORD-017 | Orders include items | — | Each order has `order_items` | ⬜ |
| AT-ORD-018 | User sees only own orders | — | Filtered by user_id | ⬜ |

---

## 20. API Tests — /api/cuisines

**File:** `src/app/api/cuisines/route.ts`

| ID | Test Case | Request | Expected | Status |
|---|---|---|---|---|
| AT-CUI-001 | GET all cuisines | `GET /api/cuisines` | 200, array of cuisines | ⬜ |
| AT-CUI-002 | Sorted by sort_order | — | Cuisines in sort_order asc | ⬜ |
| AT-CUI-003 | DB error returns 500 | Supabase error | 500, error message | ⬜ |

---

## 21. API Tests — /api/admin/menu

**File:** `src/app/api/admin/menu/route.ts`

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| AT-ADMN-001 | Admin GET all items | Admin authenticated | 200, all items | ⬜ |
| AT-ADMN-002 | Non-admin GET rejected | Regular user | 403, forbidden | ⬜ |
| AT-ADMN-003 | Unauthenticated GET rejected | No session | 401, unauthorized | ⬜ |
| AT-ADMN-004 | Admin POST creates item | Admin + valid body | 201, new item | ⬜ |
| AT-ADMN-005 | Admin PUT updates item | Admin + body with id | 200, updated item | ⬜ |
| AT-ADMN-006 | Admin PUT without id | Missing id in body | 400, error | ⬜ |
| AT-ADMN-007 | Admin DELETE removes item | Admin + ?id=xxx | 200, `{ success: true }` message | ⬜ |
| AT-ADMN-008 | Admin DELETE without id | No id param | 400, error | ⬜ |
| AT-ADMN-009 | POST with missing fields | Incomplete body | Supabase constraint error | ⬜ |

---

## 22. API Tests — /api/admin/orders

**File:** `src/app/api/admin/orders/route.ts`

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| AT-ADMO-001 | Admin GET all orders | Admin auth | 200, paginated orders | ⬜ |
| AT-ADMO-002 | GET with status filter | `?status=pending` | Only pending orders | ⬜ |
| AT-ADMO-003 | GET with pagination | `?page=2&limit=10` | Page 2, 10 items max | ⬜ |
| AT-ADMO-004 | Admin PUT updates status | `{ id, status: "confirmed" }` | 200, updated order | ⬜ |
| AT-ADMO-005 | PUT invalid status | `{ status: "invalid" }` | 400, list of valid statuses | ⬜ |
| AT-ADMO-006 | PUT missing id | No id | 400, error | ⬜ |
| AT-ADMO-007 | PUT missing status | No status | 400, error | ⬜ |
| AT-ADMO-008 | Non-admin rejected | Regular user | 403, forbidden | ⬜ |
| AT-ADMO-009 | Unauthenticated rejected | No session | 401, unauthorized | ⬜ |
| AT-ADMO-010 | Default pagination values | No page/limit | page=1, limit=20 | ⬜ |

---

## 23. Integration Tests — AI Chatbot Flow

| ID | Test Case | Flow | Expected | Status |
|---|---|---|---|---|
| IT-CHAT-001 | Full conversation flow | Open chat → type message → receive response | Message sent, response displayed with recommendations | ⬜ |
| IT-CHAT-002 | Multi-turn conversation | Send 3 messages | Context maintained, history sent to API | ⬜ |
| IT-CHAT-003 | Quick prompt flow | Open chat → click quick prompt → response | Prompt text sent as message | ⬜ |
| IT-CHAT-004 | Budget filtering | "Show me items under $8" | Only items ≤ $8 in recommendations | ⬜ |
| IT-CHAT-005 | Cuisine + dietary combo | "Vegan south Indian" | Vegan items from south Indian cuisine | ⬜ |
| IT-CHAT-006 | Macro-based query | "High protein low carb" | Items filtered by protein/carbs | ⬜ |
| IT-CHAT-007 | Mood-based query | "I want comfort food" | Items with "comfort" mood tag | ⬜ |
| IT-CHAT-008 | Error recovery | API fails → user sends another | New message works normally | ⬜ |

---

## 24. Phase 2 — Serviceability Tests (Automated ✅)

> **File:** `src/__tests__/phase2.test.ts` — 68 tests, all passing

| ID | Test Case | Input | Expected | Status |
|---|---|---|---|---|
| P2-SVC-001 | Serviceable ZIP | 10001 | isServiceable = true | ✅ |
| P2-SVC-002 | Serviceable city | Manhattan | isServiceable = true | ✅ |
| P2-SVC-003 | Case-insensitive city | "BROOKLYN" | isServiceable = true | ✅ |
| P2-SVC-004 | Not serviceable | ZIP 99999, city "Timbuktu" | isServiceable = false | ✅ |
| P2-SVC-005 | Empty strings | "", "" | isServiceable = false | ✅ |
| P2-SVC-006 | Whitespace-padded ZIP | "  10001  " | isServiceable = true | ✅ |
| P2-SVC-007 | Jersey City ZIP | 07302 | isServiceable = true | ✅ |
| P2-SVC-008 | City match with bad ZIP | ZIP 11111, city "jersey city" | isServiceable = true | ✅ |

## 25. Phase 2 — Seed Data Tests (Automated ✅)

| ID | Test Case | Input | Expected | Status |
|---|---|---|---|---|
| P2-SD-001 | Recommended items exist | menuItems filter | >0 recommended | ✅ |
| P2-SD-002 | At least 8 recommended | menuItems filter | ≥8 items | ✅ |
| P2-SD-003 | Butter Chicken recommended | name match | is_recommended = true | ✅ |
| P2-SD-004 | Masala Dosa recommended | name match | is_recommended = true | ✅ |
| P2-SD-005 | Chicken Biryani recommended | name match | is_recommended = true | ✅ |
| P2-SD-006 | Paneer Tikka recommended | name match | is_recommended = true | ✅ |
| P2-SD-007 | Not all items recommended | count | < total items | ✅ |
| P2-SD-008 | Breakfast tag exists | mood_tags filter | >0 items | ✅ |
| P2-SD-009 | Lunch tag exists | mood_tags filter | >0 items | ✅ |
| P2-SD-010 | Dinner tag exists | mood_tags filter | >0 items | ✅ |
| P2-SD-011 | Deal tag exists | mood_tags filter | >0 items | ✅ |
| P2-SD-012 | Idli has breakfast tag | mood_tags | contains "breakfast" | ✅ |
| P2-SD-013 | Butter Chicken has dinner | mood_tags | contains "dinner" | ✅ |

## 26. Phase 2 — Quick Nav & Filter Tests (Automated ✅)

| ID | Test Case | Input | Expected | Status |
|---|---|---|---|---|
| P2-NAV-001 | Appetizers filter | ni-starters, ic-starters, sf-chaat | >0 results | ✅ |
| P2-NAV-002 | Mains filter | ni-main-course, si-mains, ic-noodles-rice | >0 results | ✅ |
| P2-NAV-003 | Breads filter | ni-breads | >0 results | ✅ |
| P2-NAV-004 | Drinks filter | b-hot, b-cold | >0 results | ✅ |
| P2-NAV-005 | North Indian cuisine | cuisine slug filter | >10 items | ✅ |
| P2-NAV-006 | South Indian cuisine | cuisine slug filter | >0 items | ✅ |
| P2-NAV-007 | Breakfast mood filter | mood_tags includes "breakfast" | >3 items | ✅ |
| P2-NAV-008 | Dinner mood filter | mood_tags includes "dinner" | >3 items | ✅ |

## 27. Phase 2 — Enhanced Sort & Advanced Filter Tests (Automated ✅)

| ID | Test Case | Input | Expected | Status |
|---|---|---|---|---|
| P2-SORT-001 | Sort price ascending | sort | each ≥ prev | ✅ |
| P2-SORT-002 | Sort price descending | sort | each ≤ prev | ✅ |
| P2-SORT-003 | Sort calories ascending | sort | each ≥ prev | ✅ |
| P2-SORT-004 | Sort protein descending | sort | each ≤ prev | ✅ |
| P2-SORT-005 | Recommended first | default sort | recommended before others | ✅ |
| P2-FILT-001 | Max price $10 | filter | all ≤ $10 | ✅ |
| P2-FILT-002 | Max calories 300 | filter | all ≤ 300 | ✅ |
| P2-FILT-003 | Spice level mild | filter ≤ 1 | all ≤ 1 | ✅ |
| P2-FILT-004 | Veg + price combo | filter | all veg AND ≤ $8 | ✅ |
| P2-FILT-005 | Vegan + calorie combo | filter | all vegan AND ≤ 300 | ✅ |

## 28. Phase 2 — Smart Search & Validation Tests (Automated ✅)

| ID | Test Case | Input | Expected | Status |
|---|---|---|---|---|
| P2-SRCH-001 | Detect price query | "under $10" | isSmartQuery = true | ✅ |
| P2-SRCH-002 | Detect macro query | "high protein" | isSmartQuery = true | ✅ |
| P2-SRCH-003 | Detect mood query | "comfort food" | isSmartQuery = true | ✅ |
| P2-SRCH-004 | Plain dish name | "butter chicken" | isSmartQuery = false | ✅ |
| P2-GATE-001 | Block unserviceable | hasEntered + !serviceable | shouldBlock = true | ✅ |
| P2-GATE-002 | Allow serviceable | hasEntered + serviceable | shouldBlock = false | ✅ |
| P2-GATE-003 | Allow no address | !hasEntered | shouldBlock = false | ✅ |
| P2-FORM-001 | Valid "now" form | address + city + zip | canProceed = true | ✅ |
| P2-FORM-002 | Missing address | empty + city + zip | canProceed = false | ✅ |
| P2-FORM-003 | Valid "scheduled" form | all fields + date + time | canProceed = true | ✅ |
| P2-FORM-004 | Missing date | scheduled, no date | canProceed = false | ✅ |

## 29. Phase 2 — Data Integrity Tests (Automated ✅)

| ID | Test Case | Input | Expected | Status |
|---|---|---|---|---|
| P2-DATA-001 | 6 cuisines | cuisines array | length = 6 | ✅ |
| P2-DATA-002 | All slugs mapped | slugs | all 6 present | ✅ |
| P2-DATA-003 | Valid category slugs | all items | match categories | ✅ |
| P2-DATA-004 | All have mood_tags | all items | non-empty array | ✅ |
| P2-DATA-005 | All have keywords | all items | non-empty array | ✅ |
| P2-DATA-006 | Positive prices | all items | > 0 | ✅ |
| P2-DATA-007 | Non-negative calories | all items | ≥ 0 | ✅ |
| P2-DATA-008 | Spice level 0-5 | all items | 0 ≤ x ≤ 5 | ✅ |
| P2-DATA-009 | 49 menu items | menuItems | length = 49 | ✅ |
| P2-DATA-010 | 13 categories | categories | length = 13 | ✅ |

---

## 24. Integration Tests — Email Service

| ID | Test Case | Scenario | Expected | Status |
|---|---|---|---|---|
| IT-EMAIL-001 | Order confirmation email sent | Create order with valid email | Resend API called with correct data | ⬜ |
| IT-EMAIL-002 | Email contains order details | Order with items | HTML has item names, prices, totals | ⬜ |
| IT-EMAIL-003 | Email has delivery address | Order with address | Address in email body | ⬜ |
| IT-EMAIL-004 | Email failure non-blocking | Resend API fails | Order still created successfully | ⬜ |
| IT-EMAIL-005 | Correct sender address | With/without EMAIL_FROM | Uses env var or fallback | ⬜ |

---

## 25. End-to-End Tests

### 25.1 Critical User Journeys

| ID | Test Case | Steps | Expected | Priority |
|---|---|---|---|---|
| E2E-001 | **Happy Path: Browse → Cart → Checkout** | 1. Visit menu 2. Add 2 items 3. Go to cart 4. Proceed to checkout 5. Fill form 6. Submit | Order created, cart cleared, confirmation page | 🔴 Critical |
| E2E-002 | **Search → Add → Checkout** | 1. Search "biryani" 2. Add item 3. Checkout | Filtered results, order placed | 🔴 Critical |
| E2E-003 | **AI Chat → Recommendation → Cart** | 1. Open chat 2. Ask "spicy under $10" 3. View recommendations 4. Navigate to menu 5. Add recommended item | Chat works, recommendations shown | 🟡 High |
| E2E-004 | **Auth: Sign Up → Sign In** | 1. Go to /auth/signin 2. Switch to sign up 3. Register 4. Sign in with same creds | Account created, logged in | 🟡 High |
| E2E-005 | **Auth: Sign In → Order History** | 1. Sign in 2. Place order 3. View /orders | Order visible in history | 🟡 High |
| E2E-006 | **Guest Checkout** | 1. Add items without auth 2. Checkout 3. Submit | Order created without user_id | 🟡 High |
| E2E-007 | **Multi-filter Menu** | 1. Select cuisine 2. Toggle veg 3. Search 4. Sort by price | Correct filtered/sorted results | 🟢 Medium |
| E2E-008 | **Cart Persistence** | 1. Add items 2. Close tab 3. Reopen | Cart restored from localStorage | 🟢 Medium |
| E2E-009 | **Admin: Manage Orders** | 1. Login as admin 2. View /admin/orders 3. Update status | Status changed, reflected in UI | 🟡 High |
| E2E-010 | **Admin: Menu Management** | 1. Login as admin 2. View /admin/menu 3. Search 4. Open edit modal | Table rendered, search works, modal opens | 🟢 Medium |
| E2E-011 | **Empty Cart Guard** | 1. Navigate to /checkout directly | Redirected to /cart | 🟢 Medium |
| E2E-012 | **Responsive: Mobile Menu** | 1. Open on mobile 2. Click hamburger 3. Navigate | Mobile menu works, pages render | 🟢 Medium |

### 25.2 Edge Case Journeys

| ID | Test Case | Steps | Expected | Status |
|---|---|---|---|---|
| E2E-EC-001 | Cart with 20+ items | Add many items, vary quantities | Cart handles gracefully, totals correct | ⬜ |
| E2E-EC-002 | Rapid add/remove | Quickly click add/remove | State stays consistent | ⬜ |
| E2E-EC-003 | Back navigation from checkout | Go to checkout → browser back | Cart preserved | ⬜ |
| E2E-EC-004 | Network offline during checkout | Disable network → submit | Error shown, form not cleared | ⬜ |
| E2E-EC-005 | Chat with very long message | Type 500+ chars | Message sent, no crash | ⬜ |

---

## 26. Non-Functional Tests

### 26.1 Performance

| ID | Test Case | Metric | Target | Status |
|---|---|---|---|---|
| NF-PERF-001 | Home page load time | First Contentful Paint | < 1.5s | ⬜ |
| NF-PERF-002 | Menu page with all items | Time to Interactive | < 2s | ⬜ |
| NF-PERF-003 | Menu filtering speed | Filter interaction to render | < 100ms | ⬜ |
| NF-PERF-004 | Cart operations | Add/remove item | < 50ms | ⬜ |
| NF-PERF-005 | Chat response time | Message send to display | < 3s (inc. API) | ⬜ |
| NF-PERF-006 | Build bundle size | First Load JS shared | < 100KB | ⬜ |

### 26.2 Accessibility

| ID | Test Case | Requirement | Status |
|---|---|---|---|
| NF-A11Y-001 | Keyboard navigation | All interactive elements focusable via Tab | ⬜ |
| NF-A11Y-002 | Focus management in modals | Focus trapped inside open modal | ⬜ |
| NF-A11Y-003 | ARIA labels | Form inputs have labels | ⬜ |
| NF-A11Y-004 | Color contrast | Text contrast ≥ 4.5:1 | ⬜ |
| NF-A11Y-005 | Screen reader for cart | Cart count announced | ⬜ |
| NF-A11Y-006 | Alt text for images | All images have alt text | ⬜ |

### 26.3 Security

| ID | Test Case | Vulnerability | Status |
|---|---|---|---|
| NF-SEC-001 | API keys not in client bundle | Check browser network/source | ⬜ |
| NF-SEC-002 | Admin routes reject non-admin | Regular user hits /api/admin/* | ⬜ |
| NF-SEC-003 | User can't see other's orders | GET /api/orders filters by user_id | ⬜ |
| NF-SEC-004 | SQL injection prevention | Special chars in search | ⬜ |
| NF-SEC-005 | XSS prevention | Script tags in form inputs | ⬜ |
| NF-SEC-006 | CSRF protection | Supabase handles via tokens | ⬜ |
| NF-SEC-007 | Rate limiting on chat | Rapid API calls | ⬜ |

### 26.4 Responsive Design

| ID | Test Case | Viewport | Expected | Status |
|---|---|---|---|---|
| NF-RES-001 | Mobile (375px) | All pages | Stacked layout, readable | ⬜ |
| NF-RES-002 | Tablet (768px) | Menu, cart pages | 2-column grids | ⬜ |
| NF-RES-003 | Desktop (1280px) | All pages | Full layout with sidebars | ⬜ |
| NF-RES-004 | Chat widget mobile | 375px | Widget fits, scrollable | ⬜ |
| NF-RES-005 | Admin table mobile | 375px | Horizontal scroll or card layout | ⬜ |

---

## 27. Test Verification Matrix

### Feature Coverage Summary

| Feature | Unit | Component | Page | API | E2E | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|---|
| **Utilities** | 19 | — | — | — | — | Full |
| **Cart State** | 23 | — | — | — | — | Full |
| **Auth State** | 10 | — | — | — | — | Full |
| **UI Components** | — | 26 | — | — | — | Full |
| **Menu Components** | — | 14 | — | — | — | Full |
| **Cart Components** | — | 11 | — | — | — | Full |
| **Chat Components** | — | 18 | — | — | — | Full |
| **Home Page** | — | — | 8 | — | — | Full |
| **Menu Page** | — | — | 18 | — | — | Full |
| **Cart Page** | — | — | 4 | — | — | Full |
| **Checkout Page** | — | — | 13 | — | — | Full |
| **Auth Page** | — | — | 11 | — | — | Full |
| **Orders Page** | — | — | 7 | — | — | Full |
| **Admin Pages** | — | — | 13 | — | — | Full |
| **Menu API** | — | — | — | 14 | — | Full |
| **Chat API** | — | — | — | 15 | — | Full |
| **Orders API** | — | — | — | 18 | — | Full |
| **Cuisines API** | — | — | — | 3 | — | Full |
| **Admin Menu API** | — | — | — | 9 | — | Full |
| **Admin Orders API** | — | — | — | 10 | — | Full |
| **AI Chatbot Flow** | — | — | — | — | 8 | Full |
| **Email Service** | — | — | — | — | 5 | Full |
| **E2E Journeys** | — | — | — | — | 17 | Full |
| **Non-Functional** | — | — | — | — | 18 | Full |
| **TOTAL** | **52** | **69** | **74** | **69** | **48** | **312 test cases** |

### Implementation Verification Checklist

| # | Verification Item | Pass/Fail |
|---|---|---|
| 1 | TypeScript compilation — zero errors | ✅ Pass |
| 2 | ESLint — zero errors (warnings acceptable) | ✅ Pass |
| 3 | Next.js build completes | ✅ Pass |
| 4 | All pages render (static generation) | ✅ Pass |
| 5 | All API routes compile | ✅ Pass |
| 6 | Seed data loads without errors | ✅ Pass |
| 7 | Cart context provides all methods | ✅ Pass |
| 8 | Auth context provides all methods | ✅ Pass |
| 9 | All component exports match imports | ✅ Pass |
| 10 | Type interfaces consistent across files | ✅ Pass |
| 11 | OpenAI client initializes lazily | ✅ Pass |
| 12 | Resend client initializes lazily | ✅ Pass |
| 13 | Supabase clients handle missing env vars | ✅ Pass |
| 14 | Admin routes check admin email | ✅ Pass |
| 15 | Cart persists to localStorage | ✅ Pass |
| 16 | Menu filters work client-side | ✅ Pass |
| 17 | Chat API filters seed data correctly | ✅ Pass |
| 18 | Email template generates valid HTML | ✅ Pass |
| 19 | All 6 cuisines in seed data | ✅ Pass |
| 20 | 45+ menu items in seed data | ✅ Pass |

---

*Last updated: December 2024*
