# Math rendering and typography — display rules for EPT-Kompass

Mathematical rendering is not a polish task. For an engineering student, a broken formula is a worse experience than no formula at all — it trains the eye to misread. This document specifies exactly how maths, German terms, and scientific notation must appear in EPT-Kompass. Claude Code must follow these rules.

## 1. Maths renderer: KaTeX, not MathJax

Use **KaTeX** (via `rehype-katex` in the MDX pipeline). Three reasons:

1. It renders synchronously, so there is no flash of unstyled LaTeX.
2. It is ≈ 100× smaller than MathJax and faster to parse.
3. It renders server-side in React Server Components, so the first paint already shows typeset maths.

### Installation (Next.js 14 App Router)

```bash
npm install katex rehype-katex remark-math
```

In `next.config.mjs`:

```js
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: "ignore", trust: true, output: "htmlAndMathml" }]],
  },
});
```

The KaTeX stylesheet **must** be imported once globally — in `app/layout.tsx`:

```tsx
import "katex/dist/katex.min.css";
```

Do **not** import it per-page. Without this stylesheet imported, formulas render as raw unstyled spans and look worse than plain text.

### Delimiters

- Inline maths: single dollars. `$x^2 + 1$` → $x^2 + 1$
- Display maths: double dollars, on their own lines.

  ```
  $$
  \int_0^\infty e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2}
  $$
  ```

- `\\(` and `\\[` are supported too, but prefer dollars — they match the MDX content in this repo.

### Trusted commands

Set `trust: true` in the rehype-katex config so that `\href` and `\includegraphics` work. Do not set `strict: "error"` — that crashes on minor issues; use `"ignore"` or `"warn"` so the build continues.

## 2. Symbols every engineering lesson needs

KaTeX supports essentially all standard LaTeX commands. Reference for the ones you will write most:

| Symbol | LaTeX | Usage |
| --- | --- | --- |
| $\dot{m}$ | `\dot{m}` | mass flow rate (time derivative of mass) |
| $\ddot{x}$ | `\ddot{x}` | second time derivative |
| $\bar{x}$ | `\bar{x}` | mean |
| $\vec{v}$ | `\vec{v}` | vector |
| $\hat{n}$ | `\hat{n}` | unit vector |
| $\tilde{T}$ | `\tilde{T}` | dimensionless / normalised |
| $\partial$ | `\partial` | partial derivative |
| $\nabla$ | `\nabla` | del / nabla |
| $\infty$ | `\infty` | infinity |
| $\approx$, $\neq$, $\leq$, $\geq$, $\ll$, $\gg$ | `\approx`, `\neq`, `\leq`, `\geq`, `\ll`, `\gg` | comparisons |
| $\propto$ | `\propto` | proportional to |
| $\Delta$, $\delta$, $\mathrm{d}$ | `\Delta`, `\delta`, `\mathrm{d}` | difference, infinitesimal process quantity, infinitesimal state quantity |
| $\sum$, $\int$, $\oint$, $\prod$ | `\sum`, `\int`, `\oint`, `\prod` | summation, integral, closed-path integral, product |
| $\pm$, $\mp$ | `\pm`, `\mp` | plus-minus, minus-plus |
| Greek letters | `\alpha \beta \gamma \Delta \epsilon \zeta \eta \theta \Theta \iota \kappa \lambda \Lambda \mu \nu \xi \Xi \pi \Pi \rho \sigma \Sigma \tau \phi \Phi \chi \psi \Psi \omega \Omega` | standard |
| Chemical subscripts | $c_p$, $c_v$, $R_{\text{spez}}$ | use `\text{}` for multi-letter subscripts that are not variables |
| Units in display | $\ \mathrm{J/(kg\,K)}$ | always `\mathrm{}` for units, `\,` for thin space |

### The single most important rule for engineering notation

**Always wrap units in `\mathrm{}` and separate them from numbers with `\,`.**

- Wrong: `$T = 300 K$` → renders as $T = 300 K$ with $K$ italic, looking like a variable.
- Right: `$T = 300\,\mathrm{K}$` → renders as $T = 300\,\mathrm{K}$ with $\mathrm{K}$ upright.

Composite units: use `\mathrm{J/(kg\,K)}` not `J/(kg K)`. The inner `\,` is a thin space between kg and K.

### Process quantities vs state quantities

Thermodynamics distinguishes:

- **state quantities** (exact differentials): use `\mathrm{d}` — `$\mathrm{d}U$` → $\mathrm{d}U$
- **process quantities** (inexact differentials): use `\delta` or the crossed-d — `$\delta Q$` → $\delta Q$, or `$đ Q$` (the German engineering tradition uses a crossed d, but KaTeX does not have it directly — use `\delta` and note it in the lesson)

Write an explanatory note the first time in every module that uses this convention. The student will not remember it from a previous module.

## 3. German terms inline with English prose

The `<GermanTerm>` chip (see `components/lesson-components.ts`) handles this. But inside prose without the chip:

- Use `*italic*` for short German phrases, e.g. *der erste Hauptsatz*.
- Use quotation marks for exam-phrase quotes, German style: *„Gut isolierter Behälter"*. The em-dash surrounding glosses is `—` (U+2014).
- Never bold German terms in prose — the bold is reserved for emphasis. The `<GermanTerm>` chip is its own visual style.

### Umlauts and eszett

