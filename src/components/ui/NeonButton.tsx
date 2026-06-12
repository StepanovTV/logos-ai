"use client";

import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type NeonButtonVariant = "alpha" | "beta";

type NeonButtonProps = {
  variant: NeonButtonVariant;
  children: ReactNode;
  className?: string;
} & Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "disabled" | "type"
>;

const variantClasses: Record<NeonButtonVariant, string> = {
  alpha:
    "border-primary text-primary hover:drop-shadow-[0_0_15px_#00f0ff] focus-visible:ring-primary/50",
  beta: "border-secondary text-secondary hover:drop-shadow-[0_0_15px_#e9b3ff] focus-visible:ring-secondary/50",
};

export function NeonButton({
  variant,
  children,
  onClick,
  disabled = false,
  type = "button",
  className = "",
}: NeonButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={`w-full rounded-sm border bg-transparent px-4 py-3 font-mono text-sm uppercase tracking-widest transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
