import { buildNavigation } from "@/lib/navigation";
import { ModuleCard } from "@/components/module-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const tracks = await buildNavigation();
  const totalPublished = tracks.reduce((s, t) => s + t.publishedLessons, 0);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:py-12">
      <header className="mb-12 max-w-2xl">
        <h1 className="font-sans text-3xl sm:text-4xl font-semibold tracking-tight">
          EPT-Kompass
        </h1>
        <p className="mt-2 text-[color:var(--foreground)]/85">
          Bilingualer Lernbegleiter für das B.Sc.-Studium{" "}
          <span className="italic">Energie- und Prozesstechnik</span> an der TU
          Berlin.
        </p>
        <p className="mt-3 text-sm text-[color:var(--muted-foreground)] klausur-hide-en:hidden">
          German always visible · English explanations · every exercise ships
          with pre-authored hint, solution, common mistakes, and Diskussion.
          Aktuell sind <strong>{totalPublished}</strong> Lektionen
          veröffentlicht.
        </p>
      </header>

      <div className="space-y-14">
        {tracks.map((track) => (
          <section key={track.code} aria-labelledby={`track-${track.code}`}>
            <header className="mb-5 max-w-2xl">
              <div className="flex items-baseline gap-3">
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[color:var(--muted-foreground)]">
                  Track {track.code}
                </span>
                <span className="text-xs text-[color:var(--muted-foreground)] font-mono">
                  {track.publishedLessons} / {Math.max(track.totalLessons, track.publishedLessons)} Lektionen
                </span>
              </div>
              <h2
                id={`track-${track.code}`}
                className="mt-1 font-serif text-2xl font-semibold tracking-tight"
              >
                {track.name_de}
              </h2>
              <p className="mt-0.5 text-sm text-[color:var(--muted-foreground)] klausur-hide-en:hidden">
                {track.name_en}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--foreground)]/85">
                {track.description_de}
              </p>
            </header>
            <div className="grid gap-3 sm:grid-cols-2">
              {track.modules.map((module) => (
                <ModuleCard key={module.code} module={module} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-16 border-t border-[color:var(--border)] pt-6 text-xs text-[color:var(--muted-foreground)]">
        EPT-Kompass v0 · No AI at runtime · Open the Klausur-Modus toggle (top
        right or press <kbd className="rounded border border-[color:var(--border)] bg-[color:var(--muted)] px-1 py-0.5 font-mono">k</kbd>) to hide English translations.
      </footer>
    </div>
  );
}
