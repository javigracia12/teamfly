# Teamfly

A minimal project ERP for project leaders: track key meetings, associates (with workload and feedback), and client files (priorities, role, notes) in one place.

## Setup

```bash
npm install
npx prisma generate
npx prisma db push
```

## Run

```bash
npm run dev
```

Open [http://localhost:3001](http://127.0.0.1:3001). Create a project, then add meetings, associates, and client files from the project page.

## Deploy to Cloudflare Pages

This app is set up for **Cloudflare Pages** (Next.js with `@cloudflare/next-on-pages`).

### 1. Connect the repo to Pages

1. In [Cloudflare Dashboard](https://dash.cloudflare.com) go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Select the **teamfly** repo and branch **main**.
3. Set:
   - **Build command:** `npx @cloudflare/next-on-pages@1`
   - **Build output directory:** `.vercel/output/static`
   - **Root directory:** (leave empty)
4. Create the project. Each push to `main` will trigger a new build and deploy.

### 2. D1 (database) on Pages

The app uses **Cloudflare D1** in production. One-time setup:

1. Create the D1 database and apply the schema (run once, with your Cloudflare token and account ID):

   ```bash
   export CLOUDFLARE_API_TOKEN=tu_token
   export CLOUDFLARE_ACCOUNT_ID=tu_account_id
   npm run cf:setup-d1
   ```

   This creates `teamfly-db`, writes its ID into `wrangler.toml`, and runs the migration on D1.

2. In the **Pages** project: **Settings** → **Functions** → **D1 database bindings** → **Add binding**:
   - **Variable name:** `DB`
   - **D1 database:** select (or create) `teamfly-db` (use the same database ID that is now in `wrangler.toml`).

3. Commit and push the updated `wrangler.toml` so the build keeps the same config; the live app will use the binding you set in the dashboard.

Your site will be at `https://<project-name>.pages.dev` (or your custom domain).

## Stack

- **Next.js 15** (App Router), **TypeScript**, **Tailwind CSS**
- **Prisma** + **SQLite** locally; **D1** on Cloudflare Pages
- Server actions for all mutations; no API routes

## Design

Minimal, Apple-inspired: system fonts (-apple-system), generous whitespace, subtle borders and shadows, clear hierarchy. Light/dark mode follows system preference via CSS variables in `app/globals.css`.
