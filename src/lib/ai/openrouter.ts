export class OpenRouterNotConfiguredError extends Error {
  constructor() {
    super(
      "OPENROUTER_API_KEY is not configured. Add it to your .env file to enable AI debate.",
    );
    this.name = "OpenRouterNotConfiguredError";
  }
}

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
