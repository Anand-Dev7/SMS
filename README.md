# Salary Management System (SMS) - Next.js + Supabase starter

This repo is a minimal starter for a mobile-friendly **Salary Management System (PWA)** using Next.js (for Vercel) and Supabase (Postgres + Auth).

## What’s included
- Next.js web app (mobile-first)
- Supabase client integration
- Basic auth (email/password) flows
- Pages: Login, Dashboard, Months, Add Expense
- Supabase SQL file with tables, view, and RLS policies

## How to deploy (quick)
1. Create a Supabase project and run the SQL in `supabase.sql`.
2. In Supabase > Settings > API copy `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
3. In your GitHub repo (this one), push these files (or upload ZIP).
4. On Vercel, import the GitHub repo.
   - Build Command: `npm run build`
   - Output Directory: (leave as default)
   - Add Environment Variables in Vercel:
     - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
5. Deploy. Open the URL on your phone and "Add to Home Screen" for PWA-like usage.

## Notes for phone-only workflow
- You can upload this ZIP to GitHub using the GitHub mobile app or GitHub web on your phone.
- After connecting the repo to Vercel and setting env vars, Vercel will auto-deploy.

## Files of interest
- `supabase.sql` — create tables, view, and RLS policies
- `pages/` — Next.js pages (login, dashboard, months, expenses)
- `lib/supabaseClient.js` — Supabase client helper
