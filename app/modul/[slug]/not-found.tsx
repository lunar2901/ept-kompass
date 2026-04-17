import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16 text-center">
      <h1 className="font-serif text-3xl font-semibold">
        Modul nicht gefunden
      </h1>
      <p className="mt-3 text-[color:var(--muted-foreground)]">
        Dieses Modul steht nicht im Curriculum. Vielleicht ein veralteter Link?
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-[color:var(--accent)] underline"
      >
        Zurück zur Übersicht
      </Link>
    </main>
  );
}
