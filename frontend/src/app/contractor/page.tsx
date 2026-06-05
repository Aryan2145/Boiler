"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ContractorHeader } from "@/components/contractor/ContractorHeader";
import { Alert } from "@/components/shared/Alert";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Field";
import { useAuth } from "@/context/AuthContext";

export default function ContractorLogin() {
  const { loginContractor } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await loginContractor(email, password);
      router.push("/contractor/dashboard");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login failed.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-navy-50">
      <ContractorHeader />

      <main className="bg-grid-light flex flex-1 items-start justify-center px-5 py-12 sm:items-center sm:py-16">
        <div className="w-full max-w-md border border-navy-200 bg-white">
          <div className="border-b border-navy-100 px-7 pb-5 pt-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700">
              Contractor sign in
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-navy-950">
              Access your account
            </h1>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 px-7 py-7">
            {serverError && <Alert>{serverError}</Alert>}

            <Input
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="you@company.com"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="••••••••"
            />

            <Button type="submit" loading={submitting} className="mt-1 w-full">
              Sign in
            </Button>

            <p className="text-center text-sm text-navy-600">
              New contractor?{" "}
              <Link
                href="/contractor/signup"
                className="font-semibold text-navy-900 underline decoration-accent-500 decoration-2 underline-offset-2 hover:text-navy-700"
              >
                Register your company
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
