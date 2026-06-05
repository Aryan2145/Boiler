"use client";

import { useCallback, useEffect, useState } from "react";
import { GovtHeader } from "@/components/govt/GovtHeader";
import { Alert } from "@/components/shared/Alert";
import { Button } from "@/components/shared/Button";
import { Input, Select } from "@/components/shared/Field";
import { RequireGovt } from "@/components/shared/RequireAuth";
import { api } from "@/lib/api";
import { GOVT_ROLE_LABELS, type GovtUser } from "@/lib/types";

type Form = {
  name: string;
  role: string;
  phone: string;
  email: string;
  zone: string;
};

const EMPTY: Form = { name: "", role: "", phone: "", email: "", zone: "" };

function validate(form: Form) {
  const errors: Partial<Record<keyof Form, string>> = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.role) errors.role = "Select a role.";
  if (!form.phone.trim()) errors.phone = "Phone number is required.";
  else if (!/^[0-9+\-() ]{7,20}$/.test(form.phone.trim()))
    errors.phone = "Enter a valid phone number.";
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!/^\S+@\S+\.\S+$/.test(form.email))
    errors.email = "Enter a valid email address.";
  if (!form.zone.trim()) errors.zone = "Zone is required.";
  return errors;
}

function CreateUserForm({ onCreated }: { onCreated: (user: GovtUser) => void }) {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof Form>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    setSuccess("");

    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const user = await api<GovtUser>("/govt/users", {
        method: "POST",
        body: form,
      });
      onCreated(user);
      setForm(EMPTY);
      setSuccess(
        `${user.name} added. Initial password: Officer@123 — ask them to change it.`,
      );
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Could not create user.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="h-fit border border-navy-200 bg-white">
      <div className="border-b border-navy-100 px-6 pb-4 pt-6">
        <h2 className="font-display text-xl font-semibold text-navy-950">
          Create government user
        </h2>
        <p className="mt-1 text-sm text-navy-600">
          New officers sign in at the officer portal with their email.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 px-6 py-6">
        {serverError && <Alert>{serverError}</Alert>}
        {success && <Alert tone="success">{success}</Alert>}

        <Input label="Name" name="name" value={form.name} onChange={set("name")} error={errors.name} />

        <Select label="Role" name="role" value={form.role} onChange={set("role")} error={errors.role}>
          <option value="">Select role…</option>
          <option value="DIRECTOR">Director</option>
          <option value="DEPUTY_DIRECTOR">Deputy Director</option>
          <option value="ASSISTANT_DIRECTOR">Assistant Director</option>
        </Select>

        <Input
          label="Phone number"
          type="tel"
          name="phone"
          value={form.phone}
          onChange={set("phone")}
          error={errors.phone}
        />
        <Input
          label="Email ID"
          type="email"
          name="email"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
        />
        <Input
          label="Zone"
          name="zone"
          value={form.zone}
          onChange={set("zone")}
          error={errors.zone}
          hint="e.g. North Zone, Coastal Region"
        />

        <Button type="submit" loading={submitting} className="mt-1 w-full">
          Add user
        </Button>
      </form>
    </section>
  );
}

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

function AdminDashboard() {
  const [users, setUsers] = useState<GovtUser[] | null>(null);
  const [listError, setListError] = useState("");

  const load = useCallback(async () => {
    setListError("");
    try {
      setUsers(await api<GovtUser[]>("/govt/users"));
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Could not load users.");
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(id: string) {
    try {
      await api(`/govt/users/${id}`, { method: "DELETE" });
      setUsers((u) => (u ? u.filter((x) => x.id !== id) : u));
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Could not delete user.");
    }
  }

  const officers = users?.filter((u) => u.role !== "ADMIN") ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-navy-50">
      <GovtHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700">
            Administration
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-navy-950">
            User management
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(320px,380px)_1fr] lg:items-start">
          <CreateUserForm
            onCreated={(user) => setUsers((u) => (u ? [...u, user] : [user]))}
          />

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
              {listError && (
                <div className="mb-4">
                  <Alert>{listError}</Alert>
                </div>
              )}

              {users === null ? (
                <p className="py-8 text-center text-sm text-navy-500">Loading users…</p>
              ) : officers.length === 0 ? (
                <p className="py-8 text-center text-sm text-navy-500">
                  No officers yet. Create the first one using the form.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-sm">
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
                            <DeleteButton onConfirm={() => handleDelete(u.id)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <RequireGovt role="admin">
      <AdminDashboard />
    </RequireGovt>
  );
}
