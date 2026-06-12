"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  accent?: "alpha" | "beta" | "none";
};

const accentClasses: Record<NonNullable<GlassCardProps["accent"]>, string> = {
  alpha:
    "border-l-4 border-l-[#00f0ff] shadow-[inset_4px_0_12px_-4px_rgba(0,240,255,0.15)]",
  beta: "border-r-4 border-r-[#e9b3ff] shadow-[inset_-4px_0_12px_-4px_rgba(233,179,255,0.15)]",
  none: "",
};

export function GlassCard({
  children,
  className = "",
  accent = "none",
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg border border-white/10 bg-[#1f1f22]/60 p-4 backdrop-blur-md sm:p-5 ${accentClasses[accent]} ${className}`}
    >
      {children}
    </motion.div>
  );
}
