import Link from "next/link";
import { listPublishedLessons } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const lessons = await listPublishedLessons();

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 sm:py-16">
      <header className="mb-10">
        <h1 className="font-sans text-3xl sm:text-4xl font-semibold tracking-tight">
          EPT-Kompass
        </h1>
        <p className="mt-2 text-[color:var(--muted-foreground)]">
          Bilingualer Lernbegleiter für das B.Sc.-Studium Energie- und
          Prozesstechnik an der TU Berlin.
        </p>
        <p className="mt-1 text-sm text-[color:var(--muted-foreground)] italic">
          German always visible · English explanations · every exercise ships
          with pre-authored hint, solution, common mistakes, and Diskussion.
        </p>
      </header>

      <section>
        <h2 className="font-sans text-lg font-semibold mb-3">
          Lektionen — Referenz-Slice
        </h2>
        {lessons.length === 0 ? (
          <p className="text-sm text-[color:var(--muted-foreground)]">
            Noch keine Lektionen veröffentlicht. Run <code>npm run seed</code>{" "}
            to populate the database, or visit{" "}
            <Link
              href="/render-test"
              className="text-[color:var(--accent)] underline"
            >
              /render-test
            </Link>{" "}
            for the math-rendering gate.
          </p>
        ) : (
          <ul className="space-y-2">
            {lessons.map((l) => (
              <li
                key={l.slug}
                className="rounded border border-[color:var(--border)] bg-[color:var(--card)] p-4"
              >
                <Link href={`/lektion/${l.slug}`} className="group block">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <div className="font-serif text-base font-semibold group-hover:text-[color:var(--accent)]">
                        {l.name_de}
                      </div>
                      <div className="text-sm text-[color:var(--muted-foreground)]">
                        {l.name_en}
                      </div>
                    </div>
                    <div className="text-xs text-[color:var(--muted-foreground)] font-mono">
                      {l.track} · {l.module} · {l.estimated_minutes} min
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="mt-16 text-xs text-[color:var(--muted-foreground)]">
        EPT-Kompass v0 · No AI at runtime · Open the Klausur-Modus toggle inside
        any lesson to hide English translations.
      </footer>
    </main>
  );
}
