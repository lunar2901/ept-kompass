/**
 * Curriculum metadata for the seed script. Matches §4 of PROMPT.md.
 *
 * MVP seeds only the subset actually touched by the two reference
 * lessons — Track 0 (Schulwissen) and Track B (Ingenieurwissenschaftliche
 * Kerngebiete). Adding a new module means adding it to `MODULES` and
 * listing its chapters in `CHAPTERS` — the seeder wires the rest up.
 */

export interface TrackSeed {
  code: string;
  name_de: string;
  name_en: string;
  description_en?: string;
  position: number;
}

export interface ModuleSeed {
  code: string;
  track_code: string;
  name_de: string;
  name_en: string;
  semester: number | null;
  ects: number | null;
  position: number;
  description_en?: string;
}

export interface ChapterSeed {
  code: string;
  module_code: string;
  name_de: string;
  name_en: string;
  position: number;
}

export const TRACKS: TrackSeed[] = [
  {
    code: "0",
    name_de: "Schulwissen auffrischen",
    name_en: "Refresher — high-school foundations",
    description_en:
      "Four to six weeks of rusty-maths rebuild. Fractions, powers, logs, binomial formulas, linear/quadratic equations, trig, vectors, differentiation, integration, SI units, stoichiometry, Newtonian mechanics, basic statistics.",
    position: 0,
  },
  {
    code: "A",
    name_de: "Mathematische und naturwissenschaftliche Grundlagen",
    name_en: "Mathematical and scientific foundations",
    description_en:
      "Semesters 1–2: Analysis, linear algebra, chemistry, physics, informatics for engineers.",
    position: 1,
  },
  {
    code: "B",
    name_de: "Ingenieurwissenschaftliche Kerngebiete",
    name_en: "Engineering core",
    description_en:
      "Semesters 2–4: technical mechanics, thermodynamics, fluid mechanics, heat and mass transfer, control, electrical, materials, machine elements.",
    position: 2,
  },
  {
    code: "C",
    name_de: "Prozess- und Energietechnik (Vertiefung)",
    name_en: "Process and energy specialisation",
    description_en:
      "Semesters 4–6: mechanical / thermal / chemical process engineering, reactor engineering, energy engineering, renewables, plant engineering, bioprocess.",
    position: 3,
  },
  {
    code: "D",
    name_de: "Kontext und überfachliche Kompetenzen",
    name_en: "Context and transferable skills",
    description_en:
      "Economics, sustainability and LCA, academic-German writing.",
    position: 4,
  },
];

export const MODULES: ModuleSeed[] = [
  {
    code: "schulwissen-auffrischen",
    track_code: "0",
    name_de: "Schulwissen auffrischen",
    name_en: "High-school refresher",
    semester: null,
    ects: null,
    position: 0,
    description_en:
      "Every topic a student needs to bring back before Analysis I can land.",
  },
  {
    code: "thermodynamik-1",
    track_code: "B",
    name_de: "Thermodynamik I",
    name_en: "Thermodynamics I",
    semester: 3,
    ects: 6,
    position: 1,
    description_en:
      "Systems and boundaries, state and process quantities, first law, open and closed systems, ideal gases.",
  },
];

export const CHAPTERS: ChapterSeed[] = [
  {
    code: "logarithmen",
    module_code: "schulwissen-auffrischen",
    name_de: "Logarithmen",
    name_en: "Logarithms",
    position: 3,
  },
  {
    code: "kap-1-grundbegriffe",
    module_code: "thermodynamik-1",
    name_de: "Kapitel 1 — Grundbegriffe",
    name_en: "Chapter 1 — Fundamentals",
    position: 1,
  },
];
