"use client";

import { toggleModelActive } from "@/actions/models";
import { ModelCard } from "@/components/models/ModelCard";
import type { RegistryModel } from "@/types/models";
import { Activity } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

type ModelsViewProps = {
  initialModels: RegistryModel[];
  maxActiveNodes: number;
};

export function ModelsView({ initialModels, maxActiveNodes }: ModelsViewProps) {
  const [models, setModels] = useState(initialModels);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeCount = useMemo(
    () => models.filter((model) => model.active).length,
    [models],
  );

  function handleToggle(id: string) {
    if (isPending) {
      return;
    }

    const previousModels = models;

    setErrorMessage(null);
    setModels((current) =>
      current.map((model) =>
        model.id === id ? { ...model, active: !model.active } : model,
      ),
    );

    startTransition(async () => {
      try {
        await toggleModelActive(id);
      } catch (error) {
        setModels(previousModels);
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to update model.",
        );
      }
    });
  }

  return (
    <div className="p-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            Model Registry
          </h1>
          <p className="mt-2 font-body text-sm text-[#849495] sm:text-base">
            Configure and activate AI agents available for deployment in the
            dialectic arena. Select parameters and assign behavioral guardrails.
          </p>
          {errorMessage && (
            <p className="mt-3 font-mono text-xs text-[#ff6b6b]" role="alert">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-sm border border-[#00f0ff]/30 bg-[#00f0ff]/5 px-3 py-2">
          <Activity className="h-3.5 w-3.5 text-[#00f0ff]" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#849495]">
            Active Nodes:
          </span>
          <span className="font-mono text-xs text-[#00f0ff]">
            {activeCount}/{maxActiveNodes}
          </span>
        </div>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {models.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            onToggle={handleToggle}
            disabled={isPending}
          />
        ))}
      </div>
    </div>
  );
}
