"use client";

import { ContractorHeader } from "@/components/contractor/ContractorHeader";
import { RequireContractor } from "@/components/shared/RequireAuth";
import { useAuth } from "@/context/AuthContext";

function HardHatIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className} fill="none">
      <path
        d="M8 32c0-8.8 7.2-16 16-16s16 7.2 16 16"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path d="M20 17v-4h8v4" stroke="currentColor" strokeWidth="2.5" />
      <path d="M4 32h40v5H4z" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

function Dashboard() {
  const { session } = useAuth();
  if (session?.type !== "contractor") return null;
  const { user } = session;

  return (
    <div className="flex min-h-screen flex-col bg-navy-50">
      <ContractorHeader />

      <main className="bg-grid-light flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-lg border border-navy-200 bg-white px-8 py-12 text-center sm:px-12">
          <div className="mx-auto flex size-20 items-center justify-center border border-navy-200 bg-navy-50 text-navy-800">
            <HardHatIcon className="size-11" />
          </div>

          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700">
            Contractor dashboard
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-navy-950">
            Welcome, {user.fullName}
          </h1>
          <p className="mt-2 text-sm font-medium text-navy-500">
            {user.companyName} · License {user.licenseNo}
          </p>

          <div className="mx-auto mt-6 h-px w-16 bg-accent-500" aria-hidden />

          <p className="mt-6 text-base leading-relaxed text-navy-600">
            Your dashboard is being prepared. Check back soon.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function ContractorDashboardPage() {
  return (
    <RequireContractor>
      <Dashboard />
    </RequireContractor>
  );
}
