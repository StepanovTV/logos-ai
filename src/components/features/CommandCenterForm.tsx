"use client";

import { initializeBreach } from "@/actions/debate";
import { AgentConfigPanel } from "@/components/features/AgentConfigPanel";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import type { AgentId, DebateConfig } from "@/types/debate";
import { Hash, Network, PlayCircle, Sliders, Zap } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useState, useTransition } from "react";

type AgentModelOption = {
  value: string;
  label: string;
};

type CommandCenterFormProps = {
  availableModels: AgentModelOption[];
  defaultConfig: DebateConfig;
};

export function CommandCenterForm({
  availableModels,
  defaultConfig,
}: CommandCenterFormProps) {
  const [config, setConfig] = useState<DebateConfig>(defaultConfig);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function setInitiator(initiator: AgentId) {
    setConfig((current) => ({ ...current, initiator }));
  }

  function startDebate() {
    setErrorMessage(null);

    startTransition(async () => {
      try {
        await initializeBreach(config);
      } catch (error) {
        if (isRedirectError(error)) {
          throw error;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to initialize debate session.",
        );
      }
    });
  }

  return (
    <>
      <header className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1f1f22]/60 px-3 py-1 backdrop-blur-md">
          <Hash className="h-3 w-3 text-[#849495]" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#849495]">
            SYSTEM INITIALIZATION
          </span>
        </div>

        <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
          Debate Parameters
        </h1>
        <p className="mt-2 max-w-2xl font-body text-sm text-[#849495] sm:text-base">
          Configure the logical constraints and operational directives for the
          upcoming adversarial neural synthesis.
        </p>

        <div className="mt-6 h-px w-full bg-white/5" />
      </header>

      <div className="space-y-6">
        <GlassCard className="space-y-3">
          <label
            htmlFor="central-thesis"
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#849495]"
          >
            <Network className="h-3.5 w-3.5" />
            ПРЕДМЕТ СПОРА
          </label>
          <textarea
            id="central-thesis"
            rows={4}
            value={config.thesis}
            onChange={(event) =>
              setConfig((current) => ({
                ...current,
                thesis: event.target.value,
              }))
            }
            placeholder="Enter the central thesis or logical conflict to be resolved..."
            className="w-full resize-none rounded-sm border border-white/10 bg-[#131316]/50 px-4 py-3 font-mono text-sm text-[#e4e1e6] placeholder:text-[#849495]/60 focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff]/30"
          />
        </GlassCard>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AgentConfigPanel
            agent="alpha"
            value={config.alpha}
            availableModels={availableModels}
            onChange={(alpha) =>
              setConfig((current) => ({ ...current, alpha }))
            }
          />
          <AgentConfigPanel
            agent="beta"
            value={config.beta}
            availableModels={availableModels}
            onChange={(beta) => setConfig((current) => ({ ...current, beta }))}
          />
        </div>

        <GlassCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label
              htmlFor="iterations"
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#849495]"
            >
              <Sliders className="h-3.5 w-3.5" />
              МАКСИМАЛЬНОЕ КОЛИЧЕСТВО ИТЕРАЦИЙ
            </label>
            <div className="flex w-full items-center gap-4 sm:max-w-md sm:flex-1 sm:justify-end">
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
                className="debate-slider h-1 flex-1 cursor-pointer appearance-none rounded-sm bg-white/10"
              />
              <span className="flex h-8 min-w-10 items-center justify-center rounded-sm border border-white/10 bg-[#131316]/50 px-2 font-mono text-sm text-white">
                {config.iterations}
              </span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#849495]">
              <PlayCircle className="h-3.5 w-3.5" />
              КТО НАЧИНАЕТ?
            </span>
            <div className="inline-flex w-full rounded-sm border border-white/10 bg-[#131316]/50 p-0.5 sm:w-auto">
              {(["alpha", "beta"] as AgentId[]).map((agentId) => {
                const isActive = config.initiator === agentId;
                const label = agentId === "alpha" ? "АГЕНТ 1" : "АГЕНТ 2";
                return (
                  <button
                    key={agentId}
                    type="button"
                    onClick={() => setInitiator(agentId)}
                    className={`flex-1 rounded-sm px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors sm:flex-none ${
                      isActive
                        ? "border border-white/20 bg-white/10 text-white"
                        : "border border-transparent text-[#849495] hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </GlassCard>

        {errorMessage && (
          <p className="font-mono text-xs text-[#ffb4ab]">{errorMessage}</p>
        )}

        <div className="flex justify-stretch pt-2 sm:justify-end">
          <NeonButton
            onClick={startDebate}
            disabled={isPending}
            icon={<Zap className="h-4 w-4" />}
            className="w-full justify-center sm:w-auto"
          >
            {isPending ? "Инициализация..." : "INITIALIZE DEBATE"}
          </NeonButton>
        </div>
      </div>
    </>
  );
}
