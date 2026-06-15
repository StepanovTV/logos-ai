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
    <div className="min-h-screen bg-[#131316] lg:h-screen lg:overflow-hidden">
      <Sidebar />
      <main className="bg-stage relative overflow-y-auto p-4 pt-16 text-[#e4e1e6] sm:p-6 sm:pt-16 lg:ml-[280px] lg:h-screen lg:p-12 lg:pt-12">
        <div className={contentClassName}>{children}</div>
      </main>
    </div>
  );
}
