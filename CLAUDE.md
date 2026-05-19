# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

Buyer App for "MateandoAndo" — a university project (IAW 2026) implementing a marketplace. This app handles the buyer-side: catalog browsing, cart, checkout, and shipping tracking. Deployed on Vercel; DB on Neon (PostgreSQL serverless).

## Commands

```bash
npm run dev       # start local dev server
npm run build     # prisma migrate deploy && next build (runs migrations first)
npm run lint      # next lint
vercel dev        # replicate the Vercel serverless environment locally (needed for webhook simulation)
```

No test suite yet.

## Architecture

**Stack:** Next.js 16.2.4 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Clerk v7 · Prisma · Neon PostgreSQL

### Mock strategy

All calls to Seller App, Payments App, and Shipping App go through mock functions in `/src/mocks/`. Toggle via env var:

```
NEXT_PUBLIC_USE_MOCKS=true   # Preview / local
NEXT_PUBLIC_USE_MOCKS=false  # Production (real integrations)
```

Pattern for every external call:
```ts
const getItems = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'
  ? sellerMock.getItems
  : sellerApi.getItems
```

When real integrations arrive, only the service module changes — callers stay the same.

### Planned folder structure

```
/src
  /app
    /api
      /buyers/[id_buyer]/route.ts           ← read by Seller App
      /buyers/payment-notification/route.ts ← called by Payments App
      /cart/route.ts                        ← buyer's own frontend
      /customers/[id_user]/route.ts         ← called by Shipping App
      /dev/simulate-payment/route.ts        ← dev-only webhook simulation
    /(public)                               ← no auth required
      page.tsx                              ← home / catalog
      /categorias/[category_name]/...
      /vendedores/[id_seller]/...
      /descuentos/page.tsx
    /(private)                              ← Clerk-protected
      /checkout/...
      /mis-compras/[id_package]/seguimiento/page.tsx
  /mocks
    seller.mock.ts
    payments.mock.ts
    shipping.mock.ts
  /lib
    /db/index.ts      ← Prisma client (placeholder, not yet implemented)
    /auth/clerk.ts    ← Clerk config + isServiceTokenValid()
  /components
  /hooks
```

### Database schema (Prisma / Neon PostgreSQL)

Four tables: `buyers`, `addresses`, `carts`, `cart_items`. Key constraints:
- One active cart per buyer.
- `cart_items.id_item` is a UUID reference to Seller App — **no formal FK**.
- Prices are **not stored** in the cart; fetched from Seller App at render time and snapshotted at purchase via Seller App's `createPurchaseOrder`.

### Authorization

| Caller | Mechanism |
|---|---|
| Buyer in the UI | Clerk JWT (`metadata.role === "buyer"` or `"admin-buyer"`) |
| Payments App → Buyer App | `X-Service-Token` header validated with `isServiceTokenValid()` |
| Shipping App → Buyer App | `X-Service-Token` header |
| Seller App → Buyer App | `X-Service-Token` header |
| Buyer App → Seller App | `X-Service-Token` or user JWT depending on endpoint |
| Buyer App → Payments App | User JWT |
| Buyer App → Shipping App | User JWT (tracking) / no auth (estimate) |

### Dev-only route

`/api/dev/simulate-payment` must be gated:
```ts
if (process.env.NODE_ENV === 'production') return new Response(null, { status: 404 })
```

## Required environment variables

```
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
DATABASE_URL
X_SERVICE_TOKEN_PAYMENTS
X_SERVICE_TOKEN_SHIPPING
X_SERVICE_TOKEN_SELLER
NEXT_PUBLIC_USE_MOCKS
```

All loaded in Vercel project settings, never committed. Local development uses `.env.local` (gitignored).