Write them as actual characters: ä ö ü ß Ä Ö Ü, not `&auml;` or `ae`. MDX and Postgres both handle Unicode natively.

## 4. Font stack

In `app/globals.css`:

```css
:root {
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-serif: "Source Serif 4", Georgia, "Times New Roman", serif;
  --font-mono: "JetBrains Mono", "Fira Code", Menlo, monospace;
}

body {
  font-family: var(--font-sans);
  font-feature-settings: "ss01", "cv11"; /* Inter ligatures + German a */
}

.lesson-body {
  font-family: var(--font-serif);
  font-size: 1.0625rem;    /* 17 px — readable at arm's length on a 15" laptop */
  line-height: 1.65;
}

code, kbd, pre {
  font-family: var(--font-mono);
}

/* KaTeX overrides — match font size to surrounding serif, not larger */
.katex { font-size: 1.05em; }
.katex-display { margin: 1.25em 0; overflow-x: auto; overflow-y: hidden; }
.katex-display > .katex { white-space: nowrap; }
```

Use `next/font` to load Inter and Source Serif 4 from Google Fonts with `display: "swap"` and preloading.

## 5. Scientific notation and large/small numbers

In prose, use the German thousands separator style: `10\,000` (thin space) or `10 000`. Decimal separator: in German scientific prose it is a comma (`2,3026`), in English it is a period (`2.3026`).

**Rule for EPT-Kompass**: the explanation prose follows the language of the surrounding paragraph. German Musteraufgaben use `2,3026`. English solution walk-throughs use `2.3026`. Never mix within one block.

Scientific notation:

- In maths: `$6.022 \times 10^{23}$` → $6.022 \times 10^{23}$
- Prefer `\times`, not `\cdot`, for scientific notation (visual clarity).
- Use `\cdot` for multiplication in algebraic expressions: $a \cdot b$.

## 6. Diagrams via Mermaid

Mermaid renders flow, sequence, and class diagrams. In MDX it goes through `@theguild/remark-mermaid` or a server-side wrapper. Include the CSS for dashed system boundaries:

```css
.mermaid .system-boundary rect,
.mermaid .system-boundary polygon {
  stroke-dasharray: 5 3;
  fill: none;
}
```

For real P&IDs (*Rohrleitungs- und Instrumentenfließbilder*) with pumps, valves, and vessels, Mermaid is too limited. Upload hand-drawn SVGs to `public/diagrams/` and render with `<DiagramSVG>`.

## 7. Rendering test page

Create `app/(dev)/render-test/page.tsx` with every construct that any lesson uses. Run it before merging any change to the MDX pipeline. If anything here looks wrong, maths is broken everywhere.

```md
# Rendering test

## Inline maths
Einstein's $E = mc^2$ and Euler's $e^{i\pi} + 1 = 0$.

## Display maths
$$\int_a^b f(x)\,\mathrm{d}x = F(b) - F(a)$$

## Subscripts, superscripts, greek
$c_p$, $c_v$, $\eta_{\text{Carnot}} = 1 - \frac{T_{\text{kalt}}}{T_{\text{warm}}}$

## Dots and fractions
Mass flow: $\dot{m} = \rho \cdot \bar{c} \cdot A$, heat flow: $\dot{Q} = k \cdot A \cdot \Delta T$.

## Units
$R = 8{.}314\,\mathrm{J/(mol\,K)}$, $\sigma = 5{.}67 \times 10^{-8}\,\mathrm{W/(m^2\,K^4)}$.

## Process and state differentials
First law: $\mathrm{d}U = \delta Q + \delta W$, where $\mathrm{d}U$ is exact, $\delta Q$ and $\delta W$ are path-dependent.

## Aligned equations
$$\begin{aligned}
\dot{Q} + P &= \dot{m}\left[(h_2 - h_1) + \tfrac{1}{2}(c_2^2 - c_1^2) + g(z_2-z_1)\right] \\
             &\approx \dot{m}\,(h_2 - h_1) \quad\text{(negligible KE, PE)}
\end{aligned}$$

## Vectors and matrices
$\vec{F} = m \cdot \vec{a}$, $\nabla \cdot \vec{E} = \rho/\varepsilon_0$.

$$A = \begin{pmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{pmatrix}$$

## German umlauts in math labels
$T_{\text{Wärmequelle}}$, $\eta_{\text{ges,Kraftwerk}}$
```

Open this page during development. Every line must render correctly — no red KaTeX error spans, no italic unit letters, no missing subscripts.

## 8. Do not use

- ❌ MathJax — too slow, too big.
- ❌ `ASCIIMath` — loose syntax, hard to review.
- ❌ Raw Unicode math (like $\int$ pasted from a character table) — looks inconsistent across devices.
- ❌ Images of formulas — not accessible, not searchable, not zoomable, and they break on dark mode.

## 9. Accessibility

KaTeX renders both HTML and MathML when `output: "htmlAndMathml"` is set. MathML is what screen readers use. Never set `output: "html"` alone. Every display equation should have a short sentence immediately before or after describing what it is, e.g. *"The first law for a closed system reads:"* — so students with a screen reader or with the image disabled still get context.

## 10. Dark mode

KaTeX uses `currentColor` for its strokes, so maths inherits the text colour. This means dark mode works automatically *if* you style the body text correctly with `color: var(--foreground)` in both light and dark. Do not hardcode `color: black` anywhere in the lesson CSS.
