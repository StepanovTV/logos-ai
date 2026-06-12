"use client";

import { AgentConfigPanel } from "@/components/features/AgentConfigPanel";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { AGENT_MODELS } from "@/constants/models";
import type { AgentId, DebateConfig } from "@/types/debate";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, Circle } from "lucide-react";
import { useState } from "react";

const MOCK_HISTORY = [
  {
    id: "1",
    timestamp: "00:00:00",
    agent: "alpha" as AgentId,
    preview: "Awaiting breach initialization...",
  },
  {
    id: "2",
    timestamp: "00:00:00",
    agent: "beta" as AgentId,
    preview: "Standing by for dialectic engagement...",
  },
  {
    id: "3",
    timestamp: "00:00:00",
    agent: "alpha" as AgentId,
    preview: "No exchanges recorded yet.",
  },
];

const agentDisplayNames: Record<AgentId, string> = {
  alpha: "Agent Alpha",
  beta: "Agent Beta",
};

const agentAccentText: Record<AgentId, string> = {
  alpha: "text-primary",
  beta: "text-secondary",
};

function getModelLabel(modelValue: string): string {
  return (
    AGENT_MODELS.find((model) => model.value === modelValue)?.label ??
    modelValue
  );
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text || "No persona defined";
  }
  return `${text.slice(0, maxLength)}...`;
}

export default function Home() {
  const [config, setConfig] = useState<DebateConfig>({
    thesis: "",
    alpha: {
      model: AGENT_MODELS[0].value,
      characterDescription: "",
      goals: "",
    },
    beta: {
      model: AGENT_MODELS[1].value,
      characterDescription: "",
      goals: "",
    },
    iterations: 5,
  });

  const [isInitializing, setIsInitializing] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(
    null,
  );

  async function startDebate() {
    setIsInitializing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    console.log("Initialize Breach — config:", config);
    setIsInitializing(false);
  }

  function toggleHistoryItem(id: string) {
    setExpandedHistoryId((current) => (current === id ? null : id));
  }

  return (
    <div className="min-h-screen bg-grid">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[320px_1fr]">
        <motion.aside
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4 border-r border-white/10 bg-surface/20 p-4 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:p-5"
        >
          <div>
            <h2 className="font-heading text-xl font-semibold text-text-main">
              Command Center
            </h2>
            <p className="mt-1 font-mono text-xs uppercase tracking-wider text-text-muted">
              Dialectic Configuration
            </p>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="central-thesis"
              className="font-mono text-xs uppercase tracking-wider text-text-muted"
            >
              Central Thesis
            </label>
            <textarea
              id="central-thesis"
              rows={6}
              value={config.thesis}
              onChange={(event) =>
                setConfig((current) => ({
                  ...current,
                  thesis: event.target.value,
                }))
              }
              placeholder="Define the core logical conflict to be resolved..."
              className="w-full resize-none rounded-sm border border-white/10 bg-surface/30 px-3 py-2 font-mono text-sm text-text-main placeholder:text-text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          <AgentConfigPanel
            agent="alpha"
            value={config.alpha}
            onChange={(alpha) => setConfig((current) => ({ ...current, alpha }))}
          />

          <AgentConfigPanel
            agent="beta"
            value={config.beta}
            onChange={(beta) => setConfig((current) => ({ ...current, beta }))}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="iterations"
                className="font-mono text-xs uppercase tracking-wider text-text-muted"
              >
                Iterations
              </label>
              <span className="font-mono text-sm text-primary">
                {config.iterations}
              </span>
            </div>
            <input
              id="iterations"
              type="range"
              min={1}
              max={10}
              value={config.iterations}
              onChange={(event) =>
                setConfig((current) => ({
                  ...current,
                  iterations: Number(event.target.value),
                }))
              }
              className="h-1 w-full cursor-pointer appearance-none rounded-sm bg-white/10 accent-primary"
            />
            <div className="flex justify-between font-mono text-xs text-text-muted">
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          <NeonButton
            variant="alpha"
            onClick={startDebate}
            disabled={isInitializing}
          >
            {isInitializing ? "Initializing..." : "Initialize Breach"}
          </NeonButton>
        </motion.aside>

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col gap-6 p-6 lg:p-8"
        >
          <header>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-text-main">
              LOGOS AI
            </h1>
            <p className="mt-1 font-mono text-sm uppercase tracking-widest text-text-muted">
              Synthetic Dialectic — Adversarial Neural Synthesis
            </p>
          </header>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {(["alpha", "beta"] as AgentId[]).map((agentId) => {
              const agentConfig = config[agentId];
              return (
                <GlassCard key={agentId} accent={agentId} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2
                        className={`font-heading text-lg font-semibold ${agentAccentText[agentId]}`}
                      >
                        {agentDisplayNames[agentId]}
                      </h2>
                      <p className="mt-0.5 font-mono text-xs text-text-muted">
                        {getModelLabel(agentConfig.model)}
                      </p>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-sm bg-surface/50 px-2 py-1 font-mono text-xs uppercase tracking-wider text-text-muted">
                      <Circle className="h-2 w-2 fill-current" />
                      Idle
                    </span>
                  </div>
                  <p className="font-body text-sm leading-relaxed text-text-main/80">
                    {truncateText(agentConfig.characterDescription, 120)}
                  </p>
                </GlassCard>
              );
            })}
          </section>

          <GlassCard className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-text-main">
              Discussion History
            </h2>
            <div className="space-y-2">
              {MOCK_HISTORY.map((item) => {
                const isExpanded = expandedHistoryId === item.id;
                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-sm border border-white/10 bg-surface/20"
                  >
                    <button
                      type="button"
                      onClick={() => toggleHistoryItem(item.id)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-white/5"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0 text-text-muted" />
                      )}
                      <span className="font-mono text-xs text-text-muted">
                        {item.timestamp}
                      </span>
                      <span
                        className={`font-mono text-xs uppercase ${agentAccentText[item.agent]}`}
                      >
                        {item.agent}
                      </span>
                      <span className="truncate font-body text-sm text-text-main/70">
                        {item.preview}
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="border-t border-white/10 px-3 py-2 font-body text-sm text-text-muted">
                        {item.preview}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-text-main">
              Joint Decision
            </h2>
            <div className="rounded-sm bg-surface/40 p-4 font-mono text-sm leading-relaxed text-text-muted">
              <span className="text-primary">{">"}</span> Awaiting breach
              initialization...
            </div>
          </GlassCard>
        </motion.main>
      </div>
    </div>
  );
}
