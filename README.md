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

Open [http://localhost:3000](http://localhost:3000). Create a project, then add meetings, associates, and client files from the project page.

## Stack

- **Next.js 15** (App Router), **TypeScript**, **Tailwind CSS**
- **Prisma** + **SQLite** (default; switch to Postgres for production by changing `DATABASE_URL` in `.env`)
- Server actions for all mutations; no API routes

## Design

Minimal, Apple-inspired: system fonts (-apple-system), generous whitespace, subtle borders and shadows, clear hierarchy. Light/dark mode follows system preference via CSS variables in `app/globals.css`.
