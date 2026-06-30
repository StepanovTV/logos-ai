import {
  OpenRouterApiError,
  OpenRouterNotConfiguredError,
  verifyOpenRouterConnection,
} from "../src/lib/ai/openrouter";

async function main(): Promise<void> {
  try {
    const result = await verifyOpenRouterConnection();

    console.log("OpenRouter connection OK");
    console.log(`Model: ${result.model}`);
    console.log(`Response ID: ${result.responseId}`);
    console.log("Sample output:");
    console.log(result.content);
  } catch (error) {
    if (error instanceof OpenRouterNotConfiguredError) {
      console.error("Missing OPENROUTER_API_KEY in environment.");
      process.exitCode = 1;
      return;
    }

    if (error instanceof OpenRouterApiError) {
      console.error(`OpenRouter API failed with status ${error.status}.`);
      console.error(error.body);
      process.exitCode = 1;
      return;
    }

    console.error("OpenRouter verification failed.");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

void main();
