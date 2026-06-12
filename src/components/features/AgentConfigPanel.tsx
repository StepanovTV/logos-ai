"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { AGENT_MODELS } from "@/constants/models";
import type { AgentConfig, AgentId } from "@/types/debate";

type AgentConfigPanelProps = {
  agent: AgentId;
  value: AgentConfig;
  onChange: (value: AgentConfig) => void;
};

const agentLabels: Record<AgentId, string> = {
  alpha: "Agent Alpha",
  beta: "Agent Beta",
};

const focusRingClasses: Record<AgentId, string> = {
  alpha: "focus:border-primary focus:ring-primary/30",
  beta: "focus:border-secondary focus:ring-secondary/30",
};

const inputClasses =
  "w-full rounded-sm border border-white/10 bg-surface/30 px-3 py-2 font-mono text-sm text-text-main placeholder:text-text-muted/60 transition-colors focus:outline-none focus:ring-1";

export function AgentConfigPanel({
  agent,
  value,
  onChange,
}: AgentConfigPanelProps) {
  const focusRing = focusRingClasses[agent];

  return (
    <GlassCard accent={agent} className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-semibold text-text-main">
          {agentLabels[agent]}
        </h3>
        <span className="rounded-sm bg-surface/50 px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-text-muted">
          Config
        </span>
      </div>

      <div className="space-y-1">
        <label
          htmlFor={`${agent}-model`}
          className="font-mono text-xs uppercase tracking-wider text-text-muted"
        >
          Agent Model
        </label>
        <select
          id={`${agent}-model`}
          value={value.model}
          onChange={(event) =>
            onChange({ ...value, model: event.target.value })
          }
          className={`${inputClasses} ${focusRing}`}
        >
          {AGENT_MODELS.map((model) => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label
          htmlFor={`${agent}-character`}
          className="font-mono text-xs uppercase tracking-wider text-text-muted"
        >
          Character Description
        </label>
        <textarea
          id={`${agent}-character`}
          rows={3}
          value={value.characterDescription}
          onChange={(event) =>
            onChange({ ...value, characterDescription: event.target.value })
          }
          placeholder="e.g. Utilitarian ethicist, data-driven pragmatist..."
          className={`${inputClasses} resize-none ${focusRing}`}
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor={`${agent}-goals`}
          className="font-mono text-xs uppercase tracking-wider text-text-muted"
        >
          Goals
        </label>
        <textarea
          id={`${agent}-goals`}
          rows={2}
          value={value.goals}
          onChange={(event) =>
            onChange({ ...value, goals: event.target.value })
          }
          placeholder="Define strategic objectives for this agent..."
          className={`${inputClasses} resize-none ${focusRing}`}
        />
      </div>
    </GlassCard>
  );
}
