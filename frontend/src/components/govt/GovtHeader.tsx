"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Emblem } from "@/components/shared/Emblem";
import { useAuth } from "@/context/AuthContext";
import { GOVT_ROLE_LABELS } from "@/lib/types";

/** Government portal masthead — institutional (deep navy, amber seal). */
export function GovtHeader() {
  const { session, logout } = useAuth();
  const router = useRouter();

  return (
    <>
      <div aria-hidden className="h-1 bg-accent-500" />
      <header className="bg-hatch-dark border-b-2 border-accent-500 bg-navy-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-400"
          >
            <Emblem className="size-10 shrink-0 text-accent-400" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-300">
                Directorate of Industrial Safety &amp; Health
              </p>
              <p className="font-display text-base font-semibold leading-tight text-white">
                Government Officer Portal
              </p>
            </div>
          </Link>

          {session?.type === "govt" && (
            <div className="flex items-center gap-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-white">
                  {session.user.name}
                </p>
                <p className="text-xs text-navy-300">
                  {GOVT_ROLE_LABELS[session.user.role]}
                </p>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push("/govt");
                }}
                className="h-9 border border-navy-600 px-4 text-sm font-semibold text-navy-100 transition-colors hover:border-accent-400 hover:text-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
