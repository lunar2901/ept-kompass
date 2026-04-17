import type { Metadata } from "next";
import { renderLessonMDX } from "@/lib/mdx";
import {
  Exercise,
  InteractivePlot,
  DiagramP_and_ID,
} from "@/components/lesson";

export const metadata: Metadata = {
  title: "Math rendering test",
  description:
    "Every KaTeX, MDX, and lesson-component construct the curriculum uses, rendered on one page.",
};

/**
 * The non-negotiable gate from /starter/docs/math-and-typography.md §7.
 * If anything on this page renders wrong, maths is broken everywhere.
 *
 * Layout: an MDX blob covers every pure-math construct plus the prose-
 * embeddable components (GermanTerm / FormulaCard / VocabBlock / Callout).
 * The interactive pieces (DiagramP_and_ID, InteractivePlot, Exercise) are
 * rendered as JSX below so nested-template-literal escaping stays sane.
 */
export default async function RenderTestPage() {
  const { content } = await renderLessonMDX(MDX_SOURCE);
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 lesson-body">
      <div className="mb-6 rounded border border-[color:var(--border)] bg-[color:var(--muted)] p-4 text-sm">
        <strong>Render test.</strong> Every math construct, KaTeX symbol,
        German-term chip, formula card, callout, diagram, and the four-tab
        Exercise result panel rendered via the production MDX pipeline. If
        anything here looks wrong, do not ship any lesson until it is fixed.
      </div>
      {content}

      <h2>Mermaid diagram — DiagramP_and_ID component</h2>
      <DiagramP_and_ID
        caption_de="Dampfturbine als offenes System. Systemgrenze gestrichelt; Massenstrom bei 1 ein, bei 2 aus; P als Wellenarbeit nach außen."
        caption_en="Steam turbine as an open system. Dashed boundary; mass in at 1, out at 2; P delivered as shaft work."
        mermaid={`
flowchart LR
  in((1)) -.->|"ṁ, h₁"| T[Turbine]
  T -.->|"ṁ, h₂"| out((2))
  T -->|"P"| shaft[Welle]
  style T fill:#e0f2f1,stroke:#0f766e,stroke-dasharray: 5 5
`}
      />

      <h2>Interactive plot — InteractivePlot component</h2>
      <InteractivePlot
        id="carnot-efficiency"
        title_de="Carnot-Wirkungsgrad vs. Kalttemperatur"
        title_en="Carnot efficiency vs. cold-side temperature"
        xLabel={{ de: "T_kalt", en: "T_cold", unit: "K" }}
        yLabel={{ de: "η_Carnot", en: "η_Carnot", unit: "—" }}
        expression="1 - T_cold / T_hot"
        variables={[
          {
            name: "T_cold",
            label_de: "T_kalt",
            label_en: "T_cold",
            min: 100,
            max: 600,
            step: 5,
            initial: 300,
            unit: "K",
          },
          {
            name: "T_hot",
            label_de: "T_warm",
            label_en: "T_hot",
            min: 400,
            max: 1500,
            step: 5,
            initial: 800,
            unit: "K",
          },
        ]}
        xVariable="T_cold"
      />

      <h2>Exercise — the 4-tab result panel</h2>
      <p>
        Submit below to see the pre-authored{" "}
        <strong>Lösung · Häufige Fehler · Diskussion · Meine Antwort</strong>{" "}
        tabs open. Try a wrong answer first — the matching common-mistake row
        auto-highlights.
      </p>
      <Exercise
        id="render-test-ex1"
        difficulty="easy"
        type="multiple_choice"
        question_de="Welche der folgenden Größen ist eine Prozessgröße?"
        question_en="Which of the following quantities is a process quantity?"
        options={[
          { id: "a", de: "innere Energie U", en: "internal energy U" },
          { id: "b", de: "Enthalpie H", en: "enthalpy H" },
          { id: "c", de: "Wärme Q", en: "heat Q" },
          { id: "d", de: "Entropie S", en: "entropy S" },
        ]}
        correct="c"
        hint_en="State quantities depend only on the current state of the system. Process quantities depend on the path."
        solution_mdx={SOLUTION_MDX}
        common_mistakes={[
          {
            wrong: "a — innere Energie U",
            why_en:
              "Internal energy is a state quantity — its value is set by the present state of the system ($T$, $p$, composition) and nothing else. Classic confusion: Q changes U, but Q itself is a process quantity while U is not.",
          },
          {
            wrong: "b — Enthalpie H",
            why_en:
              "Enthalpy $H = U + pV$ is a state quantity by definition — a combination of three state quantities. On Klausuren, writing $\\mathrm{d}H$ in your energy balance signals 'state'.",
          },
          {
            wrong: "d — Entropie S",
            why_en:
              "Entropy is the flagship state quantity of the second law. $\\Delta S$ between two states is path-independent for the system, even though entropy production depends on the path.",
          },
        ]}
        discussion_mdx={DISCUSSION_MDX}
      />

      <hr className="my-10" />
      <p className="text-sm text-[color:var(--muted-foreground)]">
        If everything above looks crisp, the MDX + KaTeX + Mermaid + Radix
        pipeline is sound. Proceed to step 5.
      </p>
    </main>
  );
}

