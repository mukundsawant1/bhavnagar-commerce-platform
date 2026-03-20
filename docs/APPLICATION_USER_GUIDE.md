# Bhavnagar Application User Guide

This document explains how to use the Bhavnagar web application as a buyer, administrator, and farm owner.

## Who Should Read This

- Buyers: place bulk orders for fruits and vegetables.
- Admin users: validate stock with farms and confirm final delivery timelines.
- Farm owners: update produce availability, stock levels, and dispatch dates.

## Feature Overview

- Shop browsing: `/shop`
- Cart page scaffold: `/cart`
- Checkout page scaffold: `/checkout`
- Account authentication: `/account` (Gmail-first sign-in/sign-up/sign-out + Google OAuth)
- Admin dashboard: `/admin` (requires authenticated admin role)
- Farm dashboard: `/farm` (requires authenticated farm_owner role)
- Checkout API: `POST /api/checkout`
- Stripe webhook API: `POST /api/webhooks/stripe`
- Email notification integration: Resend (payment confirmation)

## Prerequisites

1. Node.js 20+ installed.
2. Supabase project created.
3. Stripe account with test keys.
4. Resend API key.

## First-Time Setup

1. Install dependencies:
```bash
npm install
```
2. Create environment file:
```bash
copy .env.example .env.local
```
3. Fill `.env.local` values for Supabase, Stripe, and Resend.
4. Apply Supabase migration from:
- `supabase/migrations/20260308_init_auth_orders.sql`
5. Start app:
```bash
npm run dev
```
6. Open `http://localhost:3000`.

## How Buyers Use the App

1. Open `/shop` and add bulk produce items to your cart using the **Add Bulk Request** button.
2. The header shows a running badge count of cart items, so you can always see how many units are in your cart.
3. Open `/cart` to verify quantities, update/remove items (toast notifications confirm actions), and then proceed to checkout.
4. Open `/account` and create an account using Gmail + password, or continue with Google.
5. Sign in from `/account`.
6. On `/checkout`, review your order, fill in the buyer/delivery details, and submit your order request.
7. The order is routed to the farm owner for acceptance and delivery scheduling. You can monitor order progress under `/orders`.

## How Admin Users Use the App

1. Sign in at `/account`.
2. Ensure the user has the `admin` role in the `profiles` table.
3. Open `/admin`.
4. Review incoming buyer orders.
5. Optionally adjust the farm-assigned delivery date or override farm details.
6. Once payment is received by your team, mark the order as **Payment received**.
7. Use the shareable report panel to copy summary stats for other team members.

> Note: Minimum bulk quantities configured in the product settings are stored locally in your browser and affect how buyers can place orders.

If a non-admin user opens `/admin`, middleware redirects to `/account`.

## How Farm Owners Use the App

1. Sign in at `/account` using Gmail.
2. Ensure `profiles.role = 'farm_owner'` for current user.
3. Open `/farm`.
4. Review orders assigned to your farm.
5. Accept or reject each order; rejecting allows you to add rejection notes.
6. Set or update the expected delivery date for accepted orders.
8. Optionally, adjust the minimum bulk purchase quantities for your products (stored in your browser).

If a non-farm-owner user opens `/farm`, middleware redirects to `/account`.

## Authentication Flow (Supabase)

- Sign up: handled in account auth panel.
- Sign in: handled in account auth panel.
- Sign out: handled in account auth panel.
- Session check: middleware validates user for `/admin/*` and `/farm/*` routes.
- Authorization check: middleware reads `profiles.role` and allows `admin` for `/admin` and `farm_owner` for `/farm`.

## Payment & Order Tracking Flow

### Order creation (buyer)
1. Buyer submits an order on `/checkout` (no payment required).
2. The system creates an `orders` row in Supabase with `status = farm_pending` and assigns it to the first farm found in the order items.

