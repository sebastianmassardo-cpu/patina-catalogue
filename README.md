# Patina Catalogue Project

Catalogue site for Patina built with Next.js App Router and Supabase.

## Setup

1. Create `.env.local` in the project root.
2. Copy the variables from `.env.example`.
3. Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Install dependencies:

```bash
npm install
```

5. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Project map

- Main route: `app/page.tsx`
- Catalogue UI: `app/_components/catalogue-browser.tsx`
- Editorial sections: `app/_components/editorial-sections.tsx`
- Pricing summary: `app/_components/pricing-summary.tsx`
- Pricing logic: `app/pricing-config.ts`
- Supabase client: `lib/supabase.ts`

## Security

- Keep runtime credentials in `.env.local` only.
- Never commit service-role keys to this repository.
- If a key was previously committed, rotate it in Supabase.
