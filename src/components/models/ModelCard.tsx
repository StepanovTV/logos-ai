"use client";

import type { ModelAccent, ModelIcon, RegistryModel } from "@/types/models";
import { motion } from "framer-motion";
import { Brain, Check, Cpu, Infinity, Network } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ModelCardProps = {
  model: RegistryModel;
  onToggle: (id: string) => void;
};

const iconMap: Record<ModelIcon, LucideIcon> = {
  brain: Brain,
  cpu: Cpu,
  infinity: Infinity,
  network: Network,
};

const accentStyles: Record<
  ModelAccent,
  { border: string; iconBg: string; iconColor: string; hoverGlow: string }
> = {
  alpha: {
    border: "border-l-4 border-l-[#00f0ff]",
    iconBg: "bg-[#00f0ff]/10",
    iconColor: "text-[#00f0ff]",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]",
  },
  beta: {
    border: "border-l-4 border-l-[#e9b3ff]",
    iconBg: "bg-[#e9b3ff]/10",
    iconColor: "text-[#e9b3ff]",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(233,179,255,0.15)]",
  },
};

export function ModelCard({ model, onToggle }: ModelCardProps) {
  const Icon = iconMap[model.icon];
  const isActive = model.active;
  const accent = isActive ? model.accent : undefined;
  const styles = accent ? accentStyles[accent] : null;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col rounded-lg border border-white/10 bg-[#1f1f22]/60 p-6 backdrop-blur-md transition-shadow duration-200 ${
        styles ? `${styles.border} ${styles.hoverGlow}` : "hover:border-white/20"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-white/10 ${
              styles ? styles.iconBg : "bg-white/5"
            }`}
          >
            <Icon
              className={`h-5 w-5 ${styles ? styles.iconColor : "text-[#849495]"}`}
            />
          </div>
          <div>
            <h3 className="font-heading text-xl font-semibold text-white">
              {model.name}
            </h3>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[#849495]">
              {model.provider}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          aria-label={`${isActive ? "Deactivate" : "Activate"} ${model.name}`}
          onClick={() => onToggle(model.id)}
          className={`relative flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
            isActive
              ? "border-[#00f0ff]/50 bg-[#00f0ff]"
              : "border-white/10 bg-[#131316]"
          }`}
        >
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full transition-transform ${
              isActive
                ? "translate-x-[22px] bg-white"
                : "translate-x-0.5 bg-[#849495]/40"
            }`}
          >
            {isActive && <Check className="h-3 w-3 text-[#00f0ff]" strokeWidth={3} />}
          </span>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#849495]">
            Param Count
          </p>
          <p className="mt-1 font-mono text-sm text-white">{model.paramCount}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#849495]">
            Context Win
          </p>
          <p className="mt-1 font-mono text-sm text-white">
            {model.contextWindow}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-b border-white/10 pb-4">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#849495]">
          Release Date
        </span>
        <span className="font-mono text-xs text-[#849495]">{model.releaseDate}</span>
      </div>

      <div className="mt-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[#849495]">
          Reasoning Style
        </p>
        <p className="mt-2 font-body text-sm leading-relaxed text-[#b9cacb]">
          {model.reasoningStyle}
        </p>
      </div>
    </motion.article>
  );
}
