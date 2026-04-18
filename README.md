# EPT-Kompass

Bilingual, self-paced, exam-driven study companion for TU Berlin's B.Sc. *Energie- und Prozesstechnik* (from SoSe 2026: *Erneuerbare Energien und Verfahrenstechnik*). Zero AI at runtime — every hint, solution, common-mistake list, and Diskussion is pre-authored.

**Live:** [ept-kompass.vercel.app](https://ept-kompass.vercel.app) · **Source:** [github.com/lunar2901/ept-kompass](https://github.com/lunar2901/ept-kompass) · **Current release:** [`v0-release`](https://github.com/lunar2901/ept-kompass/releases/tag/v0-release) · See [`PROMPT.md`](./PROMPT.md) for the full product brief.

## Status at v0 (Apr 2026)

- **27 lessons** live across Thermodynamik I and the complete Track 0 refresher.
  - Thermodynamik I Kapitel 1 — Grundbegriffe (6 lessons)
  - Thermodynamik I Kapitel 2 — Erster Hauptsatz (8 lessons)
  - Track 0 — Schulwissen auffrischen (13 lessons, one per topic from §4)
- **28 modules** scaffolded in the curriculum; modules without content display *"bald verfügbar"*.
- **113+ authored exercises** each with hint + Klausur-style solution + ≥2 common mistakes + Diskussion.
- Hierarchical navigation (Track → Module → Chapter → Lesson), persistent sidebar, Klausur-Modus toggle.
- Known gaps: no auth, no SRS, no glossary browser, no plan generator, no PWA. Shipping those is explicitly post-v0.

## Authoring new lessons (for non-developers)

Read [`docs/how-to-add-a-lesson.md`](./docs/how-to-add-a-lesson.md). It is the most important artifact in this repo — a complete, plain-English, no-terminal guide to adding content via Claude.ai + GitHub web UI + Vercel auto-deploy. Uses the compile-guaranteed MDX template; includes a cheat-sheet of the recurring MDX parse traps (`{,}` outside math, `{-n}` in prose, unclosed `$`, non-`\mathrm` units).

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

- `/` — homepage: Tracks → Modules
- `/modul/<slug>` — module overview with chapters and lessons
- `/lektion/<slug>` — a single lesson with the 4-tab exercise result panel
- `/render-test` — math-and-typography rendering gate (every KaTeX/MDX construct)

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

## Supabase (optional for MVP)

The schema lives in `supabase/migrations/` and is only needed for the seeded DB path, auth, and per-user features (notes, SRS, discussions, past-exam uploads). MVP without these runs fine off the filesystem.

**Local Supabase** — for a one-command sandboxed Postgres + Auth + Studio:

```bash
# Install the CLI once (https://supabase.com/docs/guides/cli)
supabase start          # boots Postgres on :54322, Studio on :54323
supabase db reset       # applies migrations 0001 + 0002
```

`supabase/config.toml` is tuned for this workflow (Inbucket on :54324 catches magic-link emails; Google OAuth is off locally and enabled in the dashboard for prod).

**Remote Supabase** — create a free project at [supabase.com](https://supabase.com/), grab the project ref, then:

```bash
supabase link --project-ref <ref>
supabase db push                          # applies all migrations
echo 'NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co' >> .env.local
echo 'NEXT_PUBLIC_SUPABASE_ANON_KEY=...'                  >> .env.local
echo 'SUPABASE_SERVICE_ROLE_KEY=...'                      >> .env.local
npm run seed                              # populates tracks/modules/lessons/glossary
```

Migrations:

| File | What it adds |
| --- | --- |
| `0001_init.sql` | 16 tables · RLS · `touch_updated_at` trigger · auto `profiles` on signup |
| `0002_anonymous_content_reads.sql` | Lets the `anon` role read content tables (MVP runs without auth) |

## Repository layout

```
app/                         # Next.js App Router pages + layout
  page.tsx                   # Tracks → Modules homepage
  modul/[slug]/page.tsx      # module overview (chapters + lessons)
  lektion/[slug]/page.tsx    # lesson renderer with the 4-tab Exercise panel
  (dev)/render-test/         # math-and-typography gate (not in nav)
components/
  lesson-components.ts       # MDX component type contracts (authoritative)
  lesson/                    # implementations imported as @/components/lesson
  site-header.tsx            # top bar with Klausur-Modus toggle
  site-sidebar.tsx           # persistent curriculum tree (desktop + mobile drawer)
  module-card.tsx            # homepage module cards
  breadcrumbs.tsx            # shared breadcrumbs
  klausur-toggle.tsx         # Klausur-Modus on/off (keyboard `k`)
content/                     # the .mdx lessons — source of truth
  track-0/                   # Schulwissen auffrischen (13 topics)
  thermo-1/                  # Thermodynamik I Kap 1+2
docs/
  how-to-add-a-lesson.md     # non-developer authoring guide ⭐
  math-and-typography.md     # KaTeX + MDX rendering spec
lib/
  content.ts                 # filesystem MDX loader
  curriculum-data.ts         # PROMPT.md §4 curriculum (tracks, modules, chapters)
  navigation.ts              # curriculum + filesystem → nav tree
  mdx.ts                     # runtime MDX render pipeline
  supabase/{client,server}.ts
scripts/
  seed-glossary.json
  curriculum.ts              # re-exports from lib/curriculum-data
  seed.ts                    # populates Supabase
supabase/
  migrations/                # 0001_init.sql + 0002_anonymous_content_reads.sql
  config.toml
```

## Pedagogy rules (the short version)

Every lesson has five parts: Intuition · Schlüsselbegriffe · Theorie · Musteraufgabe · Übungen. Every exercise has a **hint**, a full worked **solution**, **common mistakes** (≥ 2), and a **Diskussion** — all pre-authored, all required. No stubs, no thinning.

Every German term in English prose is a `<GermanTerm>` chip. Formulas carry bilingual variable legends. The *Klausur-Modus* toggle hides English, leaving only German for exam simulation.

## Release history

See [`CHANGELOG.md`](./CHANGELOG.md) and the Git tags. Latest: `v0-release`.

## License

Private — MVP in flight.
