# How to add a new lesson to EPT-Kompass

A complete, non-developer guide. You will:

1. Write the lesson as an MDX file, with the help of Claude.ai.
2. Commit it to the GitHub repo using github.com — no terminal needed.
3. Let Vercel auto-deploy it.
4. Open the live page to confirm it appears.

Time from first idea to live lesson: roughly **30–60 minutes** once you have the habit.

If anything in this document is out of date, the source of truth for the format is the two reference lessons in `content/`:

- `content/thermo-1/kap-1/01-system-und-umgebung.mdx` (reference Thermodynamik lesson)
- `content/track-0/logarithmen/01-logarithmen-grundlagen.mdx` (reference Track-0 lesson)

Any lesson that looks structurally like those two will work.

---

## One-time setup (skip if already done)

Before your first lesson you need three pieces in place. Each takes about five minutes.

### 1. A GitHub account and a repository

1. Sign up at [github.com](https://github.com) if you don't have an account.
2. Ask Claude.ai (or whoever set up your Vercel) for the name of the EPT-Kompass repository. It's usually `<yourname>/ept-kompass`.
3. Bookmark the repository page. Everything in this guide happens there.

### 2. Vercel linked to the repository

1. Go to [vercel.com](https://vercel.com), sign in with GitHub.
2. In Vercel's dashboard, open the `ept-kompass` project.
3. Go to **Settings → Git**. Confirm the project is connected to the right GitHub repository and that the "Production Branch" is `main`.
4. Enable **Automatic deployments from Git** if it isn't already. This makes every commit to `main` automatically trigger a rebuild and redeploy.

Once the two are linked, pushing a commit to `main` on GitHub will trigger a Vercel build within seconds.

### 3. A regular Claude.ai subscription or free account

You don't need Claude Code for this — regular [claude.ai](https://claude.ai) chat is enough to author MDX content.

---

## The recipe — write, commit, deploy

### Step 1 — Pick your topic and folder

Every lesson lives under `content/` in a folder matching its **module** and **chapter**:

```
content/
  <track-prefix>/
    <chapter-slug>/
      <lesson-number>-<lesson-slug>.mdx
```

The allowed track prefixes and chapter slugs are whatever you see in the existing `content/` folders. The two most common cases:

| You're writing a lesson about … | It goes under … |
| --- | --- |
| A refresher topic (Bruchrechnen, Logs, Vektoren, Stöchiometrie, …) | `content/track-0/<topic>/NN-<slug>.mdx` |
| A Thermodynamik I chapter | `content/thermo-1/kap-<N>-<name>/NN-<slug>.mdx` |

Concrete example: *"Enthalpie-Definition"* is Lesson 3 of Thermodynamik I's Kapitel 2, so:

```
content/thermo-1/kap-2-erster-hauptsatz/03-enthalpie.mdx
```

The `NN-` number at the start of the filename controls ordering inside the chapter (01, 02, 03, …). The folder name becomes the URL segment, so **no spaces, no umlauts, no capital letters** in slugs — use hyphens only.

If your topic is in a module that doesn't exist yet in `content/`, you can:

- Option A (recommended): stick to the existing modules. There is plenty of work to write content for `schulwissen-auffrischen` and `thermodynamik-1` before starting a new module.
- Option B: add a new module. Tell Claude.ai "please add a new module to `lib/curriculum-data.ts` with code XYZ under Track B, plus a chapter folder" and commit both files. The curriculum code is declarative — one entry per module.

### Step 2 — Ask Claude.ai to draft the lesson

Open a fresh conversation at [claude.ai](https://claude.ai) and use the prompt below. **Copy it exactly**, then fill in your topic.

> I'm adding a new lesson to EPT-Kompass, a bilingual TU Berlin EPT study
> app. Please write the MDX body of a lesson about **«your topic here»**.
>
> Constraints, no exceptions:
>
> 1. Use exactly the structure of the reference lesson I'll paste below:
>    frontmatter, Intuition Callout, Schlüsselbegriffe VocabBlock, Theorie
>    section with FormulaCards, Musteraufgabe with details/summary, then
>    4–6 Exercises, then an exam-tip Callout, then "Was kommt als
>    Nächstes".
> 2. Every Exercise must have all four pedagogical components filled in:
>    `hint_en`, `solution_mdx`, `common_mistakes` (at least 2 items each
>    with `wrong` and `why_en`), and `discussion_mdx` (at least 150
>    words).
> 3. LaTeX: ALWAYS wrap every number-with-comma in `$...$` math
>    delimiters. Never write `0{,}5` in plain prose — MDX will break.
>    Either write `0,5` as plain text, or `$0{,}5$` inside math.
> 4. Do not write `{-n}`, `{-3}`, or any other `{` followed by a minus
>    sign outside of `$...$` math. MDX parses it as JSX and crashes.
> 5. Write the teaching prose in English. German terms wrapped in
>    `<GermanTerm>` chips. Questions in German, translations in English.
> 6. Match TU-Berlin Klausur style for every Musteraufgabe and Exercise
>    solution: `Gegeben / Gesucht / Annahmen / Lösungsweg / Ergebnis`.
>
> Here is the reference lesson to match in structure and depth:
>
> ```mdx
> «paste content/thermo-1/kap-1/01-system-und-umgebung.mdx here»
> ```

The reference lesson is long — don't worry, pasting the whole thing is exactly what Claude.ai needs. The assistant will produce a full `.mdx` body, frontmatter and all.

**Read what it gives you back** and sanity-check: do the exercises look substantial? Is every `solution_mdx` filled in, not a stub? Are there at least 2 common mistakes per exercise? If something is thin, say "make exercise 3 deeper — full Klausur-style solution, 3 common mistakes, 250+ words of Diskussion" and it will redo just that exercise.

### Step 3 — Use the frontmatter template

The top of every MDX file must look like this. Use the template; just fill in your values.

```yaml
---
id: track-0-<module>-l<N>              # unique id, no spaces
module: <module-code>                  # must match a code in lib/curriculum-data.ts
chapter: <chapter-code>                # must match a declared or filesystem chapter
position: <N>                          # 1, 2, 3 … order within the chapter
name_de: "<German title>"
name_en: "<English title>"
estimated_minutes: <number>            # 15, 20, 25, 30 …
prerequisites: ["<other-lesson-id>"]   # array; can be [] if none
status: published                      # "stub" | "draft" | "published"
---

import { GermanTerm, FormulaCard, Exercise, Callout, VocabBlock } from "@/components/lesson"

<... lesson body ...>
```

**Look up the module and chapter codes** in `lib/curriculum-data.ts`. If the chapter you want doesn't exist there yet, you can still drop your file in a sensibly-named folder under `content/` — the navigation will discover it from the filesystem with the folder slug as the chapter name. If you want a pretty chapter title, add an entry to the `CHAPTERS` array in `lib/curriculum-data.ts`.

### Step 4 — Commit the file via github.com (no terminal)

1. Open your repository on GitHub in the browser.
2. Navigate into the right folder: `content` → `<track-prefix>` → `<chapter>`.
3. Click **"Add file" → "Create new file"** in the top right.
4. In the filename box at the top, type the full path if you're creating a new folder, or just the filename if the folder already exists. Example: `02-zustandsgroessen.mdx`. (To create a new folder as well, type `kap-3-new-chapter/01-first.mdx` and GitHub will make the subfolder automatically.)
5. Paste the MDX that Claude.ai gave you into the big text area.
6. Scroll to the bottom. Under **"Commit new file"**:
   - Short title: `content: add lesson «N — topic» to «module»`
   - Optional extended description.
   - Leave **"Commit directly to the main branch"** selected.
7. Click the green **"Commit new file"** button.

That's it — you just pushed a change. Vercel now starts building.

**Editing an existing lesson** is the same flow: click the file on GitHub, click the pencil icon in the top right to edit, paste changes, commit.

### Step 5 — Watch the Vercel deploy log

1. Go to the [Vercel dashboard](https://vercel.com/dashboard).
2. Click the `ept-kompass` project.
3. You'll see the latest deployment at the top, usually with a "Building" status.
4. Click it to open the deployment detail page.
5. Follow the **Build Logs** tab. A green "Ready" banner at the top means success; a red "Error" banner means the build failed.

Build typically takes **60–90 seconds**.

### Step 6 — Open the live page

Your lesson is accessible at:

```
https://ept-kompass.vercel.app/lektion/<slug>
```

where `<slug>` is the hyphen-joined path: `<track>-<chapter>-<filename-without-extension>`. For `content/thermo-1/kap-2-erster-hauptsatz/03-enthalpie.mdx`:

```
https://ept-kompass.vercel.app/lektion/thermo-1-kap-2-erster-hauptsatz-03-enthalpie
```

You can also get there by clicking through the homepage → module → chapter → lesson.

---

## Troubleshooting

### The Vercel build failed — what now?

On the Vercel deployment page, open **Build Logs** and scroll down. The error is usually one of three things.

#### Error: "Could not parse expression with acorn"

Meaning: MDX tried to interpret a `{...}` as a JavaScript expression and choked. Almost always caused by:

- **`{,}` in plain text outside `$...$` math.** E.g., writing `2{,}5 kg` in prose. Fix: write `2,5 kg` as plain text, or `$2{,}5\,\mathrm{kg}$` inside math delimiters.
- **`{-n}`, `{-3}`, etc. outside math.** MDX parses the `{` as a JSX expression start and tries to evaluate `-n`, fails because `n` isn't defined. Fix: either move it inside `$...$`, or rewrite as `(-n)` without braces.

Easiest triage: open the failed lesson file on GitHub, click pencil, find the problem line (the error usually says which lesson), fix the offending `{...}`, commit.

#### Error: "ReferenceError: n is not defined" (or similar)

Same root cause as above. Some `{letter}` in prose was interpreted as JSX expression referring to an undefined variable. Same fix.

#### Error: mentioning a missing file or import

If your file tries to import something exotic, drop the import. The only import you need at the top of every lesson is:

```
import { GermanTerm, FormulaCard, Exercise, Callout, VocabBlock } from "@/components/lesson"
```

### The build succeeded but my lesson doesn't appear on the site

1. **Hard-refresh** the browser (Ctrl+F5 / Cmd+Shift+R). Vercel CDN caches aggressively.
2. Check the **filename**. It must end in `.mdx`, not `.md` or `.MDX`.
3. Check the **frontmatter**. `status: published` — anything else (`stub`, `draft`) is filtered out of the homepage listing but will still render at its URL if you go directly.
4. Check the **slug** you typed in the URL matches the one the app computed. The formula is:
   - Take the file path under `content/`.
   - Replace `/` with `-`.
   - Drop the `.mdx` extension.
5. Check the Vercel deployment you're looking at is actually the production one. The tab title on the deploy page will say "Production" for the live URL.

If the lesson appears on the homepage / module page but the URL says 404, it's usually a typo in the slug.

### My lesson renders but the math looks wrong

1. Check every `$...$` is closed. An odd number of `$` signs breaks everything after the last one.
2. Check units are wrapped in `\mathrm{}`: `$T = 300\,\mathrm{K}$`, not `$T = 300 K$`.
3. Check display math (`$$...$$`) is on its own lines with blank lines above and below — otherwise MDX sometimes squashes it.
4. Visit `/render-test` on the live site. That page has every math construct the app supports, known good. If it renders, your pipeline is fine and the bug is in your MDX; if it doesn't render, something deeper broke (revert your latest commit on GitHub).

### I want to change something in an existing lesson

Same flow as creating:

1. GitHub → navigate to the file → click pencil icon.
2. Edit the MDX.
3. Commit with a message like `content: fix typo in thermo-1 kap-2 L3`.
4. Wait for Vercel.

GitHub keeps the full history — every edit is revertible via the **History** button on any file.

### I accidentally broke the site

Open your repo on GitHub, click **Commits** (next to the branch name), find the commit that broke things, click the **"..."** menu, select **Revert**. GitHub creates a revert commit automatically, Vercel redeploys, site comes back.

No terminal needed.

---

## The MDX reference template (copy this)

When in doubt, paste this skeleton into a new file and fill in the blanks. It is guaranteed to compile.

```mdx
---
id: track-0-bruchrechnen-l1
module: schulwissen-auffrischen
chapter: bruchrechnen
position: 1
name_de: "Lessons-Titel auf Deutsch"
name_en: "Lesson title in English"
estimated_minutes: 20
prerequisites: []
status: published
---

import { GermanTerm, FormulaCard, Exercise, Callout, VocabBlock } from "@/components/lesson"

<Callout variant="intuition">

## Why this concept exists

Two to three short paragraphs of English prose. Mention the relevant
German terms inline like <GermanTerm de="die Bruchrechnung" article="die" en="fraction arithmetic" />.

</Callout>

## Schlüsselbegriffe

<VocabBlock>
  - term: das Beispielwort
    en: example word
    plural: die Beispielwörter
    ipa: /ˈbaɪ̯ʃpiːlvɔʁt/
    example_de: "Ein kurzer deutscher Beispielsatz."
    example_en: "A short English example sentence."
</VocabBlock>

## Theorie

English prose with **bold**, *italic*, inline math $x^2 + y^2 = z^2$, and display math:

$$
a^2 + b^2 = c^2
$$

<FormulaCard
  name_de="Name auf Deutsch"
  name_en="Name in English"
  latex="F = m \cdot a"
  variables={[
    { symbol: "F", name_de: "Kraft", name_en: "force", unit: "N" },
    { symbol: "m", name_de: "Masse", name_en: "mass", unit: "kg" },
    { symbol: "a", name_de: "Beschleunigung", name_en: "acceleration", unit: "m/s^2" },
  ]}
>
Optional MDX body — derivation, caveats, physical intuition.
</FormulaCard>

## Musteraufgabe

> **Aufgabe.** Stellen Sie die Aufgabe in Deutsch, Klausur-Stil.

<details>
<summary>**Lösungsweg (English)**</summary>

Step-by-step English solution with **Gegeben / Gesucht / Lösungsweg / Ergebnis**.

</details>

## Übungen

<Exercise
  id="track-0-bruchrechnen-l1-ex1"
  difficulty="easy"
  type="multiple_choice"
  question_de="Eine Frage auf Deutsch im Klausur-Stil?"
  question_en="The same question in English."
  options={[
    { id: "a", de: "Option A auf Deutsch", en: "Option A in English" },
    { id: "b", de: "Option B auf Deutsch", en: "Option B in English" },
    { id: "c", de: "Option C auf Deutsch", en: "Option C in English" },
    { id: "d", de: "Option D auf Deutsch", en: "Option D in English" },
  ]}
  correct="b"
  hint_en="One gentle nudge in English. Not the answer."
  solution_mdx={`
**Correct answer: (b) …**

Full Klausur-style solution in English, with math if helpful:
$\\int_0^\\infty e^{-x}\\,\\mathrm{d}x = 1$.

Explain WHY the answer is correct, not just that it is.
  `}
  common_mistakes={[
    {
      wrong: "a — short label of the wrong answer",
      why_en: "Two to five sentences diagnosing why this wrong answer is tempting and what the correct reasoning should be.",
    },
    {
      wrong: "c — short label of another wrong answer",
      why_en: "Same treatment. Students reach this conclusion when …",
    },
  ]}
  discussion_mdx={`
**One-line intriguing heading.**

At least 150 words of Diskussion: variations on the problem, edge cases,
connections to other lessons, historical or practical notes. This is
where exam-level understanding lives.

**A second heading for a second angle.**

Another angle or variation. Aim for texture and depth — the student
reads this AFTER answering to deepen their understanding.
  `}
/>

{/* Add 3–5 more Exercises of varying difficulty (easy / medium / klausur) */}

<Callout variant="exam-tip">

**Klausur-Tipp.** One-paragraph practical tip for exam day.

</Callout>

## Was kommt als Nächstes

One-sentence bridge to the next lesson in the chapter. What does the
student prepare for with this lesson? Where does the story go next?
```

---

## Cheat-sheet for common MDX traps (pin this to your fridge)

| Trap | Symptom | Fix |
| --- | --- | --- |
| `{,}` in plain prose | Build fails with "acorn" parse error | Write `,` instead, or wrap in `$...$` |
| `{-n}` in prose | Build fails "n is not defined" | Write `(-n)` or wrap in `$...$` |
| `$` not closed | All following math broken | Count your `$` signs per paragraph |
| Units like `300 K` | Italic K looks like a variable | Write `300\,\mathrm{K}` inside `$...$` |
| Backticks inside template literals | Build fails with syntax error | Replace inner `\`` with `'` or use Exercise props separately |
| Umlaut in frontmatter value | Sometimes breaks YAML parse | Use native `ä ö ü ß`, not `&auml;` etc. — both work but native is safer |

---

## Quick reference: Exercise types

The `type` prop in `<Exercise>` determines what the student sees. Pick the one that fits the question:

- `multiple_choice` — one correct answer from a list of 4.
- `multi_select` — several correct answers from a list; the student checks all that apply.
- `numeric` — expects a number. You provide `correct` (number) and optional `unit`, `tolerance`.
- `short_derivation` — LaTeX answer (e.g. simplifying an expression). `correct_latex` is the target form.
- `order_steps` — student drags steps into the correct order.
- `label_diagram` — advanced; not recommended for hand-authored lessons.

Start with `multiple_choice` and `numeric`; they cover 80 % of Klausur-style questions.

---

## Who to ask if something isn't in this guide

1. Open the two reference lessons and diff them against your own. 90 % of "is this right?" questions answer themselves this way.
2. Open `PROMPT.md` at the repo root. That is the original product brief and lists every invariant the app assumes.
3. Ask Claude.ai with the original prompt from Step 2 of this guide plus the offending snippet; it knows what's wrong in 95 % of cases.

Viel Erfolg — the harder the topic, the more valuable your lesson will be to the next student who hits it exhausted on the U-Bahn.
