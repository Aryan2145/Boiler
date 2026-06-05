"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GovtHeader } from "@/components/govt/GovtHeader";
import { Alert } from "@/components/shared/Alert";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Field";
import { useAuth } from "@/context/AuthContext";

export default function GovtLogin() {
  const { loginGovt } = useAuth();
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
      const session = await loginGovt(email, password);
      const isAdmin = session.type === "govt" && session.user.role === "ADMIN";
      router.push(isAdmin ? "/govt/admin" : "/govt/dashboard");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login failed.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-navy-950">
      <GovtHeader />

      <main className="bg-grid-dark flex flex-1 items-start justify-center px-5 py-12 sm:items-center sm:py-16">
        <div className="w-full max-w-md bg-white">
          <div aria-hidden className="h-1.5 bg-accent-500" />
          <div className="border-b border-navy-100 px-7 pb-5 pt-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-700">
              Authorised personnel only
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-navy-950">
              Officer sign in
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-navy-600">
              For administrators and officers of the directorate. Access is
              monitored and logged.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 px-7 py-7">
            {serverError && <Alert>{serverError}</Alert>}

            <Input
              label="Official email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="name@boiler.gov.in"
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
          </form>
        </div>
      </main>
    </div>
  );
}
