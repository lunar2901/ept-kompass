# EPT-Kompass

Bilingual, self-paced, exam-driven study companion for TU Berlin's B.Sc. *Energie- und Prozesstechnik* (from SoSe 2026: *Erneuerbare Energien und Verfahrenstechnik*). Zero AI at runtime — every hint, solution, common-mistake list, and Diskussion is pre-authored.

See [`PROMPT.md`](./PROMPT.md) for the full product brief.

## Stack

- Next.js 16 (App Router, RSC) · React 19 · TypeScript strict
- Tailwind v4 · Radix UI primitives · lucide-react
- KaTeX via `rehype-katex` + `remark-math` (see [`docs/math-and-typography.md`](./docs/math-and-typography.md))
- MDX lessons: `@next/mdx` for static pages, `next-mdx-remote/rsc` for runtime-compiled lesson bodies
- Mermaid (dynamic import) · Recharts · mathjs
- Supabase (Postgres + Auth + Storage + RLS) — optional for MVP, required for the seeded DB path
- Deploy: Vercel + Supabase cloud. Both free tiers.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — fill in for Supabase-backed features
npm run dev                  # http://localhost:3000
```

Without Supabase env vars, the app reads lessons directly from `content/**/*.mdx` — useful for offline development and for a first-boot smoke test.

### Useful routes

- `/` — home with the reference-slice lesson list
- `/render-test` — math-and-typography rendering gate (every KaTeX/MDX construct the curriculum uses)
- `/lektion/<slug>` — a single lesson, two-pane on desktop

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Start the built app |
| `npm run lint` | ESLint via `next lint` |
| `npm run format` | Prettier write |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run seed` | Populate Supabase from `content/**/*.mdx` + `scripts/seed-glossary.json` |

## Repository layout

```
app/                      # Next.js App Router pages + layout
components/
  lesson-components.ts    # MDX component type contracts (authoritative)
  lesson/                 # implementations imported as @/components/lesson
content/                  # the .mdx lessons — source of truth
  track-0/...
  thermo-1/...
docs/                     # math & typography spec
lib/
  content.ts              # filesystem MDX loader
  supabase/{client,server}.ts
scripts/
  seed-glossary.json
  seed.ts                 # populates Supabase (arrives in step 6)
supabase/
  migrations/0001_init.sql
```

## Pedagogy rules (the short version)

Every lesson has five parts: Intuition · Schlüsselbegriffe · Theorie · Musteraufgabe · Übungen. Every exercise has a **hint**, a full worked **solution**, **common mistakes** (≥ 2), and a **Diskussion** — all pre-authored, all required. No stubs, no thinning.

Every German term in English prose is a `<GermanTerm>` chip. Formulas carry bilingual variable legends. The *Klausur-Modus* toggle hides English, leaving only German for exam simulation.

## License

Private — MVP in flight.
