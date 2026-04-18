/**
 * Static extractors that walk an MDX body string (as loaded from the
 * filesystem) and collect:
 *
 *   - every German term the lesson touches — union of inline
 *     `<GermanTerm>` chips and the per-lesson `<VocabBlock>` list;
 *   - every formula — one per `<FormulaCard>`, with the anchor id
 *     the rendered page uses so the sidebar can scroll-link to it.
 *
 * Parsing is regex-based. It is safe for authored MDX (the only
 * input the app ever sees here) but is NOT a general MDX parser.
 * Extraction runs once per render at the server; the result ships
 * to the sticky sidebar as serialisable data.
 */

import { slugifyName } from "./slug";

export interface LessonTerm {
  de: string;
  en?: string;
  article?: "der" | "die" | "das";
  plural?: string;
  ipa?: string;
  source: "chip" | "vocab";
}

export interface LessonFormula {
  name_de: string;
  name_en?: string;
  latex?: string;
  anchorId: string;
}

export function extractLessonTerms(mdx: string): LessonTerm[] {
  const out = new Map<string, LessonTerm>();
  // 1. Inline <GermanTerm de="..." en="..." ... /> chips
  const chipRe = /<GermanTerm\b([^/>]*?)\/>/g;
  for (const m of mdx.matchAll(chipRe)) {
    const props = parseAttrString(m[1]);
    const de = props.de;
    if (!de) continue;
    if (!out.has(de)) {
      out.set(de, {
        de,
        en: props.en,
        article: (["der", "die", "das"] as const).includes(
          props.article as "der" | "die" | "das",
        )
          ? (props.article as "der" | "die" | "das")
          : undefined,
        plural: props.plural,
        ipa: props.ipa,
        source: "chip",
      });
    }
  }

  // 2. <VocabBlock> ... </VocabBlock> entries — children use a
  //    YAML-ish markdown list:
  //      - term: das System
  //        en: system
  //        plural: die Systeme
  //        ipa: /zʏsˈteːm/
  const vbRe = /<VocabBlock[^>]*>([\s\S]*?)<\/VocabBlock>/g;
  for (const m of mdx.matchAll(vbRe)) {
    const body = m[1];
    const entries = parseVocabBlockBody(body);
    for (const e of entries) {
      if (!e.de) continue;
      if (!out.has(e.de)) {
        out.set(e.de, { ...e, source: "vocab" });
      } else {
        const existing = out.get(e.de)!;
        // enrich missing fields
        out.set(e.de, {
          de: existing.de,
          en: existing.en ?? e.en,
          article: existing.article ?? e.article,
          plural: existing.plural ?? e.plural,
          ipa: existing.ipa ?? e.ipa,
          source: existing.source,
        });
      }
    }
  }

  return Array.from(out.values()).sort((a, b) =>
    a.de.localeCompare(b.de, "de", { sensitivity: "base" }),
  );
}

export function extractLessonFormulas(mdx: string): LessonFormula[] {
  const out: LessonFormula[] = [];
  // Match <FormulaCard  name_de="..." name_en="..." latex="..." ... >
  // or self-closing variant.
  const reBlock = /<FormulaCard\b([^>]*?)(?:\/>|>)/g;
  for (const m of mdx.matchAll(reBlock)) {
    const props = parseAttrString(m[1]);
    if (!props.name_de) continue;
    const anchorId = `formula-${slugifyName(props.name_de)}`;
    out.push({
      name_de: props.name_de,
      name_en: props.name_en,
      latex: props.latex,
      anchorId,
    });
  }
  return out;
}

/**
 * Parse simple JSX prop attributes: `name="value"` and `name={...}`.
 * Object/array expressions are captured as the raw expression text
 * (we don't evaluate them here — we only care about string props).
 */
function parseAttrString(s: string): Record<string, string> {
  const out: Record<string, string> = {};
  // quoted string attributes
  const strRe = /(\w+)\s*=\s*"((?:[^"\\]|\\.)*)"/g;
  for (const m of s.matchAll(strRe)) {
    out[m[1]] = m[2];
  }
  return out;
}

interface VocabBlockLine {
  de: string;
  en?: string;
  article?: "der" | "die" | "das";
  plural?: string;
  ipa?: string;
}

function parseVocabBlockBody(body: string): VocabBlockLine[] {
  // Each entry starts with a "- term: ..." line. Subsequent lines
  // up to the next "- term:" or end are that entry's sub-fields.
  const entries: VocabBlockLine[] = [];
  let current: Record<string, string> | null = null;

  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.replace(/^\s*-?\s*/, "").trimEnd();
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    const value = rawValue.replace(/^["'](.*)["']$/, "$1").trim();

    if (key === "term") {
      if (current) entries.push(normalise(current));
      current = { term: value };
    } else if (current) {
      current[key] = value;
    }
  }
  if (current) entries.push(normalise(current));
  return entries;
}

function normalise(r: Record<string, string>): VocabBlockLine {
  const term = r.term ?? "";
  let article: "der" | "die" | "das" | undefined;
  let de = term;
  const lead = term.split(" ", 1)[0];
  if (lead === "der" || lead === "die" || lead === "das") {
    article = lead;
    de = term.slice(lead.length + 1);
  }
  return {
    de,
    article,
    en: r.en,
    plural: r.plural,
    ipa: r.ipa,
  };
}
