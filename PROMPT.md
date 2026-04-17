# Claude Code brief: EPT-Kompass — TU Berlin Energie- und Prozesstechnik study app (v3)

Paste this entire document into Claude Code as your initial instructions. Accompanying files are in the `/starter/` folder — read each one listed in §12 before writing a line of code.

This is the **free-tier, no-AI-required** build. Every piece of teaching content (lesson text, hints, solutions, common mistakes, discussion) is pre-authored into the MDX files and the database. The app has zero external API costs to run for the student.

---

## 0. Who I am, for calibration

I am an international student at TU Berlin, B.Sc. *Energie- und Prozesstechnik* (from SoSe 2026: *Erneuerbare Energien und Verfahrenstechnik*). I am 32. I worked for eight years before moving to Berlin. My German is around B1 — I can order food, but reading a *Thermodynamik* script in German is exhausting. I have **24 months** to graduate. I have not solved a differential equation in twelve years.

When I use this app I am usually: (a) tired, on the U-Bahn home, on my phone; (b) late at night at my desk after work, trying to understand one lecture; (c) panicking two weeks before a Klausur, trying to learn a whole module from scratch.

Build the app for *that* person. Every design decision should answer: **does this help me pass my Klausuren in German, in 24 months, starting from rusty?**

## 1. Product name and positioning

**EPT-Kompass.** A bilingual, self-paced, exam-driven study companion that covers the full B.Sc. EPT curriculum, teaches in English while embedding the exact German vocabulary that appears on Klausuren, and doubles as a 24-month plan generator. Positioning in one sentence: *"Brilliant.org meets a German Lehrbuch."*

## 2. The language policy — the single rule that makes this app different

Every learning unit has all five of these, always:

1. **German term first and always visible** in its lecture-exact form (e.g. *der erste Hauptsatz der Thermodynamik*, *der Massenstrom*, *die Impulsbilanz*, *das Siedediagramm*).
2. **English explanation** as the primary teaching prose.
3. **Inline glossary chips**: every German term in English prose is wrapped in `<GermanTerm>` — click for article, plural, English, IPA, definition, link to glossary.
4. **Formulas in universal LaTeX notation with bilingual variable legends** — every symbol gets a row: *symbol — German name — English name — SI unit*.
5. **Exercise questions written in German, in TU Berlin Klausur style**, with English translation toggle, and **full pre-authored solutions, common-mistakes lists, and Diskussion sections** explained step-by-step in English while keeping every intermediate quantity labelled with its German name.

**Klausur-Modus** is a UI toggle that hides all English text and translation chips, leaving only the German — so I can simulate an exam from the lesson I studied yesterday.

## 3. Pedagogy — no AI, fully static, better than AI

EPT-Kompass has **no AI tutor**. This is a deliberate choice, not a limitation:

- AI hallucinates. On a first-year thermodynamics question it is usually right, on an edge case it invents things, and on an exam-format derivation it drifts. None of that is acceptable when the student is preparing for a graded Klausur.
- AI costs money. The student should be able to use EPT-Kompass for free, forever, on a free Supabase plan and a free Vercel plan.
- AI replaces the thing that actually works: carefully authored explanations, written once, correct forever.

Instead, every exercise carries **four pre-authored pedagogical components** (see `/starter/components/lesson-components.ts`):

1. **Hint** — one gentle nudge for when the student is stuck but does not want the answer.
2. **Full worked solution** in TU Berlin Klausur format (*Gegeben / Gesucht / Annahmen / Systemgrenze / Lösungsweg / Ergebnis*).
3. **Common mistakes** — 2–4 specific wrong answers, with 2–5 sentences each diagnosing why the reasoning trap is tempting and what the correct reasoning is. This is where the app earns its keep: most learning failure is predictable, and naming the mistake before the student makes it (or right after) is the single most powerful teaching intervention.
4. **Diskussion** — variations of the problem, edge cases, connections to later modules, practical/historical notes. A student who got the answer right should still read this; it is where exam-level understanding lives.

In place of a chat with an AI, the app has:

- **My Notes** per lesson — a markdown box the student can scribble in, private to their account (`lesson_notes` table).
- **Discussion** per lesson and per exercise — a threaded forum where students can ask each other questions (`discussions` table). Future addition; shipped as stub at MVP.

See `/starter/content/thermo-1/kap-1/01-system-und-umgebung.mdx` for the reference implementation of an exercise with all four pedagogical components. Every exercise in every lesson must match that depth. No stubs.

