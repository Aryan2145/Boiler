"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/govt/admin", label: "Overview", exact: true },
  { href: "/govt/admin/users", label: "User management", exact: false },
];

/** Section navigation for the admin area — sits under the govt masthead. */
export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Administration" className="border-b border-navy-200 bg-white">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 sm:px-8">
        {TABS.map((tab) => {
          const active = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-navy-900 ${
                active
                  ? "border-accent-500 text-navy-950"
                  : "border-transparent text-navy-500 hover:border-navy-300 hover:text-navy-800"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
