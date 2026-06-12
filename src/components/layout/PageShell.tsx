"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

type PageShellProps = {
  children: ReactNode;
  variant?: "default" | "fluid";
};

export function PageShell({ children, variant = "default" }: PageShellProps) {
  const contentClassName =
    variant === "fluid"
      ? "relative z-10 w-full"
      : "relative z-10 mx-auto w-full max-w-6xl";

  return (
    <div className="flex min-h-screen bg-[#131316]">
      <Sidebar />
      <main className="bg-stage relative flex-1 overflow-y-auto p-4 pt-16 text-[#e4e1e6] sm:p-6 sm:pt-16 lg:p-12 lg:pt-12">
        <div className={contentClassName}>{children}</div>
      </main>
    </div>
  );
}
