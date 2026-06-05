"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/govt/AdminNav";
import { GovtHeader } from "@/components/govt/GovtHeader";
import { RequireGovt } from "@/components/shared/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { GovtUser } from "@/lib/types";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-navy-200 bg-white px-6 py-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-500">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold text-navy-950">
        {value}
      </p>
    </div>
  );
}

function ActionCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col border border-navy-200 bg-white p-6 transition-colors hover:border-navy-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy-900"
    >
      <h3 className="font-display text-lg font-semibold text-navy-950">{title}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-navy-600">
        {description}
      </p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
        Open
        <span aria-hidden className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}

function AdminOverview() {
  const { session } = useAuth();
  const [officers, setOfficers] = useState<GovtUser[] | null>(null);

  useEffect(() => {
    api<GovtUser[]>("/govt/users")
      .then((users) => setOfficers(users.filter((u) => u.role !== "ADMIN")))
      .catch(() => setOfficers([]));
  }, []);

  const adminName = session?.type === "govt" ? session.user.name : "";
  const directors = officers?.filter((o) => o.role === "DIRECTOR").length ?? 0;
  const zones = officers ? new Set(officers.map((o) => o.zone)).size : 0;

  return (
    <div className="flex min-h-screen flex-col bg-navy-50">
      <GovtHeader />
      <AdminNav />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700">
            Administration
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-navy-950">
            Welcome, {adminName}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-navy-600">
            Departmental overview and administrative tools for the Boiler
            Inspection Portal.
          </p>
        </div>

        {/* Stats */}
        <section aria-label="Department statistics" className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Government officers"
            value={officers === null ? "—" : String(officers.length)}
          />
          <StatCard
            label="Directors"
            value={officers === null ? "—" : String(directors)}
          />
          <StatCard label="Zones covered" value={officers === null ? "—" : String(zones)} />
        </section>

        {/* Quick actions */}
        <section aria-label="Administrative tools" className="mt-10">
          <h2 className="mb-4 border-b-2 border-navy-900 pb-2 font-display text-xl font-semibold text-navy-950">
            Administrative tools
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ActionCard
              href="/govt/admin/users"
              title="User management"
              description="View, add and remove government officers — directors, deputy directors and assistant directors."
            />
            <div className="flex flex-col border border-dashed border-navy-300 bg-navy-50/50 p-6">
              <h3 className="font-display text-lg font-semibold text-navy-400">
                Inspection applications
              </h3>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-navy-400">
                Review and process contractor applications.
              </p>
              <span className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-400">
                Coming in Phase 2
              </span>
            </div>
            <div className="flex flex-col border border-dashed border-navy-300 bg-navy-50/50 p-6">
              <h3 className="font-display text-lg font-semibold text-navy-400">
                Reports
              </h3>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-navy-400">
                Departmental statistics and zone-wise summaries.
              </p>
              <span className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-400">
                Coming in Phase 2
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <RequireGovt role="admin">
      <AdminOverview />
    </RequireGovt>
  );
}
