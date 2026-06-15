"use client";

import {
  HelpCircle,
  History,
  Menu,
  MessageSquare,
  PlusSquare,
  Settings,
  Target,
  User,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const mainNavItems: NavItem[] = [
  { label: "New Debate", href: "/", icon: PlusSquare },
  { label: "Active Session", href: "/active-session", icon: MessageSquare },
  { label: "History", href: "/history", icon: History },
  { label: "Models", href: "/models", icon: Target },
];

const bottomNavItems: NavItem[] = [
  { label: "Settings", href: "#", icon: Settings },
  { label: "Support", href: "#", icon: HelpCircle },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  if (href === "/active-session") {
    return pathname.startsWith("/session") || pathname === "/active-session";
  }
  return pathname.startsWith(href);
}

function NavLink({
  label,
  href,
  icon: Icon,
  active,
  onNavigate,
}: NavItem & { active: boolean; onNavigate?: () => void }) {
  const className = `flex w-full items-center gap-3 px-4 py-2.5 text-left font-body text-sm transition-colors ${
    active
      ? "border-l-2 border-[#e9b3ff] bg-white/5 text-white"
      : "border-l-2 border-transparent text-[#849495] hover:text-white"
  }`;

  if (href === "#") {
    return (
      <button type="button" className={className}>
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </button>
    );
  }

  return (
    <Link href={href} className={className} onClick={onNavigate}>
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isHistoryPage = pathname.startsWith("/history");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-white/5 bg-[#131316]/95 px-4 backdrop-blur-md lg:hidden">
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={() => setIsOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 text-[#e4e1e6] transition-colors hover:border-white/20 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="font-heading text-sm font-bold text-white">
            Command Center
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#849495]">
            Analytical Mode
          </p>
        </div>
        <div className="h-9 w-9" aria-hidden="true" />
      </header>

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeMenu}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[280px] shrink-0 flex-col justify-between border-r border-white/5 bg-[#131316] transition-transform duration-300 lg:z-30 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between px-5 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <User className="h-4 w-4 text-[#849495]" />
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-white">
                  Command Center
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#849495]">
                  Analytical Mode
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={closeMenu}
              className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/10 text-[#849495] transition-colors hover:text-white lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="mt-2 space-y-0.5">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.label}
                {...item}
                active={isActivePath(pathname, item.href)}
                onNavigate={closeMenu}
              />
            ))}
          </nav>
        </div>

        <nav className="space-y-0.5 pb-6">
          {isHistoryPage && (
            <Link
              href="/"
              onClick={closeMenu}
              className="mx-4 mb-3 flex w-[calc(100%-2rem)] items-center justify-center rounded-sm border border-white/10 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-[#e9b3ff] transition-all hover:border-[#e9b3ff] hover:shadow-[0_0_15px_rgba(233,179,255,0.3)]"
            >
              INITIALIZE NEW DEBATE
            </Link>
          )}
          {bottomNavItems.map((item) => (
            <NavLink key={item.label} {...item} active={false} />
          ))}
        </nav>
      </aside>
    </>
  );
}
