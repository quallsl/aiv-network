import Link from "next/link";

export default function PageShell({ title = "AIV Network", subtitle = "AI film streaming & creator platform", children }) {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <Link href="/" className="text-lg font-bold tracking-wide">AIV Network</Link>
          <nav className="flex items-center gap-4 text-sm text-white/80">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/catalog" className="hover:text-white">Catalog</Link>
            <Link href="/submit" className="hover:text-white">Submit</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 pt-6 md:px-8">
        <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-3xl text-white/70">{subtitle}</p> : null}
      </section>

      {children}
    </main>
  );
}
