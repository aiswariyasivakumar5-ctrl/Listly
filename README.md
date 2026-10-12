# Craigslist Modern — Full-Stack Classified Marketplace Redesign

A complete, modern, responsive, accessible, and secure classified marketplace redesigning Craigslist. Preserves the independent, community-first ethos of peer-to-peer local classifieds while modernizing visual ergonomics, category browsing, multi-attribute database search, location handling, trust & safety, and buyer-seller communications.

---

## 🌟 Key UX Improvements Over Classic Craigslist

| Feature | Classic Craigslist (Reference Screenshots) | Craigslist Modern Redesign |
| :--- | :--- | :--- |
| **Visual Design** | Dense text lists, raw blue hyperlinks, dated 1990s table layouts | Polished design system (warm neutrals, brand teal accents, structured cards, modern typography, accessible focus indicators) |
| **Category Navigation** | Overwhelming text wall of 100+ categories simultaneously on the homepage | Structured category cards with icons, nested subcategory menus, dedicated `/categories` directory, and category landing pages |
| **Location Discovery** | Long unstructured alphabetical text lists of cities and states | Searchable location modal with city/state/ZIP filter, major metro regions, and opt-in browser geolocation with explicit permission |
| **Search & Filtering** | Unhelpful empty states with minimal guidance | Parameterized database search with keywords, price boundaries, condition filters, category facets, sorting, active filter chips, and URL sync |
| **Listing Presentation** | Tiny low-resolution thumbnails or text-only rows | High-resolution image galleries, structured attribute tags (bedrooms, year, mileage, job type), view counter, and seller profiles |
| **Posting Workflow** | Confusing multi-page radio buttons | Clear 6-step guided wizard: Category → Details → Price & Attributes → Location → Photo Upload → Review & Publish |
| **Trust & Safety** | Vulnerable to email scraping & off-platform scams | In-app buyer-to-seller messaging protecting personal emails/phones, scam warnings, and one-click listing reporting |
| **Account Management** | Rudimentary post editing via emailed links | Comprehensive authenticated dashboard managing active ads, view counts, sold status toggles, saved items, and inquiries |

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework**: React 18 with Vite and TypeScript
- **Styling**: Tailwind CSS with custom design system tokens (`brand`, `navy`, subtle shadows, accessible focus rings)
- **Icons**: Lucide React
- **Routing**: React Router v6 (22 interconnected pages with `ProtectedRoute` boundaries)
- **State & Context**: `AuthContext` (JWT session management) and `LocationContext` (explicit geolocation permission flow)

### Backend
- **Runtime**: Node.js v24 with TypeScript & Express
- **Architecture**: RESTful API with structured routes, middleware, and centralized error handling
- **Authentication**: bcryptjs password hashing with JSON Web Tokens (JWT)
- **File Uploads**: Multer image upload pipeline validating MIME types and sizes (serving from `/uploads`)
- **Database**: SQLite with Prisma ORM (zero-config local persistence with full relational integrity, cascading deletes, and unique constraints)
- **Testing**: Vitest with Supertest (42 automated integration and E2E workflow tests)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24.14.0)
- **npm**: v9+ (tested on npm 11.9.0)

### 2. Installation
Install all dependencies in the root, server, and client:

```bash
# In project root
npm install
npm install --prefix server
npm install --prefix client
```

### 3. Database Setup & Seeding
Initialize the SQLite database and seed comprehensive sample data (categories, locations, listings, images, users, messages, favorites):

```bash
cd server
npx prisma db push
npm run seed
cd ..
```

### 4. Running Locally
Run both backend API (Port 5000) and frontend Vite server (Port 5173 / 5174) concurrently:

```bash
# From project root
npm run dev

# Or run separately in two terminals:
# Terminal 1: Backend
npm run dev:server

# Terminal 2: Frontend
npm run dev:client
```

Open your browser at: **`http://localhost:5173`** (or `http://localhost:5174`)

---

## 🔑 Pre-Seeded Demo Accounts

The database seed script creates realistic marketplace accounts ready for immediate testing:

| Role | Email | Password | Display Name |
| :--- | :--- | :--- | :--- |
| **Demo User** | `demo@example.com` | `Password123!` | Alex Mercer (SoMa, SF) |
| **Seller 1** | `sarah.chen@example.com` | `Password123!` | Sarah Chen (Mission District, SF) |
| **Seller 2** | `marcus.johnson@example.com` | `Password123!` | Marcus Johnson (Austin, TX) |
| **Buyer** | `buyer@example.com` | `Password123!` | David Kim (Seattle / SF) |

*Tip: The Login page features quick-login buttons for one-click access without manual typing.*

---

## 📄 Application Pages & Routes (All 22 Implemented)

### Public Pages
1. **Home Page** (`/`): Modern hero, prominent search bar, category cards, recently posted classifieds, core pillar sections, safety banner.
2. **Location Selection** (`/locations`): City/State/ZIP search, major metro regions, and opt-in browser geolocation.
3. **Browse All Categories** (`/categories`): Directory with real-time text filter and subcategory direct links.
4. **Category Landing Page** (`/category/:slug`): Department banner, subcategory pills, grid/list switcher, and filtered listings.
5. **Search Results** (`/search`): Parameterized search with keyword matching, price sliders, condition filters, active filter chips, and pagination.
6. **Listing Details** (`/listing/:id`): Image gallery with thumbnails, specifications table, full description, seller profile, and contact modal.
7. **User Registration** (`/register`): Name, email, optional phone, secure password confirmation, and terms agreement.
8. **User Login** (`/login`): Email & password authentication with show/hide password and quick demo accounts.
9. **Password Reset Request** (`/forgot-password`): Token generation with local testing link.
10. **Password Reset Execution** (`/reset-password/:token`): New password update with token validation.
11. **About the Project** (`/about`): Design rationale, modernization goals, and community principles.
12. **Help Center & FAQ** (`/help`): Interactive accordion answering common marketplace questions.
13. **Safety Guidelines** (`/safety`): Scam prevention checklists, in-person meeting advice, and reporting guide.
14. **Privacy Policy** (`/privacy`): Zero surveillance ads, no selling personal data, explicit location permissions.
15. **Terms of Service** (`/terms`): Acceptable use, prohibited items (weapons, drugs, counterfeits), and moderation rules.

