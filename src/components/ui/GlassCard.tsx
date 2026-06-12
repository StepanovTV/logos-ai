"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  accent?: "alpha" | "beta" | "none";
};

const accentClasses: Record<NonNullable<GlassCardProps["accent"]>, string> = {
  alpha: "border-l-4 border-l-primary",
  beta: "border-r-4 border-r-secondary",
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
      className={`glass-card p-4 ${accentClasses[accent]} ${className}`}
    >
      {children}
    </motion.div>
  );
}