const MDX_SOURCE = `
# Rendering test

## Inline maths

Einstein's $E = mc^2$ and Euler's $e^{i\\pi} + 1 = 0$.

## Display maths

$$
\\int_0^\\infty e^{-x^2}\\,\\mathrm{d}x = \\frac{\\sqrt{\\pi}}{2}
$$

## Subscripts, superscripts, greek

$c_p$, $c_v$, $\\eta_{\\text{Carnot}} = 1 - \\dfrac{T_{\\text{kalt}}}{T_{\\text{warm}}}$, $\\Delta, \\delta, \\mathrm{d}$.

## Dots and fractions

Mass flow: $\\dot{m} = \\rho \\cdot \\bar{c} \\cdot A$, heat flow: $\\dot{Q} = k \\cdot A \\cdot \\Delta T$, second derivative: $\\ddot{x}$, vectors: $\\vec{v}$, unit normal: $\\hat{n}$.

## Units — the italic-K trap

- Wrong: $T = 300 K$ has italic $K$ like a variable.
- Right: $T = 300\\,\\mathrm{K}$ with upright $\\mathrm{K}$.
- Composite: $R = 8{.}314\\,\\mathrm{J/(mol\\,K)}$, $\\sigma = 5{.}67 \\times 10^{-8}\\,\\mathrm{W/(m^2\\,K^4)}$.

## Process and state differentials

First law for a closed system:

$$
\\mathrm{d}U = \\delta Q + \\delta W
$$

where $\\mathrm{d}U$ is an exact differential (state quantity) and $\\delta Q$, $\\delta W$ are path-dependent (process quantities).

## Aligned equations

Energy balance for a stationary open system:

$$
\\begin{aligned}
\\dot{Q} + P &= \\dot{m}\\left[(h_2 - h_1) + \\tfrac{1}{2}(c_2^2 - c_1^2) + g(z_2 - z_1)\\right] \\\\
             &\\approx \\dot{m}\\,(h_2 - h_1) \\quad\\text{(negligible KE, PE)}
\\end{aligned}
$$

## Vectors and matrices

$\\vec{F} = m \\cdot \\vec{a}$, $\\nabla \\cdot \\vec{E} = \\rho / \\varepsilon_0$.

$$
A = \\begin{pmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{pmatrix}
$$

## German umlauts in math labels

$T_{\\text{Wärmequelle}}$, $\\eta_{\\text{ges,Kraftwerk}}$, $\\dot{m}_{\\text{Dampf}}$, $p_{\\text{Überdruck}}$.

## Scientific notation

$6{.}022 \\times 10^{23}$ (Avogadro), $1{.}381 \\times 10^{-23}\\,\\mathrm{J/K}$ (Boltzmann), thousand separator: $10\\,000$ (thin space).

## Inline logarithms

$\\lg(10\\,000) = 4$, $\\ln(e^5) = 5$, $\\log_2(50) = \\dfrac{\\ln 50}{\\ln 2}$.

## German-term chips in English prose

<GermanTerm de="System" article="das" plural="Systeme" en="system" ipa="/zʏsˈteːm/" /> is the thing we draw a box around. Its boundary is the <GermanTerm de="Systemgrenze" article="die" plural="Systemgrenzen" en="system boundary" ipa="/zʏsˈteːmˌɡʁɛntsə/" />. Whatever lies outside is the <GermanTerm de="Umgebung" article="die" en="surroundings" />.

## Formula card — FormulaCard component

<FormulaCard
  name_de="Idealgasgleichung"
  name_en="Ideal gas equation"
  latex="p\\,V = n\\,R\\,T"
  variables={[
    { symbol: "p", name_de: "Druck", name_en: "pressure", unit: "Pa" },
    { symbol: "V", name_de: "Volumen", name_en: "volume", unit: "m^3" },
    { symbol: "n", name_de: "Stoffmenge", name_en: "amount of substance", unit: "mol" },
    { symbol: "R", name_de: "universelle Gaskonstante", name_en: "universal gas constant", unit: "J/(mol·K)" },
    { symbol: "T", name_de: "Temperatur", name_en: "temperature", unit: "K" },
  ]}
>
The ideal-gas equation assumes point-particle molecules with no interactions. It is the first model of a gas every Thermodynamik course starts with, and it stays accurate up to moderate pressures.
</FormulaCard>

## Vocab block — VocabBlock component

<VocabBlock entries={[
  { term: "der Massenstrom", en: "mass flow rate", plural: "die Massenströme", ipa: "/ˈmasənˌʃtʁoːm/", example_de: "Der Massenstrom durch die Turbine beträgt 25 kg/s.", example_en: "The mass flow rate through the turbine is 25 kg/s." },
  { term: "der Wärmestrom", en: "heat flow rate", plural: "die Wärmeströme", example_de: "Der Wärmestrom durch die Wand ist klein.", example_en: "The heat flow rate through the wall is small." },
  { term: "die Leistung", en: "power", plural: "die Leistungen", example_de: "Die Leistung einer Windkraftanlage hängt von der dritten Potenz der Windgeschwindigkeit ab.", example_en: "The power of a wind turbine depends on the third power of the wind speed." },
]} />

## Callouts — every variant

<Callout variant="intuition" title="Intuition">

The single most useful sentence in thermodynamics: *draw the boundary first, then count what crosses it*. Get the boundary right and every energy balance that follows is just arithmetic.

</Callout>

<Callout variant="exam-tip">

**Klausur-Tipp.** Wenn die Aufgabe *"gut isoliert"* sagt, setzen Sie in Ihrer Antwort ausdrücklich *adiabat* voraus und schreiben Sie $\\dot{Q} = 0$ in die Energiebilanz. Der Korrektor prüft, ob Sie diese Annahme sichtbar machen.

</Callout>

<Callout variant="warning">

$\\delta Q$ und $\\mathrm{d}U$ sind nicht austauschbar. Wenn Sie in einer Klausur $\\mathrm{d}Q$ schreiben, verlieren Sie den Punkt für die Unterscheidung zwischen Zustands- und Prozessgröße.

</Callout>

<Callout variant="note">

A $\\mathrm{d}$ differential is exact — its integral depends only on endpoints. A $\\delta$ differential is path-dependent. The first law $\\mathrm{d}U = \\delta Q + \\delta W$ is the relation between them.

</Callout>

<Callout variant="historical">

Carathéodory put thermodynamics on its modern axiomatic footing in 1909. Before that, textbooks used *isolated* and *adiabatic* interchangeably — as some still do today. The nesting *abgeschlossen ⊂ adiabat* is a consequence of the first and second laws together.

</Callout>

## Aligned lines with SI units (stress test)

$$
\\begin{aligned}
\\rho &= 1{.}225\\,\\mathrm{kg/m^3} && \\text{(Luft, 15 °C, 1 atm)} \\\\
c_p  &= 1{.}005\\,\\mathrm{kJ/(kg\\,K)} && \\text{(Luft, Standardbedingungen)} \\\\
R_{\\text{spez}} &= 287\\,\\mathrm{J/(kg\\,K)} && \\text{(Luft)} \\\\
\\Delta s &= R\\,\\ln\\!\\left(\\frac{p_1}{p_2}\\right) && \\text{(isothermer Prozess)}
\\end{aligned}
$$
`;

const SOLUTION_MDX = `
**Correct answer: (c) Wärme Q.**

Heat is energy transferred across a system boundary because of a temperature difference — you can only count it while it is happening. Mathematically, $\\delta Q$ is inexact: $\\int \\delta Q$ depends on the path, not just the endpoints.

Internal energy, enthalpy, and entropy are all state quantities — their differentials are exact, written with $\\mathrm{d}$: $\\mathrm{d}U$, $\\mathrm{d}H$, $\\mathrm{d}S$.
`;

const DISCUSSION_MDX = `
**Why the distinction matters on every energy-balance problem.**

A state quantity is "stored" in the system; a process quantity only exists while energy is crossing a boundary. In $\\Delta U = Q + W$, the left side is a change of a stored quantity, the right side is a sum of two crossings.

**Notation check.** German engineering tradition writes:

- exact: $\\mathrm{d}U$, $\\mathrm{d}H$, $\\mathrm{d}S$
- inexact: $\\delta Q$, $\\delta W$ (or a crossed d in older books)

If your lecturer uses crossed-d, it means the same as $\\delta Q$. KaTeX does not render the crossed-d cleanly, so EPT-Kompass uses $\\delta$ everywhere.
`;
