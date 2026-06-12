"use client";

import type { AgentId } from "@/types/debate";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

type AgentStatusCardProps = {
  agent: AgentId;
  name: string;
  framework: string;
};

const agentStyles: Record<
  AgentId,
  {
    accentBorder: string;
    iconBox: string;
    iconColor: string;
    frameworkColor: string;
    hoverGlow: string;
  }
> = {
  alpha: {
    accentBorder: "border-l-2 border-l-[#00f0ff]",
    iconBox: "bg-[#00f0ff]/10",
    iconColor: "text-[#00f0ff]",
    frameworkColor: "text-[#00f0ff]",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]",
  },
  beta: {
    accentBorder: "border-r-2 border-r-[#e9b3ff]",
    iconBox: "bg-[#e9b3ff]/10",
    iconColor: "text-[#e9b3ff]",
    frameworkColor: "text-[#e9b3ff]",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(233,179,255,0.2)]",
  },
};

export function AgentStatusCard({
  agent,
  name,
  framework,
}: AgentStatusCardProps) {
  const styles = agentStyles[agent];

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col items-center rounded-lg border border-white/10 bg-[#1f1f22]/60 py-10 backdrop-blur-md transition-shadow duration-200 ${styles.accentBorder} ${styles.hoverGlow}`}
    >
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${styles.iconBox}`}
      >
        <Bot className={`h-6 w-6 ${styles.iconColor}`} />
      </div>
      <h2 className="font-heading text-2xl font-semibold text-white">{name}</h2>
      <p
        className={`mt-2 font-mono text-[10px] uppercase tracking-widest ${styles.frameworkColor}`}
      >
        {framework}
      </p>
    </motion.div>
  );
}
