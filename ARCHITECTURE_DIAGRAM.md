# Architecture Diagram: Intercepting Routes Implementation

## Directory Structure

```
app/(commonLayout)/
│
├── layout.tsx                          # Root layout with @modal slot
│   └── Props: { children, modal }
│
├── page.tsx                            # Home page
│   ├── <SearchSection />              # Interactive search
│   └── <CategoriesSection />          # Category cards
│
├── explore/
│   ├── page.tsx                       # Full page (direct access)
│   ├── explore-client.tsx             # Shared client component
│   └── loading.tsx                    # Loading state
│
└── @modal/                            # Parallel route slot
    ├── default.tsx                    # Returns null (no modal)
    └── (.)explore/                    # Intercepting route
        └── page.tsx                   # Modal wrapper

components/
├── modals/
│   └── explore-modal.tsx              # Dialog wrapper
├── sections/
│   ├── search-section.tsx             # Client: navigates to /explore
│   └── categories-section.tsx         # Links to /explore?category=X
└── ui/
    └── dialog.tsx                     # Radix UI Dialog (existing)
```

## Flow Diagrams

### Flow 1: Modal from Home Page (Intercepted)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Home Page (/)                           │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │           SearchSection                                 │   │
│  │  [Input: "Paris"] [Search Button] → /explore?...       │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                        │
│  │ Food │ │ Art  │ │Beach │ │Nature│ → /explore?category=X   │
│  └──────┘ └──────┘ └──────┘ └──────┘                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ User clicks Search or Category
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│               @modal/(.)explore/page.tsx                        │
│                   (Intercepting Route)                          │
│                                                                 │
│  1. Server fetches data with filters                           │
│  2. Wraps in <ExploreModal>                                    │
│  3. Renders <ExploreClient> with data                          │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ExploreModal Component                      │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Dialog (95vw × 90vh)                         [✕ Close]   │ │
│  │ ┌───────────────────────────────────────────────────────┐ │ │
│  │ │                                                       │ │ │
│  │ │         ExploreClient Component                      │ │ │
│  │ │         - Search bar                                 │ │ │
│  │ │         - Filters sidebar                            │ │ │
│  │ │         - Tour listings                              │ │ │
│  │ │         - Pagination                                 │ │ │
│  │ │                                                       │ │ │
│  │ └───────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Click outside or [✕] → router.back() → Returns to home       │
└─────────────────────────────────────────────────────────────────┘
```

### Flow 2: Full Page (Direct Access)

```
┌─────────────────────────────────────────────────────────────────┐
│                User Types in Address Bar                        │
│                    /explore or /explore?...                     │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Direct navigation
                            │ OR page refresh
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    explore/page.tsx                             │
│                   (Full Page Route)                             │
│                                                                 │
│  1. Server fetches data with filters                           │
│  2. Renders <ExploreClient> directly (no modal)                │
│  3. Full page experience                                       │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Full Page Layout                               │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Navbar                                                    │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │                                                           │ │
│  │         ExploreClient Component                          │ │
│  │         - Search bar                                     │ │
│  │         - Filters sidebar                                │ │
│  │         - Tour listings                                  │ │
│  │         - Pagination                                     │ │
│  │                                                           │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ Footer                                                    │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Component Interaction Map

```
┌──────────────────────────────────────────────────────────────────┐
│                       Layout Component                           │
│  Props: { children, modal }                                      │
│                                                                  │
│  <Navbar />                                                      │
│  {children}      ← Home page or other routes                    │
│  {modal}         ← @modal slot (null or ExploreModal)           │
│  <Footer />                                                      │
└──────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
┌───────────────────────────┐   ┌──────────────────────────┐
│     children slot         │   │     modal slot           │
│                           │   │                          │
│  Home Page:               │   │  default.tsx → null      │
│  - SearchSection          │   │    OR                    │
│  - CategoriesSection      │   │  (.)explore/page.tsx     │
│  - Other sections         │   │    → ExploreModal        │
└───────────────────────────┘   └──────────────────────────┘
        │                               │
        │ Link/Navigate to /explore    │
        └───────────────┬───────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │  Next.js Router Decision      │
        │                               │
        │  If from same route group:    │
        │    → Intercept                │
        │    → Show modal               │
        │                               │
        │  If direct/refresh:           │
        │    → Bypass intercept         │
        │    → Show full page           │
        └───────────────────────────────┘
```

