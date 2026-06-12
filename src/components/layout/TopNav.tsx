"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUser, Cog } from "lucide-react";

type TopNavTab = {
  label: string;
  href: string;
};

const tabs: TopNavTab[] = [
  { label: "Dashboard", href: "/" },
  { label: "Arena", href: "/active-session" },
  { label: "Archives", href: "/history" },
];

function isActiveTab(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
}

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between border-b border-white/5 pb-4">
      <div className="flex items-center gap-6">
        {tabs.map((tab) => {
          const active = isActiveTab(pathname, tab.href);
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`pb-1 font-body text-sm transition-colors ${
                active
                  ? "border-b-2 border-[#00f0ff] text-white"
                  : "border-b-2 border-transparent text-[#849495] hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Settings"
          className="flex h-8 w-8 items-center justify-center rounded-sm border border-transparent text-[#849495] transition-colors hover:border-white/10 hover:text-white"
        >
          <Cog className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="User profile"
          className="flex h-8 w-8 items-center justify-center rounded-sm border border-transparent text-[#849495] transition-colors hover:border-white/10 hover:text-white"
        >
          <CircleUser className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
