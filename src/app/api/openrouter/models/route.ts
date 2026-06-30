import { NextResponse } from "next/server";

import {
  OpenRouterApiError,
  OpenRouterNotConfiguredError,
} from "@/lib/ai/openrouter";
import {
  type ListOpenRouterModelsParams,
  type OpenRouterModelSort,
  type OpenRouterOutputModality,
  listOpenRouterModels,
} from "@/lib/ai/openrouter-models";

export const dynamic = "force-dynamic";

const VALID_SORTS = new Set<OpenRouterModelSort>([
  "newest",
  "pricing-low-to-high",
  "pricing-high-to-low",
  "context-high-to-low",
  "throughput-high-to-low",
  "latency-low-to-high",
  "most-popular",
  "top-weekly",
]);

const VALID_OUTPUT_MODALITIES = new Set<OpenRouterOutputModality>([
  "text",
  "image",
  "audio",
  "embeddings",
]);

function parseNumberParam(
  value: string | null,
  fallback: number,
): number | NextResponse {
  if (value === null) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return NextResponse.json(
      { error: `Invalid numeric query parameter: ${value}` },
      { status: 400 },
    );
  }

  return parsed;
}

function parseLimitParam(value: string | null): number | NextResponse {
  const parsed = parseNumberParam(value, 16);

  if (parsed instanceof NextResponse) {
    return parsed;
  }

  if (parsed < 1 || parsed > 100) {
    return NextResponse.json(
      { error: "Query parameter 'limit' must be between 1 and 100." },
      { status: 400 },
    );
  }

  return parsed;
}

function parseSortParam(value: string | null): OpenRouterModelSort | NextResponse {
  if (value === null) {
    return "newest";
  }

  if (!VALID_SORTS.has(value as OpenRouterModelSort)) {
    return NextResponse.json(
      { error: `Invalid sort value: ${value}` },
      { status: 400 },
    );
  }

  return value as OpenRouterModelSort;
}

function parseOutputModalitiesParam(
  value: string | null,
): OpenRouterOutputModality[] | "all" | undefined | NextResponse {
  if (value === null) {
    return undefined;
  }

  if (value === "all") {
    return "all";
  }

  const modalities = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  for (const modality of modalities) {
    if (!VALID_OUTPUT_MODALITIES.has(modality as OpenRouterOutputModality)) {
      return NextResponse.json(
        { error: `Invalid output modality: ${modality}` },
        { status: 400 },
      );
    }
  }

  return modalities as OpenRouterOutputModality[];
}

/**
 * GET /api/openrouter/models
 *
 * Query params:
 * - maxOutputPricePerM (default: 2) — max completion price in USD per 1M tokens
 * - minOutputPricePerM (default: 0)
 * - limit (default: 16, max: 100)
 * - sort (default: newest)
 * - outputModalities (default: text via server-side OpenRouter filter)
 * - requireTextOutput (default: true)
 * - category, supportedParameters
 */
export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);

  const sort = parseSortParam(searchParams.get("sort"));

  if (sort instanceof NextResponse) {
    return sort;
  }

  const maxCompletionPricePerM = parseNumberParam(
    searchParams.get("maxOutputPricePerM"),
    2,
  );

  if (maxCompletionPricePerM instanceof NextResponse) {
    return maxCompletionPricePerM;
  }

  const minCompletionPricePerM = parseNumberParam(
    searchParams.get("minOutputPricePerM"),
    0,
  );

  if (minCompletionPricePerM instanceof NextResponse) {
    return minCompletionPricePerM;
  }

  const limit = parseLimitParam(searchParams.get("limit"));

  if (limit instanceof NextResponse) {
    return limit;
  }

  const outputModalities = parseOutputModalitiesParam(
    searchParams.get("outputModalities"),
  );

  if (outputModalities instanceof NextResponse) {
    return outputModalities;
  }

  const requireTextOutput = searchParams.get("requireTextOutput") !== "false";

  const params: ListOpenRouterModelsParams = {
    sort,
    maxCompletionPricePerM,
    minCompletionPricePerM,
    limit,
    requireTextOutput,
    outputModalities,
    category: searchParams.get("category") ?? undefined,
    supportedParameters:
      searchParams.get("supportedParameters")?.split(",").filter(Boolean) ??
      undefined,
  };

  try {
    const models = await listOpenRouterModels(params);

    return NextResponse.json({
      filters: {
        sort,
        maxOutputPricePerM: maxCompletionPricePerM,
        minOutputPricePerM: minCompletionPricePerM,
        limit,
        requireTextOutput,
        outputModalities: outputModalities ?? (requireTextOutput ? ["text"] : "all"),
      },
      count: models.length,
      models,
    });
  } catch (error) {
    if (error instanceof OpenRouterNotConfiguredError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    if (error instanceof OpenRouterApiError) {
      return NextResponse.json(
        { error: error.message, details: error.body },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch OpenRouter models." },
      { status: 500 },
    );
  }
}