## 4. Curriculum to cover

Scaffold the **complete B.Sc. curriculum** as module + chapter rows (§8 tells you which lessons to *fill* vs *stub*). Tracks:

- **Track 0 — Schulwissen auffrischen** (prerequisite refresher, 4–6 weeks): Bruchrechnen · Potenzen · Logarithmen · Binomische Formeln · lineare + quadratische Gleichungen · Trigonometrie + Einheitskreis · Vektorrechnung-Grundlagen · Differenzieren · Integrieren · SI-Einheiten + Einheitenumrechnung · Stöchiometrie + Molrechnung · Newton'sche Mechanik auf Schulniveau · Wahrscheinlichkeit + einfache Statistik.

- **Track A — Mathematical and scientific foundations (Sem. 1–2):** Analysis I & II für Ingenieure · Lineare Algebra für Ingenieure · Allgemeine und Anorganische Chemie · Organische Chemie Grundlagen · Physik für Ingenieure · Informatik für Ingenieure.

- **Track B — Engineering core (Sem. 2–4):** Technische Mechanik · Thermodynamik I und II · Strömungslehre · Wärme- und Stoffübertragung · Mess- und Regelungstechnik · Elektrotechnik · Werkstoffkunde · Maschinenelemente.

- **Track C — Process and energy specialisation (Sem. 4–6):** Mechanische VT · Thermische VT · Chemische VT / Reaktionstechnik · Energietechnik · Regenerative Energien · Gebäude- und Sanitärtechnik · Anlagentechnik · Bioverfahrenstechnik.

- **Track D — Context and skills:** Wirtschaftswissenschaftliche Grundlagen · Nachhaltigkeit und LCA · Wissenschaftliches Arbeiten auf Deutsch.

## 5. Lesson structure (fixed, uniformly applied)

Every lesson is an MDX file with this exact five-part structure — see the reference lessons. Do not invent a sixth section; do not skip a section.

1. **Intuition first** (English, 2–3 short paragraphs).
2. **Schlüsselbegriffe** (`<VocabBlock>`): 5–15 Fachbegriffe with article, plural, IPA, English, one example sentence in both languages.
3. **Theorie**: definitions, formulas in `<FormulaCard>`, derivations collapsed by default.
4. **Musteraufgabe**: one TU-Berlin-Klausur-style problem solved step by step.
5. **Übungen** (`<Exercise>`): 5–10 exercises tagged *easy / medium / klausur*, each with **hint + full solution + common mistakes + Diskussion** (see §3).

Every lesson ends with a **"Klausur-Tipp"** callout and a one-sentence bridge to the next lesson.

## 6. Features — MVP scope

**6.1 Auth and onboarding.** Supabase Auth with email magic link + Google OAuth. Onboarding wizard captures target graduation date (default today + 730 days), current semester, German level (A2/B1/B2). Profile auto-created via trigger in the schema.

**6.2 Dashboard ("Mein Stundenplan").** Week + month view. Today's recommended lessons, SRS reviews due, upcoming mock-exam dates. Module progress rings, global "graduation readiness" ring. 24-month plan generator distributing lessons across weeks respecting prerequisites and semester order; drag-to-reschedule auto-rebalances.

**6.3 Lesson player.** Two-pane on desktop (content left, sticky panel right with tabs: *Glossar* · *Formeln* · *Meine Notizen*). Bottom-sheet tabs on mobile. KaTeX for maths. Mermaid for diagrams. Recharts for interactive plots. Klausur-Modus toggle.

**6.4 Exercise engine.** Six question types: numeric (auto-checks unit + tolerance, ±1 % default) · multiple_choice · multi_select · short_derivation (mathjs normalises LaTeX) · order_steps (drag to reorder) · label_diagram (click SVG hotspots). 

