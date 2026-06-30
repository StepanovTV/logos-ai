import { PrismaClient } from "@prisma/client";

import { formatUsagePricePerM } from "../src/lib/ai/calculate-usage-price";
import { syncModelRegistry } from "../src/lib/ai/sync-model-registry";

const prisma = new PrismaClient();

function formatOpenRouterOutputPricePerM(price: number): string {
  return `$${price.toFixed(4)}/M`;
}

async function main(): Promise<void> {
  const result = await syncModelRegistry(prisma);

  console.log("Model Registry synchronized from OpenRouter.");
  console.log(`Deleted: ${result.deletedCount}`);
  console.log(`Created: ${result.createdCount}`);
  console.log(`Max active nodes: ${result.maxActiveNodes}`);

  if (result.fixturePath) {
    console.log(`Fixture updated: ${result.fixturePath}`);
  }

  console.log("");
  console.log("Models:");

  for (const [index, model] of result.models.entries()) {
    console.log(`${String(index + 1).padStart(2, "0")}. ${model.id}`);
    console.log(`    ${model.name}`);
    console.log(
      `    OpenRouter output: ${formatOpenRouterOutputPricePerM(model.openRouterOutputPricePerM)} | Usage price: ${formatUsagePricePerM(model.usagePricePerM)}`,
    );
    console.log("");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error("Failed to sync Model Registry.");
    console.error(error instanceof Error ? error.message : error);
    await prisma.$disconnect();
    process.exit(1);
  });
