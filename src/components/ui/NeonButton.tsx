"use client";

import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type NeonButtonVariant = "alpha" | "beta";

type NeonButtonProps = {
  variant?: NeonButtonVariant;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
} & Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "disabled" | "type"
>;

const variantClasses: Record<NeonButtonVariant, string> = {
  alpha:
    "border-white/20 text-white hover:border-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] focus-visible:ring-[#00f0ff]/50",
  beta: "border-white/20 text-white hover:border-[#e9b3ff] hover:shadow-[0_0_15px_rgba(233,179,255,0.3)] focus-visible:ring-[#e9b3ff]/50",
};

export function NeonButton({
  variant = "alpha",
  children,
  icon,
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
      className={`inline-flex items-center gap-2 rounded-sm border bg-transparent px-6 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
    >
      {icon}
      {children}
    </motion.button>
  );
}
