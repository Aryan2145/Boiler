"use client";

import { GovtHeader } from "@/components/govt/GovtHeader";
import { RequireGovt } from "@/components/shared/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { GOVT_ROLE_LABELS } from "@/lib/types";

function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className} fill="none">
      <path
        d="M24 5l15 6v12c0 9.5-6.5 17.5-15 20-8.5-2.5-15-10.5-15-20V11l15-6z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M17 24l5 5 9-10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OfficerDashboard() {
  const { session } = useAuth();
  if (session?.type !== "govt") return null;
  const { user } = session;

  return (
    <div className="flex min-h-screen flex-col bg-navy-950">
      <GovtHeader />

      <main className="bg-grid-dark flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-lg bg-white text-center">
          <div aria-hidden className="h-1.5 bg-accent-500" />
          <div className="px-8 py-12 sm:px-12">
            <div className="mx-auto flex size-20 items-center justify-center border border-navy-200 bg-navy-50 text-navy-800">
              <ShieldIcon className="size-11" />
            </div>

            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700">
              Officer dashboard
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-navy-950">
              Welcome, {user.name}
            </h1>
            <p className="mt-2 text-sm font-medium text-navy-500">
              {GOVT_ROLE_LABELS[user.role]} · {user.zone}
            </p>

            <div className="mx-auto mt-6 h-px w-16 bg-accent-500" aria-hidden />

            <p className="mt-6 text-base leading-relaxed text-navy-600">
              Your dashboard is being prepared. Check back soon.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OfficerDashboardPage() {
  return (
    <RequireGovt role="officer">
      <OfficerDashboard />
    </RequireGovt>
  );
}
