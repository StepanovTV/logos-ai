import {
  OPENROUTER_MODELS_API_URL,
  OpenRouterApiError,
  getOpenRouterAuthHeaders,
} from "./openrouter";

/** OpenRouter returns USD per token; multiply by 1M for $/M tokens display. */
export const OPENROUTER_TOKENS_PER_MILLION = 1_000_000;

export type OpenRouterModelSort =
  | "newest"
  | "pricing-low-to-high"
  | "pricing-high-to-low"
  | "context-high-to-low"
  | "throughput-high-to-low"
  | "latency-low-to-high"
  | "most-popular"
  | "top-weekly";

export type OpenRouterOutputModality = "text" | "image" | "audio" | "embeddings";

export type OpenRouterModelPricing = {
  prompt: string;
  completion: string;
  request?: string;
  image?: string;
  web_search?: string;
  internal_reasoning?: string;
};

export type OpenRouterModelArchitecture = {
  modality: string;
  input_modalities: string[];
  output_modalities: string[];
};

export type OpenRouterModel = {
  id: string;
  canonical_slug: string;
  name: string;
  created: number;
  description: string;
  context_length: number;
  architecture: OpenRouterModelArchitecture;
  pricing: OpenRouterModelPricing;
};

export type OpenRouterModelsResponse = {
  data: OpenRouterModel[];
};

export type OpenRouterModelSummary = {
  id: string;
  name: string;
  created: number;
  contextLength: number;
  outputModalities: string[];
  promptPricePerM: number;
  completionPricePerM: number;
  description: string;
};

export type FetchOpenRouterModelsParams = {
  sort?: OpenRouterModelSort;
  outputModalities?: OpenRouterOutputModality[] | "all";
  category?: string;
  supportedParameters?: string[];
  useRss?: boolean;
};

export type FilterOpenRouterModelsParams = {
  maxCompletionPricePerM?: number;
  minCompletionPricePerM?: number;
  limit?: number;
  requireTextOutput?: boolean;
};

export type ListOpenRouterModelsParams = FetchOpenRouterModelsParams &
  FilterOpenRouterModelsParams;

const DEFAULT_LIST_PARAMS: Required<
  Pick<
    ListOpenRouterModelsParams,
    "sort" | "maxCompletionPricePerM" | "limit" | "requireTextOutput"
  >
> = {
  sort: "newest",
  maxCompletionPricePerM: 2,
  limit: 16,
  requireTextOutput: true,
};

/**
 * Converts OpenRouter completion pricing (USD/token) to USD per 1M output tokens.
 */
export function getCompletionPricePerM(model: OpenRouterModel): number {
  return Number(model.pricing.completion) * OPENROUTER_TOKENS_PER_MILLION;
}

/**
 * Converts OpenRouter prompt pricing (USD/token) to USD per 1M input tokens.
 */
export function getPromptPricePerM(model: OpenRouterModel): number {
  return Number(model.pricing.prompt) * OPENROUTER_TOKENS_PER_MILLION;
}

export function toOpenRouterModelSummary(
  model: OpenRouterModel,
): OpenRouterModelSummary {
  return {
    id: model.id,
    name: model.name,
    created: model.created,
    contextLength: model.context_length,
    outputModalities: model.architecture.output_modalities,
    promptPricePerM: getPromptPricePerM(model),
    completionPricePerM: getCompletionPricePerM(model),
    description: model.description,
  };
}

function buildOpenRouterModelsUrl(
  params: FetchOpenRouterModelsParams = {},
): string {
  const searchParams = new URLSearchParams();

  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  if (params.outputModalities === "all") {
    searchParams.set("output_modalities", "all");
  } else if (params.outputModalities?.length) {
    searchParams.set("output_modalities", params.outputModalities.join(","));
  }

  if (params.category) {
    searchParams.set("category", params.category);
  }

  if (params.supportedParameters?.length) {
    searchParams.set(
      "supported_parameters",
      params.supportedParameters.join(","),
    );
  }

  if (params.useRss) {
    searchParams.set("use_rss", "true");
  }

  const query = searchParams.toString();

  return query
    ? `${OPENROUTER_MODELS_API_URL}?${query}`
    : OPENROUTER_MODELS_API_URL;
}

/**
 * Fetches the OpenRouter model catalog.
 * @see https://openrouter.ai/docs/api/api-reference/models/get-models
 */
export async function fetchOpenRouterModels(
  params: FetchOpenRouterModelsParams = {},
): Promise<OpenRouterModel[]> {
  const response = await fetch(buildOpenRouterModelsUrl(params), {
    headers: getOpenRouterAuthHeaders(),
    next: { revalidate: 3600 },
  });

  const body = await response.text();

  if (!response.ok) {
    throw new OpenRouterApiError(response.status, body);
  }

  const payload = JSON.parse(body) as OpenRouterModelsResponse;

  return payload.data;
}

/**
 * Filters OpenRouter models by completion (output) token price and optional text output.
 */
export function filterOpenRouterModels(
  models: OpenRouterModel[],
  params: FilterOpenRouterModelsParams = {},
): OpenRouterModel[] {
  const {
    maxCompletionPricePerM = DEFAULT_LIST_PARAMS.maxCompletionPricePerM,
    minCompletionPricePerM = 0,
    limit = DEFAULT_LIST_PARAMS.limit,
    requireTextOutput = DEFAULT_LIST_PARAMS.requireTextOutput,
  } = params;

  const maxCompletionPricePerToken =
    maxCompletionPricePerM / OPENROUTER_TOKENS_PER_MILLION;
  const minCompletionPricePerToken =
    minCompletionPricePerM / OPENROUTER_TOKENS_PER_MILLION;

  const filtered = models.filter((model) => {
    const completionPrice = Number(model.pricing?.completion);

    if (!Number.isFinite(completionPrice)) {
      return false;
    }

    if (completionPrice < minCompletionPricePerToken) {
      return false;
    }

    if (completionPrice > maxCompletionPricePerToken) {
      return false;
    }

    if (
      requireTextOutput &&
      !model.architecture.output_modalities.includes("text")
    ) {
      return false;
    }

    return true;
  });

  return filtered.slice(0, limit);
}

/**
 * Returns the newest OpenRouter models within a completion price budget.
 */
export async function listOpenRouterModels(
  params: ListOpenRouterModelsParams = {},
): Promise<OpenRouterModelSummary[]> {
  const {
    sort = DEFAULT_LIST_PARAMS.sort,
    maxCompletionPricePerM = DEFAULT_LIST_PARAMS.maxCompletionPricePerM,
    minCompletionPricePerM,
    limit = DEFAULT_LIST_PARAMS.limit,
    requireTextOutput = DEFAULT_LIST_PARAMS.requireTextOutput,
    outputModalities = requireTextOutput ? ["text"] : undefined,
    category,
    supportedParameters,
    useRss,
  } = params;

  const models = await fetchOpenRouterModels({
    sort,
    outputModalities,
    category,
    supportedParameters,
    useRss,
  });

  return filterOpenRouterModels(models, {
    maxCompletionPricePerM,
    minCompletionPricePerM,
    limit,
    requireTextOutput,
  }).map(toOpenRouterModelSummary);
}
