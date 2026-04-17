/**
 * Full EPT-Kompass curriculum metadata (PROMPT.md §4).
 *
 * This is pure data — no filesystem access, no database. Both the
 * seed script (scripts/seed.ts via ./curriculum.ts) and the frontend
 * navigation (lib/navigation.ts) import from here.
 *
 * Tracks 0, A, B, C, D cover the complete B.Sc. Energie- und
 * Prozesstechnik curriculum. Modules marked `status: "stub"` have
 * no lessons yet but still appear in the navigation — the student
 * sees the full shape of their degree on day one.
 */

export interface TrackSeed {
  code: string;
  name_de: string;
  name_en: string;
  description_de: string;
  description_en: string;
  position: number;
}

export interface ModuleSeed {
  code: string;
  track_code: string;
  name_de: string;
  name_en: string;
  description_de: string;
  description_en: string;
  semester: number | null;
  ects: number | null;
  position: number;
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
    description_de:
      "Die rostigen Schulmathe-Themen in vier bis sechs Wochen auffrischen, bevor Analysis I und Thermodynamik starten.",
    description_en:
      "Refresh rusty high-school maths in four to six weeks before Analysis I and Thermodynamics begin.",
    position: 0,
  },
  {
    code: "A",
    name_de: "Mathematische und naturwissenschaftliche Grundlagen",
    name_en: "Mathematical and scientific foundations",
    description_de:
      "Semester 1–2: Analysis, lineare Algebra, Chemie, Physik, Informatik für Ingenieure.",
    description_en:
      "Semesters 1–2: analysis, linear algebra, chemistry, physics, informatics for engineers.",
    position: 1,
  },
  {
    code: "B",
    name_de: "Ingenieurwissenschaftliche Kerngebiete",
    name_en: "Engineering core",
    description_de:
      "Semester 2–4: Mechanik, Thermodynamik, Strömungslehre, Wärme- und Stoffübertragung, Elektrotechnik, Werkstoffkunde.",
    description_en:
      "Semesters 2–4: mechanics, thermodynamics, fluid mechanics, heat/mass transfer, electrical, materials.",
    position: 2,
  },
  {
    code: "C",
    name_de: "Prozess- und Energietechnik (Vertiefung)",
    name_en: "Process and energy specialisation",
    description_de:
      "Semester 4–6: mechanische, thermische und chemische Verfahrenstechnik, Energietechnik, erneuerbare Energien.",
    description_en:
      "Semesters 4–6: mechanical, thermal, and chemical process engineering, energy engineering, renewables.",
    position: 3,
  },
  {
    code: "D",
    name_de: "Kontext und überfachliche Kompetenzen",
    name_en: "Context and transferable skills",
    description_de:
      "Wirtschaft, Nachhaltigkeit und LCA, wissenschaftliches Arbeiten auf Deutsch.",
    description_en:
      "Economics, sustainability and LCA, academic-German writing.",
    position: 4,
  },
];