## State Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    URL (Source of Truth)                    │
│  /explore?searchTerm=Paris&category=FOOD&minPrice=50       │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ searchParams
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Server Component (Page.tsx)                    │
│  - Parse searchParams                                       │
│  - Call getAllListings(filters)                            │
│  - Return listings + meta                                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ initialListings, initialMeta
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Client Component (ExploreClient)               │
│                                                             │
│  Local State:                                               │
│  - searchInput (synced via debounce)                       │
│  - priceRange (synced on button click)                    │
│  - selectedCategory (synced immediately)                   │
│  - selectedLanguage (synced immediately)                   │
│                                                             │
│  updateFilters() → router.push() → URL updates            │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Navigation
                            ▼
                    ┌───────────────┐
                    │  Page Refresh │
                    │  (RSC re-run) │
                    └───────────────┘
```

## Data Flow Sequence

```
1. User Action
   ↓
2. Client Event Handler (onClick, onSubmit)
   ↓
3. updateFilters() / router.push()
   ↓
4. URL Changes (/explore?...)
   ↓
5. Next.js Routing Decision
   ├─ From home → Intercept → Modal
   └─ Direct → Full page
   ↓
6. Server Component Executes
   ├─ Parse searchParams
   ├─ Call API service
   └─ Return data
   ↓
7. Client Component Receives Props
   ├─ Initialize state from props
   └─ Render UI
   ↓
8. User Interacts with Filters
   ↓
9. Repeat from step 2
```

## Browser Navigation

```
┌──────────────────────────────────────────────────────────────┐
│                    Browser History Stack                     │
└──────────────────────────────────────────────────────────────┘

[/]                          Home page (initial)
 ↓ Click "Food" category
[/, /explore?category=FOOD]  Modal opens
 ↓ Click Back button
[/]                          Modal closes, returns to home
 ↓ Click Forward button
[/, /explore?category=FOOD]  Modal reopens with same filter
 ↓ Type /explore in URL bar
[/, /explore?category=FOOD, /explore]  Full page loads
 ↓ Refresh (Cmd+R)
[/, /explore?category=FOOD, /explore]  Full page reloads (no modal)
```

## Key Patterns

### 1. Intercepting Route Pattern
```
@modal/(.)explore/
    └── page.tsx    → Intercepts /explore from same level
```

### 2. Parallel Route Pattern
```
layout.tsx
    └── modal prop → Renders @modal slot content
```

### 3. Conditional Modal
```typescript
// @modal/default.tsx
export default function Default() {
  return null  // No modal by default
}

// @modal/(.)explore/page.tsx
export default function ModalPage() {
  return <ExploreModal>...</ExploreModal>  // Show modal when intercepted
}
```

### 4. Shared Component Pattern
```
explore-client.tsx           ← Shared business logic
    ↑                   ↑
    │                   │
explore/page.tsx   @modal/(.)explore/page.tsx
(Full page)        (Modal wrapper)
```

## Performance Characteristics

- ✅ Server-side rendering (both flows)
- ✅ Streaming with Suspense
- ✅ Code splitting (modal only loaded when needed)
- ✅ Shared JavaScript bundle for ExploreClient
- ✅ Optimistic UI via useTransition
- ✅ Debounced search (500ms)
- ✅ Progressive enhancement

---

**Legend:**
- `→` Navigation/data flow
- `↓` Sequential flow
- `├─` Conditional branch
- `[ ]` Route/page
- `< >` Component

