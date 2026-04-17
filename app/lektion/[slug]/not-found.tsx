import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16 text-center">
      <h1 className="font-sans text-3xl font-semibold">
        Lektion nicht gefunden
      </h1>
      <p className="mt-3 text-[color:var(--muted-foreground)]">
        Diese Lektion existiert nicht. Das kann an einem veralteten Link liegen,
        oder daran, dass sie noch im Status <code>stub</code> ist und damit noch
        nicht veröffentlicht.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-[color:var(--accent)] underline"
      >
        Zurück zur Startseite
      </Link>
    </main>
  );
}