On submission the result panel opens with **four tabs**: *Lösung* (full worked solution), *Häufige Fehler* (common mistakes, with the student's wrong answer pre-highlighted if it matches), *Diskussion* (variations and connections), *Meine Antwort* (what the student submitted + grader trace). Tracking: `exercise_attempts` records `saw_hint`, `saw_solution` booleans so the SRS algorithm can prioritise reviews of exercises where the student peeked.

**6.5 Formelsammlung.** Searchable master list of every formula. Each entry: names (DE/EN), LaTeX, variable legend, SI units, typical application, links to the lesson + exercises. Per-module PDF export.

**6.6 Fachwörterbuch (glossary).** Seed with `/starter/scripts/seed-glossary.json` (~80 entries). Expand to ≥ 1 500 over the curriculum. Each entry: article + plural, English, IPA, DE + EN definitions, example sentences, cross-links. Pronunciation via Web Speech API (built into browsers, free, DE voice).

**6.7 Wiederholung (spaced repetition).** FSRS algorithm. Queue auto-populated from: glossary terms encountered, formulas from completed lessons, exercises the student got wrong. 30 cards/day default, adjustable. Surfaced on dashboard.

**6.8 Altklausuren.** User uploads past-exam PDFs (we do not distribute copyrighted material). Per exam: title, module, date. Questions can be tagged to lessons. "Mock-exam mode": timed, pure German, random assembly from the tagged pool, solutions revealed at the end.

**6.9 Meine Notizen + Diskussion.** Per-lesson markdown notebook (private, `lesson_notes` table). Per-lesson and per-exercise discussion thread (public to authenticated users, `discussions` table). These replace the AI tutor: students learn from curated static content + their own writing + each other.

**6.10 Offline + mobile.** Full responsive, mobile-first. PWA: service worker caches the last 30 opened lessons + the full glossary + the Formelsammlung for offline U-Bahn study.

## 7. Technical stack

**Frontend.** Next.js 14+ App Router · TypeScript strict · Tailwind · shadcn/ui · **KaTeX + rehype-katex + remark-math** (see §10 and `/starter/docs/math-and-typography.md`) · Mermaid · Recharts · mathjs · Zustand · TanStack Query where needed · next-intl for DE/EN UI · PWA.

**Backend.** Supabase — Postgres, Auth, Row-Level Security, Storage for past-exam PDFs. Lesson bodies stored as MDX text in `lessons.body_mdx`; authored as files in `content/` and loaded by the seed script. **Exercise payload stored as JSONB** in `exercises.payload` — one column holds hint, solution_mdx, common_mistakes, discussion_mdx, plus type-specific fields.

**Deployment.** Vercel for the Next.js app, Supabase cloud for the database + auth + storage. Both have free tiers sufficient for early use. Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`. **No AI API keys required.**

## 8. Data model

Schema: `/starter/supabase/migrations/0001_init.sql`. 16 tables with RLS. Read it end-to-end before writing code. Notable:

- Content tables (`tracks`, `modules`, `chapters`, `lessons`, `formulas`, `glossary_terms`, `exercises`) are world-readable to authenticated users; written only by the seed script via the service-role key.
- Per-user tables are strictly owner-only via RLS.
- `lessons.body_mdx` stores MDX verbatim; seeding reads `content/**/*.mdx` and upserts rows.
- `exercises.payload` (jsonb) carries the full pedagogical payload — see the column comment in the SQL for the structure.
- `lesson_notes` is the student's private scratchpad per lesson.
- `discussions` is the student-to-student threaded forum.
- `profiles` auto-populated via trigger on signup.

## 9. Content depth benchmark — what "done" means on day one

Ship the app with:

- **Track 0** fully: all 13 topics listed in §4, each with ≥ 3 lessons, ≥ 5 exercises per lesson. Every exercise has hint + solution + common mistakes + Diskussion (§3). No stubs.
- **Thermodynamik I, Kapitel 1 (Grundbegriffe)**: 6 lessons — System & Umgebung (reference) · Zustandsgrößen intensiv vs. extensiv · Zustand & Prozess · thermodynamisches Gleichgewicht · Zustandsgleichung ideales Gas · reale Gase Einführung. Each with full exercises.
- **Thermodynamik I, Kapitel 2 (Erster Hauptsatz)**: 8 lessons — Arbeit & Wärme als Prozessgrößen · innere Energie U · Enthalpie H · Energiebilanz geschlossenes System · Energiebilanz offenes System stationär · Volumenänderungsarbeit · Wellenarbeit · Anwendungen (Drossel, Turbine, Verdichter). Each with full exercises.

Every other module/chapter exists as rows with `lessons.status = 'stub'` and a placeholder body. This keeps the 24-month plan generator working from day one.

**Writing all these exercises is the longest task in the build.** Budget accordingly. Match the depth of the reference exercises — do not thin them out because you are running low on steam.

## 10. Math rendering — the rules that must be followed

See `/starter/docs/math-and-typography.md` for the full specification. Highlights:

- **KaTeX, not MathJax.** Server-side render with `rehype-katex` configured `output: "htmlAndMathml"` (MathML needed for screen readers). Import `katex/dist/katex.min.css` once in the root layout.
- **Inline maths with single `$`**, display maths with `$$` on its own lines.
- **Always wrap units in `\mathrm{}`** and thin-space with `\,`: `$300\,\mathrm{K}$`, never `$300 K$` (which renders K italic).
- **Process differentials with `\delta`** (or the crossed-d note), **state differentials with `\mathrm{d}`**.
- **Never embed images of formulas.** Not accessible, not zoomable, not dark-mode compatible.
- Create a rendering test page at `app/(dev)/render-test/page.tsx` containing every construct that any lesson uses. It must render cleanly before merging changes to the MDX pipeline.
- Font stack: Inter for UI, Source Serif 4 for lesson body, JetBrains Mono for code. Loaded via `next/font` with `display: "swap"`.

## 11. UI / UX rules

- **Two-pane lesson view on desktop.** Left: content. Right (sticky): tabs for *Glossar dieser Lektion* · *Formeln* · *Meine Notizen*. Mobile: bottom-sheet tabs.
- **Breadcrumb on every content page.** Track → Modul → Kapitel → Lektion.
- **Keyboard shortcuts.** `g` next lesson, `G` previous, `?` shortcut help, `/` focus search, `h` toggle hint on current exercise, `r` reveal solution, `n` open Meine Notizen, `Esc` close any panel.
- **Dark mode default**, warm light mode. Accent colour muted teal. Serif for lesson body, sans for UI.
- **Accessibility.** Semantic HTML, ARIA on custom components, contrast ≥ 4.5:1, every diagram has text alternative, every interactive element keyboard-reachable.
- **Performance.** First-load JS on a lesson page under 200 kB. Heavy plots/diagrams lazy-load. Lighthouse ≥ 90 before merging.
- **Tone.** Calm, academic, slightly wry. No gamification confetti. No cartoon mascots. Adults who are tired.

## 12. Starter files you have been given

Read every file in `/starter/` before writing application code. These are specifications, not examples.

- **`/starter/content/thermo-1/kap-1/01-system-und-umgebung.mdx`** — the reference lesson. Every lesson must match its depth, structure, and exercise pedagogy. When in doubt about lesson format, open this file.
- **`/starter/content/track-0/logarithmen/01-logarithmen-grundlagen.mdx`** — the reference Track 0 refresher. Shows how to teach rusty high-school maths to adults without condescending.
- **`/starter/supabase/migrations/0001_init.sql`** — the database schema, final. 16 tables, RLS, triggers. Use verbatim.
- **`/starter/components/lesson-components.ts`** — MDX component contracts including the exercise pedagogical payload (hint / solution / common mistakes / discussion). Implement once.
- **`/starter/docs/math-and-typography.md`** — the rendering specification. Every math-display rule lives here.
- **`/starter/scripts/seed-glossary.json`** — glossary seed (~80 entries). Import into `glossary_terms`. Expand to ≥ 1 500.

## 13. Work plan — execute in order, commit after each step

1. **Scaffold.** `create-next-app` (TS, App Router, Tailwind, ESLint). Add shadcn/ui, KaTeX, rehype-katex, remark-math, Mermaid, Recharts, mathjs, next-intl, `@supabase/ssr`, `@supabase/supabase-js`, Prettier, Husky. Wire pre-commit format + lint. Import KaTeX CSS in root layout.
2. **Supabase.** Copy `/starter/supabase/migrations/0001_init.sql`. Add `supabase/config.toml`. Document `supabase start` in README.
3. **Math rendering test page.** Build `app/(dev)/render-test/page.tsx` per `/starter/docs/math-and-typography.md` §7. Verify every construct renders cleanly before moving on. This is non-negotiable — maths being broken anywhere poisons every downstream lesson.
4. **Auth + onboarding.** Magic-link login, Google OAuth, middleware-protected routes, onboarding wizard writing to `profiles`.
5. **MDX pipeline + lesson renderer.** Implement every component from `/starter/components/lesson-components.ts`. Build the two-pane lesson layout. The Exercise component must support the result panel with four tabs (Lösung · Häufige Fehler · Diskussion · Meine Antwort). Ship the reference lesson end-to-end: visible, rendered, clickable glossary chips, working exercise submission, result panel shows the full pre-authored feedback, SRS card generation on wrong answers.
6. **Seed content.** `scripts/seed.ts` walks `content/**/*.mdx`, parses frontmatter, upserts `tracks/modules/chapters/lessons/formulas/exercises`. Import `/starter/scripts/seed-glossary.json` into `glossary_terms`. Scaffold every module/chapter from §4 as stubs.
7. **Fill the reference content slice.** Track 0 (all 13 topics) + Thermodynamik I Kapitel 1–2 (14 lessons) per §9. Match the reference depth. **This is the largest task in the plan.**
8. **Exercise engine.** Numeric-with-unit first (hardest grader), then multiple_choice + multi_select, then short_derivation (mathjs normalisation), then order_steps, then label_diagram. Every submission writes to `exercise_attempts` with `saw_hint` and `saw_solution` tracked.
9. **Glossary + Formelsammlung pages.** Read-only browsers with fulltext search (pg_trgm already enabled), filters by module, per-module PDF export of the Formelsammlung.
10. **Spaced repetition.** FSRS implementation; daily queue page; SRS session UI with Web Speech API pronunciation for terms.
11. **24-month plan generator.** Topologically sort lessons by prerequisites, respect semester order, distribute across weeks from start to target graduation, cap weekly load (default 8 hours estimated). Drag-to-reschedule rebalances forward chain.
12. **Meine Notizen + Diskussion.** Markdown notes per lesson (private). Threaded discussion forum per lesson and per exercise (public). Report/hide minimal moderation.
13. **Altklausuren.** Upload → Supabase Storage, PDF preview, per-question tagging, mock-exam timer mode.
14. **PWA + offline.** Service worker, manifest, offline fallback page, cache strategy for lessons + glossary + Formelsammlung.
15. **Polish.** Dark/light mode, keyboard shortcuts, a11y pass (axe-core clean), Lighthouse ≥ 90.
16. **Deploy.** Vercel project, Supabase cloud, env vars in `.env.example`, production smoke test.

## 14. Non-negotiables — confirm in your first reply before writing code

Before you start step 1, reply with a short plan confirming you understand:

1. The **language policy in §2** (German always visible · English explanations · bilingual formulas · Klausur-Modus · glossary chips).
2. The **no-AI pedagogy in §3** — every exercise ships with pre-authored hint + full solution + common mistakes + Diskussion. You do not add an AI tutor. You do not use any AI API at runtime.
3. **Content depth must match §9** for the reference slice before anything else is "done". You do not thin it out because you are running low on steam.
4. The stack is **Next.js + Supabase + Vercel**. No AI APIs. No substitutions without asking.
5. **Math rendering follows `/starter/docs/math-and-typography.md` to the letter.** The rendering test page in step 3 is the gate; you do not proceed past it until every construct renders cleanly.
6. You will **commit after each numbered step in §13** and will not skip ahead.

Then proceed with step 1.

---

## Appendix A — optional paid-tier additions (ship only after MVP is solid)

Only if the student *wants* an AI tutor later, it can be added as an opt-in feature:

- Add an env var `GEMINI_API_KEY` (Google Gemini has a free tier — the student can sign up for their own key).
- A *Hiwi-Bot* panel, disabled by default, that only appears if a key is configured.
- Clear UI: *"Using your own free Google Gemini key. EPT-Kompass itself is free."*

This is strictly optional. The app ships fully usable without it.

## Appendix B — future roadmap (after MVP)

- **Lerngruppe**: invite 2–4 students, shared progress, co-solve exercises.
- **Moses/ISIS iCal import** for real TU Berlin course dates.
- **Lecture transcription**: upload a German lecture recording, use browser Web Speech API or local Whisper (free, offline, no API cost) to transcribe and auto-link glossary terms.
- **Schreibwerkstatt**: offline grammar helper for *Protokolle* and bachelor thesis. Options: LanguageTool (free, open source, self-hostable) or the free tier of Grammarly for DE.
- **Native mobile** via Capacitor once the PWA is proven.

## Appendix C — why this project matters

The B.Sc. EPT at TU Berlin teaches in German. The Klausuren are in German. International students who pass it become some of the most employable engineers in Europe — they speak the language of the Energiewende literally. But the dropout rate in the first two years is high, and it is rarely because the students are not smart. It is because nobody taught them *Zustandsgröße* in a language they could actually think in. This app is for them.