### Authenticated Pages (Protected by JWT)
16. **User Dashboard** (`/dashboard`): Metric cards (Active Ads, Views, Messages, Saved), recent listings, and recent inquiries.
17. **My Listings** (`/dashboard/listings`): Manage active postings, view count metrics, toggle sold status, and delete postings.
18. **Create Listing** (`/post`): 6-step guided wizard (Category → Details → Pricing → Location → Photo Upload → Review).
19. **Edit Listing** (`/edit-listing/:id`): Owner-restricted edit screen for pricing, status (Active/Sold/Inactive), and details.
20. **Saved Listings** (`/saved`): Bookmark manager with one-click unfavorite action.
21. **Buyer-Seller Messaging** (`/messages`): Two-pane responsive chat with conversation list, message history, and inquiry links.
22. **Profile & Settings** (`/settings`): Update display name, contact phone, seller bio, and avatar photo.

---

## 📡 Backend REST API Endpoints

### Authentication
- `POST /api/auth/register` — Create account, hash password, return JWT
- `POST /api/auth/login` — Authenticate credentials, return JWT
- `POST /api/auth/logout` — End session
- `GET /api/auth/me` — Retrieve current authenticated user profile
- `POST /api/auth/forgot-password` — Issue password reset token
- `POST /api/auth/reset-password` — Verify token and update password

### Categories & Locations
- `GET /api/categories` — Top-level categories with subcategories and listing counts
- `GET /api/categories/:slug` — Category by slug with breadcrumbs
- `GET /api/locations/search?q=...` — Search cities, states, metros, or ZIPs
- `GET /api/locations/popular` — Popular metro regions
- `GET /api/locations/nearby?lat=...&lng=...` — Haversine distance lookup for nearby regions

### Listings
- `GET /api/listings` — Query with `q`, `category`, `location`, `minPrice`, `maxPrice`, `condition`, `isFree`, `sort`, `page`, `limit`
- `GET /api/listings/:id` — Full listing detail (increments view count, attaches favorite status)
- `POST /api/listings` — Create listing (protected)
- `PATCH /api/listings/:id` — Update listing (protected, owner only)
- `DELETE /api/listings/:id` — Delete listing (protected, owner only)
- `GET /api/listings/user/me` — Current user's listings (protected)

### Favorites
- `GET /api/favorites` — Current user's saved items (protected)
- `POST /api/favorites/:listingId` — Save listing (protected)
- `DELETE /api/favorites/:listingId` — Remove from saved (protected)

### Conversations & Messaging
- `GET /api/conversations` — List conversations for current user (protected)
- `POST /api/conversations` — Start or retrieve conversation (protected)
- `GET /api/conversations/:id/messages` — Get message thread (protected, participant only)
- `POST /api/conversations/:id/messages` — Send message in thread (protected, participant only)
- `PATCH /api/conversations/:id/read` — Mark thread as read (protected)

### Trust & Moderation
- `POST /api/reports` — Submit report with reason and details for suspicious listings
- `POST /api/upload` — Multer image upload endpoint (JPEG, PNG, WebP up to 5MB)
- `PATCH /api/users/me` — Update user profile

---

## 🧪 Testing & Quality Assurance

The application includes automated integration test suites executed with Vitest:

```bash
# Run server test suite
npm --prefix server test
```

### Test Results Summary: **42 Passed Tests (100% Pass Rate)**

```text
 ✓ tests/e2e-workflows.test.ts (18 tests)
 ✓ tests/api.test.ts (24 tests)

 Test Files  2 passed (2)
      Tests  42 passed (42)
```

#### Workflow Scenarios Tested:
- **Workflow A (Find a Listing)**: Homepage loads categories & listings → location search → keyword & faceted filter → detail view.
- **Workflow B (Publish a Listing)**: User registers → creates listing with attributes & photo → verifies listing appears in search → edits listing.
- **Workflow C (Save a Listing)**: User favorites listing → verifies in `/favorites` → un-favorites listing.
- **Workflow D (Contact a Seller)**: Buyer initiates conversation → seller views message and replies → in-app status updates.
- **Workflow E (Security & Authorization)**:
  - Unauthorized user cannot edit another user's listing (`403 Forbidden`).
  - Intruder cannot view third-party private conversations (`403 Forbidden`).
  - Unauthenticated access to protected routes is rejected (`401 Unauthorized`).
  - Invalid listing payload is rejected (`400 Bad Request`).

---

## 🛡️ Trust & Safety Features
1. **No Plaintext Passwords**: Passwords hashed using bcrypt (cost 10).
2. **Server-Side Authorization**: Ownership verified in SQL queries, not solely on the client.
3. **Privacy by Default**: Phone numbers and emails are masked. Buyer-seller contact takes place via secure in-app conversations.
4. **Explicit Geolocation**: Geolocation only requested when the user clicks "Locate Nearest Region".
5. **Listing Reporting**: One-click flag mechanism logging reports directly to the database.
