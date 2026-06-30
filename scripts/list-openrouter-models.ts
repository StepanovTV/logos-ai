import { listOpenRouterModels } from "../src/lib/ai/openrouter-models";

async function main(): Promise<void> {
  const models = await listOpenRouterModels({
    sort: "newest",
    maxCompletionPricePerM: 2,
    limit: 16,
    requireTextOutput: true,
    outputModalities: ["text"],
  });

  console.log(`Latest ${models.length} text models with output <= $2/M:`);
  console.log("");

  for (const [index, model] of models.entries()) {
    console.log(
      `${String(index + 1).padStart(2, "0")}. ${model.id}`,
    );
    console.log(`    ${model.name}`);
    console.log(
      `    output: $${model.completionPricePerM.toFixed(4)}/M | input: $${model.promptPricePerM.toFixed(4)}/M | context: ${model.contextLength.toLocaleString()}`,
    );
    console.log("");
  }
}

void main();
