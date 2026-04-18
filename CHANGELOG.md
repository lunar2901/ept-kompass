# Changelog

All notable changes to EPT-Kompass. Dates in ISO format. Newest first.

## v0-release — 2026-04-18

First usable public build.

### Content

- **Thermodynamik I Kapitel 1 — Grundbegriffe** complete (6 lessons):
  System & Umgebung · Zustandsgrößen intensiv/extensiv · Zustand und Prozess · thermodynamisches Gleichgewicht · Zustandsgleichung ideales Gas · reale Gase Einführung.
- **Thermodynamik I Kapitel 2 — Erster Hauptsatz** complete (8 lessons):
  Arbeit und Wärme als Prozessgrößen · innere Energie · Enthalpie · Energiebilanz geschlossen · Energiebilanz offen (stationär) · Volumenänderungsarbeit · Wellenarbeit · Anwendungen (Drossel, Turbine, Verdichter).
- **Track 0 — Schulwissen auffrischen** all 13 topics covered:
  Bruchrechnen · Potenzen · Logarithmen · Binomische Formeln · lineare und quadratische Gleichungen · Trigonometrie · Vektorrechnung · Differenzieren · Integrieren · SI-Einheiten · Stöchiometrie · Newton'sche Mechanik · Wahrscheinlichkeit und einfache Statistik.
- **113+ authored exercises** total. Every exercise ships with hint + Klausur-format solution + ≥ 2 common-mistake diagnoses + Diskussion (≥ 150 words).

### Navigation and UX

- Homepage: 5 Track sections with 28 Module cards (DE + EN titles, descriptions, "X von Y Lektionen verfügbar").
- `/modul/[slug]` pages for all 28 modules. Chapters as collapsible sections (open by default). Modules without lessons display a dashed "bald verfügbar" placeholder so the full curriculum is visible from day one.
- Persistent curriculum sidebar: sticky column on desktop, slide-in drawer on mobile (menu button in header).
- Breadcrumbs on every content page: *Start › Track B › Thermodynamik I › Kap. 1 › System und Umgebung*.
- Klausur-Modus toggle in the top bar everywhere; keyboard shortcut **k**. Persists across page loads.

### Platform

- Next.js 16 (App Router, React 19), Tailwind v4, KaTeX + remark-math + rehype-katex, `next-mdx-remote/rsc` for runtime MDX, Radix UI primitives, lucide-react icons.
- Fonts: Inter (sans), Source Serif 4 (serif for lesson body), JetBrains Mono (code), all via `next/font`.
- Production deploy: Vercel (https://ept-kompass.vercel.app). CDN-backed, SSG for every module and every published lesson.
- Supabase schema ready (16 tables, RLS) with an `anon`-read migration — not wired to the app yet; MVP reads content from the filesystem.

### Docs

- `docs/how-to-add-a-lesson.md` — complete non-developer authoring guide: Claude.ai prompting, GitHub web-UI workflow, Vercel auto-deploy, troubleshooting cheat-sheet, compile-guaranteed MDX skeleton.
- `docs/math-and-typography.md` — KaTeX + MDX rendering spec.

### Known not-shipped (explicitly post-v0)

- Auth (Supabase magic link + Google OAuth)
- Spaced repetition / Wiederholungs-Modus
- Glossary browser page
- Formelsammlung page + PDF export
- 24-month plan generator
- Per-lesson notes · discussion forum
- Past-exam upload (Altklausuren)
- PWA (service worker, offline cache)
- Track A, C, D modules have placeholder entries but no lesson content
- Track 0 modules currently have 1 lesson each; §9 targets ≥ 3 per module

### Verified

- Reference lesson "System, Umgebung und Systemgrenze" verified in a real browser (Chromium via Claude Preview):
  - Inline + display KaTeX math renders with MathML + HTML dual output
  - All 4 exercises present; 4-tab result panel (Lösung · Häufige Fehler · Diskussion · Meine Antwort) opens on submit
  - Klausur-Modus toggle adds `.klausur-mode` to `<html>`; `klausur-hide-en`-tagged English spans become `display: none`
