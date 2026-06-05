"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-50">
      <div className="flex items-center gap-3 text-navy-600">
        <span
          aria-hidden
          className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
        <span className="text-sm font-semibold uppercase tracking-widest">
          Verifying session…
        </span>
      </div>
    </main>
  );
}

/** Guards contractor-only pages. */
export function RequireContractor({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!session || session.type !== "contractor")) {
      router.replace("/contractor");
    }
  }, [loading, session, router]);

  if (loading || !session || session.type !== "contractor") {
    return <LoadingScreen />;
  }
  return <>{children}</>;
}

/**
 * Guards government pages.
 * role="admin" → admin only; role="officer" → non-admin officers only.
 */
export function RequireGovt({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "admin" | "officer";
}) {
  const { session, loading } = useAuth();
  const router = useRouter();

  const isGovt = session?.type === "govt";
  const isAdmin = isGovt && session.user.role === "ADMIN";
  const allowed = isGovt && (role === "admin" ? isAdmin : !isAdmin);

  useEffect(() => {
    if (loading) return;
    if (!isGovt) router.replace("/govt");
    else if (!allowed) router.replace(isAdmin ? "/govt/admin" : "/govt/dashboard");
  }, [loading, isGovt, allowed, isAdmin, router]);

  if (loading || !allowed) return <LoadingScreen />;
  return <>{children}</>;
}
