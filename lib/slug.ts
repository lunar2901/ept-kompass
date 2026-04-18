/**
 * Slugify a German title for use as an HTML anchor / CSS id:
 *   "Idealgasgleichung (vier Formen)" → "idealgasgleichung-vier-formen"
 *   "Eigenschaften der Systemgrenze"  → "eigenschaften-der-systemgrenze"
 *
 * Handles umlauts (ä → ae, ö → oe, ü → ue, ß → ss) so anchors stay
 * ASCII-safe, strips punctuation, collapses whitespace.
 */
export function slugifyName(input: string): string {
  return input
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