### Farm approval and delivery scheduling
1. Farm owners see assigned orders on `/farm`.
2. Farm owners can either **Accept** or **Reject** each order.
   - Accepting sets the order status to `farm_accepted`.
   - Rejecting sets the order status to `farm_rejected` and adds rejection notes.
3. Farm owners can also set or update the planned delivery date.

### Admin override and reporting
1. Admins see all orders on `/admin` and can override farm values.
2. Admins can edit the delivery date set by the farm and mark payment as received.
3. Admins also have a dedicated product settings panel for adjusting minimum bulk order quantities per product.

### Optional Stripe integration
If you want to accept card payments, the Stripe checkout flow is still available:
1. Frontend calls `POST /api/checkout` with line items.
2. API creates Stripe checkout session and returns `checkoutUrl`.
3. User completes payment on Stripe hosted checkout.
4. Stripe sends webhook to `POST /api/webhooks/stripe`.
5. Webhook verifies signature, updates `orders` status to `paid`, and sends email via Resend.

## Webhook Local Testing

1. Start app on port 3000.
2. Start Stripe forwarding:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
3. Copy webhook secret and set `STRIPE_WEBHOOK_SECRET`.
4. Trigger a test checkout and verify webhook logs.

## Data Model Notes

### `profiles`
- one row per authenticated user
- includes `role` for access control
- expected roles: `buyer`, `admin`, `farm_owner`

### `orders`
- stores payment/order record
- links Stripe session using `stripe_session_id`
- tracks status lifecycle (`pending`, `paid`, `failed`, `cancelled`)

## Troubleshooting

### Cannot access `/admin`
- Verify sign-in is successful.
- Verify `profiles.role = 'admin'` for current user.
- Verify Supabase env values are configured.

### Supabase client initialization error (missing URL or key)
If you see an error like:

> `@supabase/ssr: Your project's URL and API key are required to create a Supabase client!`

Then your environment is missing one of:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

Make sure your `.env.local` includes these values and that the app is restarted after changes.

### Verify Supabase connection
Run the bundled health check script to confirm the backend can reach your Supabase database:

```bash
npm run check:supabase
```

If Supabase env vars are missing, the script will warn and exit cleanly. When configured, it validates the required env vars and performs a small query against the `profiles` table.

### Checkout API returns error
- Ensure `STRIPE_SECRET_KEY` is configured.
- Ensure line items include valid `name`, `unitAmount`, and `quantity`.

### Webhook signature invalid
- Ensure `STRIPE_WEBHOOK_SECRET` is from active Stripe listener/project.

### Email not sent
- Ensure `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are valid.
- Verify Resend domain/sender policy.

## Verification Checklist

- `npm run lint` passes.
- `npm run build` passes.
- Account signup/signin/signout works.
- Admin user can open `/admin`.
- Farm owner can open `/farm`.
- Non-admin user is blocked from `/admin`.
- Non-farm-owner user is blocked from `/farm`.
- Stripe webhook reaches `/api/webhooks/stripe`.
- Order status updates in Supabase.
- Payment confirmation email is sent.

## Current Scope and Limitations

- Cart persistence is implemented using localStorage and supports quantity updates and item removal.
- Order creation captures cart line items and buyer details in Supabase order metadata (compressed on save to reduce storage footprint).
- Compressed metadata uses gzip + base64 and is transparently decompressed by the app when orders are retrieved.
- Large assets (images, file blobs) are not stored in order metadata; store images externally (e.g., Supabase Storage / S3 / CDN) and reference them by URL.
- Admin analytics are currently mock data visualizations.
- Stripe checkout is still optional; the app can function with the admin/farm payment tracking workflow.

## Developer Notes (Compression & Metadata)

- Order metadata is compressed using gzip + base64 before being written to Supabase.
- Decompression is handled automatically on the server using `src/lib/compression.ts` so UI components can always work with plain objects.
- If you need to inspect raw metadata in the Supabase dashboard, look for the `metadata` field containing `{ "__compressed": true, ... }`.
- Avoid storing large binary assets in metadata; instead store media URLs and keep the metadata structure lightweight.

