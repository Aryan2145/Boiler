"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  // Password is optional on edit — validate only when set.
  if (form.password && form.password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  if (form.confirmPassword !== form.password)
    errors.confirmPassword = "Passwords do not match.";
  return errors;
}

function EditUser() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<Form | null>(null);
  const [loadError, setLoadError] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api<GovtUser>(`/govt/users/${id}`)
      .then((u) =>
        setForm({
          name: u.name,
          role: u.role,
          phone: u.phone,
          email: u.email,
          zone: u.zone,
          password: "",
          confirmPassword: "",
        }),
      )
      .catch((err) =>
        setLoadError(err instanceof Error ? err.message : "Could not load user."),
      );
  }, [id]);

  function set<K extends keyof Form>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => (f ? { ...f, [key]: e.target.value } : f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setServerError("");

    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const { confirmPassword: _confirmPassword, password, ...rest } = form;
      await api<GovtUser>(`/govt/users/${id}`, {
        method: "PATCH",
        body: password ? { ...rest, password } : rest,
      });
      router.push("/govt/admin/users");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Could not update user.");
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
          <span className="font-semibold text-navy-800">Edit government user</span>
        </nav>

        <div className="mx-auto max-w-2xl border border-navy-200 bg-white">
          <div className="border-b border-navy-100 px-7 pb-5 pt-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700">
              Administration
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-navy-950">
              Edit government user
            </h1>
            {form && (
              <p className="mt-2 text-sm leading-relaxed text-navy-600">
                Updating the account of <strong>{form.name}</strong>.
              </p>
            )}
          </div>

          {loadError ? (
            <div className="px-7 py-7">
              <Alert>{loadError}</Alert>
              <Link
                href="/govt/admin/users"
                className="mt-4 inline-block text-sm font-semibold text-navy-900 underline decoration-accent-500 decoration-2 underline-offset-2"
              >
                Back to user management
              </Link>
            </div>
          ) : !form ? (
            <p className="px-7 py-10 text-center text-sm text-navy-500">
              Loading user…
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5 px-7 py-7"
            >
              {serverError && <Alert>{serverError}</Alert>}

              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Name" name="name" value={form.name} onChange={set("name")} error={errors.name} />
                <Select label="Role" name="role" value={form.role} onChange={set("role")} error={errors.role}>
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
              />

              <fieldset className="border-t border-navy-100 pt-5">
                <legend className="pr-3 text-[13px] font-semibold uppercase tracking-wide text-navy-700">
                  Reset password
                </legend>
                <p className="mb-4 text-xs text-navy-500">
                  Leave blank to keep the current password.
                </p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="New password"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={set("password")}
                    error={errors.password}
                    hint="Minimum 8 characters"
                  />
                  <Input
                    label="Confirm new password"
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={set("confirmPassword")}
                    error={errors.confirmPassword}
                  />
                </div>
              </fieldset>

              <div className="mt-1 flex flex-col gap-3 sm:flex-row">
                <Button type="submit" loading={submitting} className="flex-1">
                  Save changes
                </Button>
                <Link
                  href="/govt/admin/users"
                  className="inline-flex h-11 flex-1 items-center justify-center border border-navy-300 px-5 text-sm font-semibold text-navy-800 transition-colors hover:border-navy-500 hover:bg-navy-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default function EditUserPage() {
  return (
    <RequireGovt role="admin">
      <EditUser />
    </RequireGovt>
  );
}
