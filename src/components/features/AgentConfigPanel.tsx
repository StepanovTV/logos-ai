"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import type { AgentConfig, AgentId } from "@/types/debate";
import { Bot } from "lucide-react";

type AgentModel = {
  value: string;
  label: string;
};

type AgentConfigPanelProps = {
  agent: AgentId;
  value: AgentConfig;
  availableModels: AgentModel[];
  onChange: (value: AgentConfig) => void;
};

const agentMeta: Record<
  AgentId,
  {
    title: string;
    badge: string;
    icon: typeof Bot;
    titleClass: string;
    iconClass: string;
  }
> = {
  alpha: {
    title: "Агент 1",
    badge: "ALPHA",
    icon: Bot,
    titleClass: "text-white",
    iconClass: "text-[#00f0ff]",
  },
  beta: {
    title: "Агент 2",
    badge: "BETA",
    icon: Bot,
    titleClass: "text-[#e9b3ff]",
    iconClass: "text-[#e9b3ff]",
  },
};

const focusRingClasses: Record<AgentId, string> = {
  alpha: "focus:border-[#00f0ff] focus:ring-[#00f0ff]/30",
  beta: "focus:border-[#e9b3ff] focus:ring-[#e9b3ff]/30",
};

const inputClasses =
  "w-full rounded-sm border border-white/10 bg-[#131316]/50 px-3 py-2 font-mono text-sm text-[#e4e1e6] placeholder:text-[#849495]/60 transition-colors focus:outline-none focus:ring-1";

export function AgentConfigPanel({
  agent,
  value,
  availableModels,
  onChange,
}: AgentConfigPanelProps) {
  const meta = agentMeta[agent];
  const Icon = meta.icon;
  const focusRing = focusRingClasses[agent];

  return (
    <GlassCard accent={agent} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${meta.iconClass}`} />
          <h3
            className={`font-heading text-base font-semibold ${meta.titleClass}`}
          >
            {meta.title}
          </h3>
        </div>
        <span className="rounded-sm bg-white/5 px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-[#849495]">
          {meta.badge}
        </span>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor={`${agent}-model`}
          className="font-mono text-[10px] uppercase tracking-wider text-[#849495]"
        >
          МОДЕЛЬ ИИ
        </label>
        <select
          id={`${agent}-model`}
          value={value.model}
          onChange={(event) =>
            onChange({ ...value, model: event.target.value })
          }
          className={`${inputClasses} ${focusRing}`}
        >
          {availableModels.map((model) => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor={`${agent}-character`}
          className="font-mono text-[10px] uppercase tracking-wider text-[#849495]"
        >
          ОПИСАНИЕ ХАРАКТЕРА
        </label>
        <textarea
          id={`${agent}-character`}
          rows={3}
          value={value.characterDescription}
          onChange={(event) =>
            onChange({ ...value, characterDescription: event.target.value })
          }
          className={`${inputClasses} resize-none ${focusRing}`}
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor={`${agent}-goals`}
          className="font-mono text-[10px] uppercase tracking-wider text-[#849495]"
        >
          ЦЕЛИ
        </label>
        <textarea
          id={`${agent}-goals`}
          rows={2}
          value={value.goals}
          onChange={(event) =>
            onChange({ ...value, goals: event.target.value })
          }
          className={`${inputClasses} resize-none ${focusRing}`}
        />
      </div>
    </GlassCard>
  );
}
