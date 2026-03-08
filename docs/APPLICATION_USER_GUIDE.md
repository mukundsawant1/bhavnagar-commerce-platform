# Bhavnagar Application User Guide

This document explains how to use the Bhavnagar web application as a customer, administrator, and operator.

## Who Should Read This

- Customers: browse products, manage account, and complete checkout.
- Admin users: access the protected admin dashboard and review analytics.
- Operators/developers: configure environment, run webhooks, and validate flows.

## Feature Overview

- Shop browsing: `/shop`
- Cart page scaffold: `/cart`
- Checkout page scaffold: `/checkout`
- Account authentication: `/account` (Supabase sign-in/sign-up/sign-out)
- Admin dashboard: `/admin` (requires authenticated admin role)
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

## How Customers Use the App

1. Open `/shop` and view products.
2. Open `/account` and create account using email/password.
3. Sign in from `/account`.
4. Open `/checkout` and integrate your front-end form to call `POST /api/checkout`.
5. Complete Stripe checkout using test card flow.
6. After payment success, user is redirected to `/account?checkout=success`.

## How Admin Users Use the App

1. Sign in at `/account`.
2. Ensure user has `admin` role in `profiles` table.
3. Open `/admin`.
4. Review KPI cards, daily trend chart, and product performance list.

If a non-admin user opens `/admin`, middleware redirects to `/account`.

## Authentication Flow (Supabase)

- Sign up: handled in account auth panel.
- Sign in: handled in account auth panel.
- Sign out: handled in account auth panel.
- Session check: middleware validates user for `/admin/*` routes.
- Authorization check: middleware reads `profiles.role` and allows only `admin`.

## Payment Flow (Stripe)

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

### `orders`
- stores payment/order record
- links Stripe session using `stripe_session_id`
- tracks status lifecycle (`pending`, `paid`, `failed`, `cancelled`)

## Troubleshooting

### Cannot access `/admin`
- Verify sign-in is successful.
- Verify `profiles.role = 'admin'` for current user.
- Verify Supabase env values are configured.

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
- Non-admin user is blocked from `/admin`.
- Stripe webhook reaches `/api/webhooks/stripe`.
- Order status updates in Supabase.
- Payment confirmation email is sent.

## Current Scope and Limitations

- Cart and checkout UI are scaffold-level and require product/cart persistence wiring.
- Admin analytics are currently mock data visualizations.
- Full order creation prior to webhook confirmation should be added for production-grade reconciliation.

