import Link from "next/link";
import { Emblem } from "@/components/shared/Emblem";

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Amber government rule */}
      <div aria-hidden className="h-1 bg-accent-500" />

      {/* Masthead */}
      <header className="border-b border-navy-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-4 sm:px-8">
          <Emblem className="size-11 shrink-0 text-navy-900" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-500">
              Directorate of Industrial Safety &amp; Health
            </p>
            <p className="font-display text-lg font-semibold leading-tight text-navy-900">
              Boiler Inspection Portal
            </p>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="bg-grid-light border-b border-navy-100">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
            <p className="mb-4 inline-block border border-navy-300 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-600">
              Official Government Portal
            </p>
            <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight text-navy-950 sm:text-5xl">
              Boiler inspection applications, managed in one place.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-600 sm:text-lg">
              Licensed contractors submit and track inspection applications.
              Government officers review, approve and administer them — securely
              and transparently.
            </p>
          </div>
        </section>

        {/* Portal cards */}
        <section
          aria-label="Choose your portal"
          className="mx-auto grid max-w-6xl gap-6 px-5 py-12 sm:px-8 md:grid-cols-2"
        >
          {/* Contractor */}
          <Link
            href="/contractor"
            className="group flex flex-col border border-navy-200 bg-white p-7 transition-colors hover:border-navy-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy-900 sm:p-9"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700">
              For licensed contractors
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-navy-950">
              Contractor Portal
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600">
              Register your company, submit boiler inspection applications and
              follow their progress.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
              Enter Contractor Portal
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </Link>

          {/* Government */}
          <Link
            href="/govt"
            className="group bg-grid-dark flex flex-col border border-navy-900 bg-navy-900 p-7 transition-colors hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy-900 sm:p-9"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-400">
              For authorised officers
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-white">
              Government Portal
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-200">
              Departmental access for directors and inspection officers to
              review applications and manage users.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-400">
              Enter Government Portal
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-200 bg-navy-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-5 text-xs text-navy-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} Directorate of Industrial Safety &amp;
            Health. All rights reserved.
          </p>
          <p className="font-medium uppercase tracking-wider">
            Authorised use only
          </p>
        </div>
      </footer>
    </div>
  );
}