export const MODULES: ModuleSeed[] = [
  /* ─── Track 0 ───────────────────────────────────────────── */
  {
    code: "schulwissen-auffrischen",
    track_code: "0",
    name_de: "Schulwissen auffrischen",
    name_en: "High-school refresher",
    description_de:
      "13 kurze Kapitel: Bruchrechnen, Potenzen, Logarithmen, Analysis-Grundlagen, SI-Einheiten, Stöchiometrie, Mechanik, Statistik.",
    description_en:
      "13 short chapters covering fractions through logarithms, calculus basics, SI units, stoichiometry, Newtonian mechanics, and statistics.",
    semester: null,
    ects: null,
    position: 0,
  },

  /* ─── Track A ───────────────────────────────────────────── */
  {
    code: "analysis-1",
    track_code: "A",
    name_de: "Analysis I für Ingenieure",
    name_en: "Analysis I for engineers",
    description_de:
      "Grenzwerte, Stetigkeit, Ableitungen und Integration in einer Variablen.",
    description_en:
      "Limits, continuity, differentiation and integration in one variable.",
    semester: 1,
    ects: 8,
    position: 1,
  },
  {
    code: "analysis-2",
    track_code: "A",
    name_de: "Analysis II für Ingenieure",
    name_en: "Analysis II for engineers",
    description_de:
      "Mehrdimensionale Analysis, Vektoranalysis, gewöhnliche Differenzialgleichungen.",
    description_en:
      "Multivariable calculus, vector analysis, ordinary differential equations.",
    semester: 2,
    ects: 8,
    position: 2,
  },
  {
    code: "lineare-algebra",
    track_code: "A",
    name_de: "Lineare Algebra für Ingenieure",
    name_en: "Linear algebra for engineers",
    description_de:
      "Vektorräume, Matrizen, lineare Gleichungssysteme, Eigenwerte.",
    description_en:
      "Vector spaces, matrices, linear systems, eigenvalues.",
    semester: 1,
    ects: 6,
    position: 3,
  },
  {
    code: "anorganische-chemie",
    track_code: "A",
    name_de: "Allgemeine und Anorganische Chemie",
    name_en: "General and inorganic chemistry",
    description_de:
      "Atombau, Periodensystem, Bindung, Reaktionskinetik, Gleichgewichte.",
    description_en:
      "Atomic structure, periodic table, bonding, kinetics, equilibrium.",
    semester: 1,
    ects: 6,
    position: 4,
  },
  {
    code: "organische-chemie",
    track_code: "A",
    name_de: "Organische Chemie Grundlagen",
    name_en: "Organic chemistry basics",
    description_de:
      "Kohlenwasserstoffe, funktionelle Gruppen, Reaktionsmechanismen.",
    description_en:
      "Hydrocarbons, functional groups, reaction mechanisms.",
    semester: 2,
    ects: 4,
    position: 5,
  },
  {
    code: "physik",
    track_code: "A",
    name_de: "Physik für Ingenieure",
    name_en: "Physics for engineers",
    description_de:
      "Mechanik, Wellen, Elektromagnetismus, Optik, moderne Physik.",
    description_en:
      "Mechanics, waves, electromagnetism, optics, modern physics.",
    semester: 2,
    ects: 6,
    position: 6,
  },
  {
    code: "informatik",
    track_code: "A",
    name_de: "Informatik für Ingenieure",
    name_en: "Informatics for engineers",
    description_de:
      "Programmieren mit Python/MATLAB, numerische Verfahren, Datenstrukturen.",
    description_en:
      "Programming in Python/MATLAB, numerical methods, data structures.",
    semester: 2,
    ects: 4,
    position: 7,
  },

  /* ─── Track B ───────────────────────────────────────────── */
  {
    code: "technische-mechanik",
    track_code: "B",
    name_de: "Technische Mechanik",
    name_en: "Engineering mechanics",
    description_de:
      "Statik, Festigkeitslehre, Kinematik und Dynamik starrer Körper.",
    description_en:
      "Statics, strength of materials, kinematics and dynamics of rigid bodies.",
    semester: 2,
    ects: 8,
    position: 1,
  },
  {
    code: "thermodynamik-1",
    track_code: "B",
    name_de: "Thermodynamik I",
    name_en: "Thermodynamics I",
    description_de:
      "Systeme, Zustandsgrößen, Erster Hauptsatz für geschlossene und offene Systeme, ideale und reale Gase.",
    description_en:
      "Systems, state variables, first law for closed and open systems, ideal and real gases.",
    semester: 3,
    ects: 6,
    position: 2,
  },
  {
    code: "thermodynamik-2",
    track_code: "B",
    name_de: "Thermodynamik II",
    name_en: "Thermodynamics II",
    description_de:
      "Zweiter Hauptsatz, Entropie, Exergie, Wasserdampf, Kreisprozesse (Clausius-Rankine, Brayton, Joule-Kältemaschine).",
    description_en:
      "Second law, entropy, exergy, steam tables, cycles (Clausius-Rankine, Brayton, refrigeration).",
    semester: 4,
    ects: 6,
    position: 3,
  },
  {
    code: "stroemungslehre",
    track_code: "B",
    name_de: "Strömungslehre",
    name_en: "Fluid mechanics",
    description_de:
      "Hydrostatik, Bernoulli, Navier-Stokes, Rohrströmung, Umströmung.",
    description_en:
      "Hydrostatics, Bernoulli, Navier-Stokes, pipe flow, flow around bodies.",
    semester: 3,
    ects: 6,
    position: 4,
  },
  {
    code: "waerme-stoffuebertragung",
    track_code: "B",
    name_de: "Wärme- und Stoffübertragung",
    name_en: "Heat and mass transfer",
    description_de:
      "Leitung, Konvektion, Strahlung; Diffusion; Wärmetauscher.",
    description_en:
      "Conduction, convection, radiation; diffusion; heat exchangers.",
    semester: 4,
    ects: 6,
    position: 5,
  },
  {
    code: "mess-regelungstechnik",
    track_code: "B",
    name_de: "Mess- und Regelungstechnik",
    name_en: "Measurement and control engineering",
    description_de:
      "Sensorik, Regelkreise, Laplace-Transformation, PID-Regler, Stabilität.",
    description_en:
      "Sensors, control loops, Laplace transform, PID controllers, stability.",
    semester: 4,
    ects: 6,
    position: 6,
  },
  {
    code: "elektrotechnik",
    track_code: "B",
    name_de: "Elektrotechnik",
    name_en: "Electrical engineering",
    description_de:
      "Gleich- und Wechselstromnetze, Drehstrom, elektrische Maschinen.",
    description_en:
      "DC/AC circuits, three-phase, electrical machines.",
    semester: 3,
    ects: 4,
    position: 7,
  },
  {
    code: "werkstoffkunde",
    track_code: "B",
    name_de: "Werkstoffkunde",
    name_en: "Materials science",
    description_de:
      "Metalle, Polymere, Keramiken, Verbundstoffe; mechanische und thermische Eigenschaften.",
    description_en:
      "Metals, polymers, ceramics, composites; mechanical and thermal properties.",
    semester: 3,
    ects: 4,
    position: 8,
  },
  {
    code: "maschinenelemente",
    track_code: "B",
    name_de: "Maschinenelemente",
    name_en: "Machine elements",
    description_de:
      "Verbindungen, Federn, Lager, Wellen, Getriebe, Dichtungen.",
    description_en:
      "Connections, springs, bearings, shafts, gears, seals.",
    semester: 4,
    ects: 4,
    position: 9,
  },

  /* ─── Track C ───────────────────────────────────────────── */
  {
    code: "mechanische-vt",
    track_code: "C",
    name_de: "Mechanische Verfahrenstechnik",
    name_en: "Mechanical process engineering",
    description_de:
      "Zerkleinern, Klassieren, Mischen, Filtrieren, Zentrifugieren.",
    description_en:
      "Size reduction, classification, mixing, filtration, centrifugation.",
    semester: 5,
    ects: 6,
    position: 1,
  },
  {
    code: "thermische-vt",
    track_code: "C",
    name_de: "Thermische Verfahrenstechnik",
    name_en: "Thermal process engineering",
    description_de:
      "Destillation, Rektifikation, Absorption, Extraktion, Trocknung.",
    description_en:
      "Distillation, rectification, absorption, extraction, drying.",
    semester: 5,
    ects: 6,
    position: 2,
  },
  {
    code: "chemische-vt",
    track_code: "C",
    name_de: "Chemische Verfahrenstechnik / Reaktionstechnik",
    name_en: "Chemical engineering / reactor engineering",
    description_de:
      "Reaktionskinetik, ideale Reaktortypen (CSTR, PFR), Katalyse, Selektivität.",
    description_en:
      "Reaction kinetics, ideal reactor types (CSTR, PFR), catalysis, selectivity.",
    semester: 5,
    ects: 6,
    position: 3,
  },
  {
    code: "energietechnik",
    track_code: "C",
    name_de: "Energietechnik",
    name_en: "Energy engineering",
    description_de:
      "Kraftwerksprozesse, Dampferzeuger, Gas- und Dampfturbinen, KWK.",
    description_en:
      "Power plant processes, steam generators, gas and steam turbines, cogeneration.",
    semester: 5,
    ects: 6,
    position: 4,
  },
  {
    code: "regenerative-energien",
    track_code: "C",
    name_de: "Regenerative Energien",
    name_en: "Renewable energy",
    description_de:
      "Solar, Wind, Wasserkraft, Biomasse, Geothermie, Energiespeicher.",
    description_en:
      "Solar, wind, hydro, biomass, geothermal, energy storage.",
    semester: 6,
    ects: 6,
    position: 5,
  },
  {
    code: "gebaeude-sanitaer",
    track_code: "C",
    name_de: "Gebäude- und Sanitärtechnik",
    name_en: "Building and sanitary engineering",
    description_de:
      "Heizung, Klima, Lüftung, Sanitär; Wärmeschutz; Gebäudeenergiebilanz.",
    description_en:
      "Heating, HVAC, plumbing; thermal insulation; building energy balance.",
    semester: 6,
    ects: 4,
    position: 6,
  },
  {
    code: "anlagentechnik",
    track_code: "C",
    name_de: "Anlagentechnik",
    name_en: "Plant engineering",
    description_de:
      "R&I-Fließbilder, Anlagenauslegung, Rohrleitungen, Sicherheitstechnik.",
    description_en:
      "P&ID diagrams, plant design, piping, safety engineering.",
    semester: 6,
    ects: 4,
    position: 7,
  },
  {
    code: "bioverfahrenstechnik",
    track_code: "C",
    name_de: "Bioverfahrenstechnik",
    name_en: "Bioprocess engineering",
    description_de:
      "Mikrobiologie, Fermentation, Zellkultivierung, Downstream-Processing.",
    description_en:
      "Microbiology, fermentation, cell cultivation, downstream processing.",
    semester: 6,
    ects: 4,
    position: 8,
  },

  /* ─── Track D ───────────────────────────────────────────── */
  {
    code: "wirtschaft",
    track_code: "D",
    name_de: "Wirtschaftswissenschaftliche Grundlagen",
    name_en: "Business and economics basics",
    description_de:
      "Kosten- und Leistungsrechnung, Investitionsrechnung, Unternehmensführung.",
    description_en:
      "Cost accounting, investment analysis, business management.",
    semester: 4,
    ects: 4,
    position: 1,
  },
  {
    code: "nachhaltigkeit",
    track_code: "D",
    name_de: "Nachhaltigkeit und Life Cycle Assessment",
    name_en: "Sustainability and life cycle assessment",
    description_de:
      "Ökobilanzen, CO₂-Bilanzen, Kreislaufwirtschaft, ESG-Kennzahlen.",
    description_en:
      "LCA, carbon accounting, circular economy, ESG metrics.",
    semester: 5,
    ects: 4,
    position: 2,
  },
  {
    code: "wissenschaftliches-arbeiten",
    track_code: "D",
    name_de: "Wissenschaftliches Arbeiten auf Deutsch",
    name_en: "Academic writing in German",
    description_de:
      "Versuchsprotokolle, Seminararbeiten, Bachelorarbeit, Zitation.",
    description_en:
      "Lab protocols, seminar papers, bachelor thesis, citation style.",
    semester: 4,
    ects: 2,
    position: 3,
  },
];

