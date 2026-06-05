"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/govt/AdminNav";
import { GovtHeader } from "@/components/govt/GovtHeader";
import { Alert } from "@/components/shared/Alert";
import { RequireGovt } from "@/components/shared/RequireAuth";
import { api } from "@/lib/api";
import { GOVT_ROLE_LABELS, type GovtUser } from "@/lib/types";

function DeleteButton({ onConfirm }: { onConfirm: () => Promise<void> }) {
  const [arming, setArming] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!arming) return;
    const t = setTimeout(() => setArming(false), 4000);
    return () => clearTimeout(t);
  }, [arming]);

  if (!arming) {
    return (
      <button
        onClick={() => setArming(true)}
        className="h-8 border border-navy-300 px-3 text-xs font-semibold text-navy-700 transition-colors hover:border-red-500 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
      >
        Delete
      </button>
    );
  }
  return (
    <button
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await onConfirm();
      }}
      className="h-8 border border-red-600 bg-red-50 px-3 text-xs font-bold text-red-700 transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:opacity-50"
    >
      {busy ? "Removing…" : "Confirm delete"}
    </button>
  );
}

function UsersList() {
  const [users, setUsers] = useState<GovtUser[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<GovtUser[]>("/govt/users")
      .then(setUsers)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Could not load users.");
        setUsers([]);
      });
  }, []);

  async function handleDelete(id: string) {
    setError("");
    try {
      await api(`/govt/users/${id}`, { method: "DELETE" });
      setUsers((u) => (u ? u.filter((x) => x.id !== id) : u));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete user.");
    }
  }

  const officers = users?.filter((u) => u.role !== "ADMIN") ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-navy-50">
      <GovtHeader />
      <AdminNav />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700">
              Administration
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold text-navy-950">
              User management
            </h1>
            <p className="mt-2 text-sm text-navy-600">
              Officers listed here can sign in at the government portal.
            </p>
          </div>
          <Link
            href="/govt/admin/users/new"
            className="inline-flex h-11 items-center gap-2 bg-navy-900 px-5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
          >
            <span aria-hidden className="text-base leading-none">+</span>
            Add government user
          </Link>
        </div>

        {error && (
          <div className="mb-6">
            <Alert>{error}</Alert>
          </div>
        )}

        <section className="border border-navy-200 bg-white">
          <div className="flex items-baseline justify-between border-b border-navy-100 px-6 pb-4 pt-6">
            <h2 className="font-display text-xl font-semibold text-navy-950">
              Government users
            </h2>
            <p className="text-sm font-medium text-navy-500">
              {officers.length} officer{officers.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="px-6 py-4">
            {users === null ? (
              <p className="py-10 text-center text-sm text-navy-500">Loading users…</p>
            ) : officers.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-navy-500">No officers yet.</p>
                <Link
                  href="/govt/admin/users/new"
                  className="mt-2 inline-block text-sm font-semibold text-navy-900 underline decoration-accent-500 decoration-2 underline-offset-2 hover:text-navy-700"
                >
                  Add the first government user
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-navy-900 text-[11px] uppercase tracking-wider text-navy-600">
                      <th scope="col" className="py-2.5 pr-4 font-semibold">Name</th>
                      <th scope="col" className="py-2.5 pr-4 font-semibold">Role</th>
                      <th scope="col" className="py-2.5 pr-4 font-semibold">Contact</th>
                      <th scope="col" className="py-2.5 pr-4 font-semibold">Zone</th>
                      <th scope="col" className="py-2.5 text-right font-semibold">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {officers.map((u) => (
                      <tr key={u.id} className="border-b border-navy-100">
                        <td className="py-3 pr-4 font-semibold text-navy-900">{u.name}</td>
                        <td className="py-3 pr-4 text-navy-700">
                          {GOVT_ROLE_LABELS[u.role]}
                        </td>
                        <td className="py-3 pr-4 text-navy-700">
                          <div>{u.email}</div>
                          <div className="text-xs text-navy-500">{u.phone}</div>
                        </td>
                        <td className="py-3 pr-4 text-navy-700">{u.zone}</td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/govt/admin/users/${u.id}/edit`}
                              className="inline-flex h-8 items-center border border-navy-300 px-3 text-xs font-semibold text-navy-700 transition-colors hover:border-navy-600 hover:text-navy-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
                            >
                              Edit
                            </Link>
                            <DeleteButton onConfirm={() => handleDelete(u.id)} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function UsersListPage() {
  return (
    <RequireGovt role="admin">
      <UsersList />
    </RequireGovt>
  );
}
