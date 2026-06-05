"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Emblem } from "@/components/shared/Emblem";
import { useAuth } from "@/context/AuthContext";

/** Contractor portal masthead — neutral corporate tone (white, navy text). */
export function ContractorHeader() {
  const { session, logout } = useAuth();
  const router = useRouter();

  return (
    <>
      <div aria-hidden className="h-1 bg-accent-500" />
      <header className="border-b border-navy-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy-900"
          >
            <Emblem className="size-9 shrink-0 text-navy-900" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-500">
                Boiler Inspection Portal
              </p>
              <p className="font-display text-base font-semibold leading-tight text-navy-900">
                Contractor Portal
              </p>
            </div>
          </Link>

          {session?.type === "contractor" && (
            <div className="flex items-center gap-4">
              <span className="hidden text-sm font-medium text-navy-700 sm:block">
                {session.user.fullName}
              </span>
              <button
                onClick={() => {
                  logout();
                  router.push("/contractor");
                }}
                className="h-9 border border-navy-300 px-4 text-sm font-semibold text-navy-800 transition-colors hover:border-navy-500 hover:bg-navy-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
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
