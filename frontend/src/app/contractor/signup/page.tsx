"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ContractorHeader } from "@/components/contractor/ContractorHeader";
import { Alert } from "@/components/shared/Alert";
import { Button } from "@/components/shared/Button";
import { Input, Textarea } from "@/components/shared/Field";
import { useAuth } from "@/context/AuthContext";

type Form = {
  fullName: string;
  licenseNo: string;
  companyName: string;
  companyAddress: string;
  telephone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const EMPTY: Form = {
  fullName: "",
  licenseNo: "",
  companyName: "",
  companyAddress: "",
  telephone: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function validate(form: Form) {
  const errors: Partial<Record<keyof Form, string>> = {};
  if (!form.fullName.trim()) errors.fullName = "Full name is required.";
  if (!form.licenseNo.trim()) errors.licenseNo = "License number is required.";
  if (!form.companyName.trim()) errors.companyName = "Company name is required.";
  if (!form.companyAddress.trim())
    errors.companyAddress = "Company address is required.";
  if (!form.telephone.trim()) errors.telephone = "Telephone is required.";
  else if (!/^[0-9+\-() ]{7,20}$/.test(form.telephone.trim()))
    errors.telephone = "Enter a valid telephone number.";
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!/^\S+@\S+\.\S+$/.test(form.email))
    errors.email = "Enter a valid email address.";
  if (!form.password) errors.password = "Password is required.";
  else if (form.password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  if (form.confirmPassword !== form.password)
    errors.confirmPassword = "Passwords do not match.";
  return errors;
}

export default function ContractorSignup() {
  const { signupContractor } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof Form>(key: K) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setForm((f) => ({ ...f, [key]: e.target.value }));
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
      await signupContractor(payload);
      router.push("/contractor/dashboard");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Registration failed.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-navy-50">
      <ContractorHeader />

      <main className="bg-grid-light flex flex-1 justify-center px-5 py-12 sm:py-16">
        <div className="h-fit w-full max-w-2xl border border-navy-200 bg-white">
          <div className="border-b border-navy-100 px-7 pb-5 pt-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700">
              Contractor registration
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-navy-950">
              Register your company
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-navy-600">
              Provide your license and company details. Your license number is
              verified against existing registrations.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 px-7 py-7">
            {serverError && <Alert>{serverError}</Alert>}

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Full name"
                name="fullName"
                autoComplete="name"
                value={form.fullName}
                onChange={set("fullName")}
                error={errors.fullName}
              />
              <Input
                label="License no."
                name="licenseNo"
                value={form.licenseNo}
                onChange={set("licenseNo")}
                error={errors.licenseNo}
                hint="As issued by the directorate"
              />
            </div>

            <Input
              label="Company name"
              name="companyName"
              autoComplete="organization"
              value={form.companyName}
              onChange={set("companyName")}
              error={errors.companyName}
            />

            <Textarea
              label="Company address"
              name="companyAddress"
              autoComplete="street-address"
              value={form.companyAddress}
              onChange={set("companyAddress")}
              error={errors.companyAddress}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Telephone"
                type="tel"
                name="telephone"
                autoComplete="tel"
                value={form.telephone}
                onChange={set("telephone")}
                error={errors.telephone}
              />
              <Input
                label="Email"
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={set("email")}
                error={errors.email}
              />
            </div>

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

            <Button type="submit" loading={submitting} className="mt-1 w-full">
              Create account
            </Button>

            <p className="text-center text-sm text-navy-600">
              Already registered?{" "}
              <Link
                href="/contractor"
                className="font-semibold text-navy-900 underline decoration-accent-500 decoration-2 underline-offset-2 hover:text-navy-700"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
