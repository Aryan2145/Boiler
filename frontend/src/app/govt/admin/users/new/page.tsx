"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminNav } from "@/components/govt/AdminNav";
import { GovtHeader } from "@/components/govt/GovtHeader";
import { Alert } from "@/components/shared/Alert";
import { Button } from "@/components/shared/Button";
import { Input, Select } from "@/components/shared/Field";
import { RequireGovt } from "@/components/shared/RequireAuth";
import { api } from "@/lib/api";
import type { GovtUser } from "@/lib/types";

type Form = {
  name: string;
  role: string;
  phone: string;
  email: string;
  zone: string;
  password: string;
  confirmPassword: string;
};

const EMPTY: Form = {
  name: "",
  role: "",
  phone: "",
  email: "",
  zone: "",
  password: "",
  confirmPassword: "",
};

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
  if (!form.password) errors.password = "Password is required.";
  else if (form.password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  if (form.confirmPassword !== form.password)
    errors.confirmPassword = "Passwords do not match.";
  return errors;
}

function NewUser() {
  const router = useRouter();
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof Form>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const { confirmPassword: _confirmPassword, ...payload } = form;
      await api<GovtUser>("/govt/users", { method: "POST", body: payload });
      router.push("/govt/admin/users");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Could not create user.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-navy-50">
      <GovtHeader />
      <AdminNav />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-navy-500">
          <Link
            href="/govt/admin/users"
            className="font-medium hover:text-navy-800 hover:underline"
          >
            User management
          </Link>
          <span aria-hidden className="mx-2">/</span>
          <span className="font-semibold text-navy-800">Add government user</span>
        </nav>

        <div className="mx-auto max-w-2xl border border-navy-200 bg-white">
          <div className="border-b border-navy-100 px-7 pb-5 pt-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700">
              Administration
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-navy-950">
              Add government user
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-navy-600">
              The officer signs in at the government portal using the email and
              password you set here.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 px-7 py-7">
            {serverError && <Alert>{serverError}</Alert>}

            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Name" name="name" value={form.name} onChange={set("name")} error={errors.name} />
              <Select label="Role" name="role" value={form.role} onChange={set("role")} error={errors.role}>
                <option value="">Select role…</option>
                <option value="DIRECTOR">Director</option>
                <option value="DEPUTY_DIRECTOR">Deputy Director</option>
                <option value="ASSISTANT_DIRECTOR">Assistant Director</option>
              </Select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
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
            </div>

            <Input
              label="Zone"
              name="zone"
              value={form.zone}
              onChange={set("zone")}
              error={errors.zone}
              hint="e.g. North Zone, Coastal Region"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Password"
                type="password"
                name="password"
                autoComplete="new-password"
                value={form.password}
                onChange={set("password")}
                error={errors.password}
                hint="Minimum 8 characters"
              />
              <Input
                label="Confirm password"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                error={errors.confirmPassword}
              />
            </div>

            <div className="mt-1 flex flex-col gap-3 sm:flex-row">
              <Button type="submit" loading={submitting} className="flex-1">
                Create user
              </Button>
              <Link
                href="/govt/admin/users"
                className="inline-flex h-11 flex-1 items-center justify-center border border-navy-300 px-5 text-sm font-semibold text-navy-800 transition-colors hover:border-navy-500 hover:bg-navy-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function NewUserPage() {
  return (
    <RequireGovt role="admin">
      <NewUser />
    </RequireGovt>
  );
}
