export const OPENROUTER_API_BASE_URL = "https://openrouter.ai/api/v1";

export const OPENROUTER_API_URL = `${OPENROUTER_API_BASE_URL}/chat/completions`;

export const OPENROUTER_MODELS_API_URL = `${OPENROUTER_API_BASE_URL}/models`;

/** Free model used for connectivity and API key validation checks. */
export const OPENROUTER_TEST_MODEL =
  "nvidia/nemotron-3.5-content-safety:free";

export class OpenRouterNotConfiguredError extends Error {
  constructor() {
    super(
      "OPENROUTER_API_KEY is not configured. Add it to your .env file to enable AI debate.",
    );
    this.name = "OpenRouterNotConfiguredError";
  }
}

export class OpenRouterApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string,
  ) {
    super(`OpenRouter API error (${status}): ${body}`);
    this.name = "OpenRouterApiError";
  }
}

export type OpenRouterMessageRole = "system" | "user" | "assistant";

export type OpenRouterMessage = {
  role: OpenRouterMessageRole;
  content: string;
};

export type OpenRouterChatCompletionRequest = {
  model: string;
  messages: OpenRouterMessage[];
  stream?: boolean;
};

export type OpenRouterChatCompletionChoice = {
  message: {
    role: string;
    content: string | null;
  };
  finish_reason: string | null;
};

export type OpenRouterChatCompletionResponse = {
  id: string;
  model: string;
  choices: OpenRouterChatCompletionChoice[];
};

/**
 * Returns the OpenRouter API key from environment.
 * Throws only when called — the app starts without a key configured.
 */
export function getOpenRouterApiKey(): string {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();

  if (!apiKey) {
    throw new OpenRouterNotConfiguredError();
  }

  return apiKey;
}

/**
 * Builds request headers for the OpenRouter REST API.
 * @see https://openrouter.ai/docs/quickstart#using-the-openrouter-api
 */
export function getOpenRouterHeaders(): Record<string, string> {
  getOpenRouterApiKey();

  return {
    ...getOpenRouterAuthHeaders(),
    "Content-Type": "application/json",
  };
}

/**
 * Returns OpenRouter attribution headers. Authorization is included when configured.
 */
export function getOpenRouterAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "HTTP-Referer":
      process.env.OPENROUTER_HTTP_REFERER?.trim() ?? "http://localhost:3000",
    "X-OpenRouter-Title":
      process.env.OPENROUTER_APP_TITLE?.trim() ?? "LOGOS AI",
  };

  const apiKey = process.env.OPENROUTER_API_KEY?.trim();

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return headers;
}

/**
 * Calls OpenRouter chat completions via the REST API (no SDK).
 */
export async function callOpenRouterChatCompletion(
  request: OpenRouterChatCompletionRequest,
): Promise<OpenRouterChatCompletionResponse> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: getOpenRouterHeaders(),
    body: JSON.stringify(request),
  });

  const body = await response.text();

  if (!response.ok) {
    throw new OpenRouterApiError(response.status, body);
  }

  return JSON.parse(body) as OpenRouterChatCompletionResponse;
}

/**
 * Sends a minimal prompt to verify API key and network connectivity.
 */
export async function verifyOpenRouterConnection(): Promise<{
  model: string;
  content: string;
  responseId: string;
}> {
  const model = OPENROUTER_TEST_MODEL;

  const completion = await callOpenRouterChatCompletion({
    model,
    messages: [
      {
        role: "user",
        content:
          'Classify this user prompt for safety: "What is the capital of France?"',
      },
    ],
  });

  const content = completion.choices[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return {
    model: completion.model || model,
    content,
    responseId: completion.id,
  };
}