/**
 * Chapter metadata for modules that have at least one lesson authored.
 *
 * The frontend also discovers chapters from filesystem folders, but
 * declaring them here gives us proper display names and ordering
 * (filesystem discovery falls back to slug-cased folder names).
 */
export const CHAPTERS: ChapterSeed[] = [
  /* Schulwissen auffrischen — one chapter per Track-0 topic */
  {
    code: "bruchrechnen",
    module_code: "schulwissen-auffrischen",
    name_de: "Bruchrechnen",
    name_en: "Fractions",
    position: 1,
  },
  {
    code: "potenzen",
    module_code: "schulwissen-auffrischen",
    name_de: "Potenzen und Wurzeln",
    name_en: "Powers and roots",
    position: 2,
  },
  {
    code: "logarithmen",
    module_code: "schulwissen-auffrischen",
    name_de: "Logarithmen",
    name_en: "Logarithms",
    position: 3,
  },
  {
    code: "binomische-formeln",
    module_code: "schulwissen-auffrischen",
    name_de: "Binomische Formeln",
    name_en: "Binomial formulas",
    position: 4,
  },
  {
    code: "gleichungen",
    module_code: "schulwissen-auffrischen",
    name_de: "Lineare und quadratische Gleichungen",
    name_en: "Linear and quadratic equations",
    position: 5,
  },
  {
    code: "trigonometrie",
    module_code: "schulwissen-auffrischen",
    name_de: "Trigonometrie und Einheitskreis",
    name_en: "Trigonometry and the unit circle",
    position: 6,
  },
  {
    code: "vektoren",
    module_code: "schulwissen-auffrischen",
    name_de: "Vektorrechnung",
    name_en: "Vector calculus basics",
    position: 7,
  },
  {
    code: "differenzieren",
    module_code: "schulwissen-auffrischen",
    name_de: "Differenzieren",
    name_en: "Differentiation",
    position: 8,
  },
  {
    code: "integrieren",
    module_code: "schulwissen-auffrischen",
    name_de: "Integrieren",
    name_en: "Integration",
    position: 9,
  },
  {
    code: "si-einheiten",
    module_code: "schulwissen-auffrischen",
    name_de: "SI-Einheiten und Einheitenumrechnung",
    name_en: "SI units and unit conversion",
    position: 10,
  },
  {
    code: "stoechiometrie",
    module_code: "schulwissen-auffrischen",
    name_de: "Stöchiometrie und Molrechnung",
    name_en: "Stoichiometry and mole calculations",
    position: 11,
  },
  {
    code: "mechanik",
    module_code: "schulwissen-auffrischen",
    name_de: "Newton'sche Mechanik (Schulniveau)",
    name_en: "Newtonian mechanics (high-school level)",
    position: 12,
  },
  {
    code: "statistik",
    module_code: "schulwissen-auffrischen",
    name_de: "Wahrscheinlichkeit und einfache Statistik",
    name_en: "Probability and basic statistics",
    position: 13,
  },

  /* Thermodynamik I */
  {
    code: "kap-1-grundbegriffe",
    module_code: "thermodynamik-1",
    name_de: "Kapitel 1 — Grundbegriffe",
    name_en: "Chapter 1 — Fundamentals",
    position: 1,
  },
  {
    code: "kap-2-erster-hauptsatz",
    module_code: "thermodynamik-1",
    name_de: "Kapitel 2 — Erster Hauptsatz",
    name_en: "Chapter 2 — First law of thermodynamics",
    position: 2,
  },
];
