/**
 * Curriculum re-exports for the seed script.
 *
 * Source of truth lives at `lib/curriculum-data.ts` so the frontend
 * navigation and the seed script share one definition.
 */

export type {
  TrackSeed,
  ModuleSeed,
  ChapterSeed,
} from "../lib/curriculum-data";

export {
  TRACKS,
  MODULES,
  CHAPTERS,
} from "../lib/curriculum-data";
