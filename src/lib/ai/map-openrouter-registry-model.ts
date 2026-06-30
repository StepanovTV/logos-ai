import type { ModelAccent, ModelIcon } from "@/types/models";

import { calculateUsagePricePerM } from "./calculate-usage-price";
import type { OpenRouterModelSummary } from "./openrouter-models";

const MODEL_ICONS: ModelIcon[] = ["brain", "cpu", "infinity", "network"];

export type RegistryModelSeed = {
  id: string;
  name: string;
  provider: string;
  icon: ModelIcon;
  active: boolean;
  accent?: ModelAccent;
  paramCount: string;
  contextWindow: string;
  releaseDate: string;
  reasoningStyle: string;
  usagePricePerM: number;
};

export type ModelsFixture = {
  maxActiveNodes: number;
  models: RegistryModelSeed[];
};

/**
 * Extracts a human-readable provider label from an OpenRouter model id.
 */
export function extractOpenRouterProvider(modelId: string): string {
  const providerSlug = modelId.split("/")[0] ?? modelId;

  return providerSlug.replace(/-/g, " ").toUpperCase();
}

/**
 * Formats OpenRouter context length for the registry UI.
 */
export function formatRegistryContextWindow(contextLength: number): string {
  if (contextLength >= 1_000_000) {
    const millions = contextLength / 1_000_000;

    return `${Number.isInteger(millions) ? millions : millions.toFixed(1)}M Tokens`;
  }

  if (contextLength >= 1_000) {
    const thousands = Math.round(contextLength / 1_000);

    return `${thousands}k Tokens`;
  }

  return `${contextLength} Tokens`;
}

/**
 * Attempts to infer parameter count from model metadata.
 */
export function extractRegistryParamCount(
  name: string,
  description: string,
): string {
  const source = `${name} ${description}`;
  const match =
    source.match(/\b(\d+(?:\.\d+)?)\s*[Tt]\b/) ??
    source.match(/\b(\d+(?:\.\d+)?)\s*[Bb]\b/);

  if (!match) {
    return "Undisclosed";
  }

  const unit = match[0].trim().slice(-1).toUpperCase();

  return `${match[1]}${unit}`;
}

function truncateDescription(description: string, maxLength = 220): string {
  const normalized = description.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
}

function formatReleaseDate(createdUnixTimestamp: number): string {
  return new Date(createdUnixTimestamp * 1000).toISOString().slice(0, 10);
}

function resolveRegistryAccent(index: number): ModelAccent | undefined {
  if (index === 0) {
    return "alpha";
  }

  if (index === 1) {
    return "beta";
  }

  return undefined;
}

/**
 * Maps an OpenRouter model summary into the local Model Registry shape.
 */
export function mapOpenRouterModelToRegistrySeed(
  model: OpenRouterModelSummary,
  index: number,
): RegistryModelSeed {
  const active = index < 2;

  return {
    id: model.id,
    name: model.name,
    provider: extractOpenRouterProvider(model.id),
    icon: MODEL_ICONS[index % MODEL_ICONS.length] ?? "brain",
    active,
    accent: active ? resolveRegistryAccent(index) : undefined,
    paramCount: extractRegistryParamCount(model.name, model.description),
    contextWindow: formatRegistryContextWindow(model.contextLength),
    releaseDate: formatReleaseDate(model.created),
    reasoningStyle: truncateDescription(model.description),
    usagePricePerM: calculateUsagePricePerM(model.completionPricePerM),
  };
}

export function buildModelsFixture(
  models: OpenRouterModelSummary[],
): ModelsFixture {
  return {
    maxActiveNodes: models.length,
    models: models.map(mapOpenRouterModelToRegistrySeed),
  };
}
