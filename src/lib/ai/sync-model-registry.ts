import { writeFile } from "node:fs/promises";
import path from "node:path";

import type { PrismaClient } from "@prisma/client";

import {
  buildModelsFixture,
  type ModelsFixture,
} from "./map-openrouter-registry-model";
import {
  type ListOpenRouterModelsParams,
  listOpenRouterModels,
} from "./openrouter-models";

const MODELS_FIXTURE_PATH = path.join(
  process.cwd(),
  "src",
  "fixtures",
  "models.json",
);

export type SyncModelRegistryParams = ListOpenRouterModelsParams & {
  writeFixture?: boolean;
};

export type SyncedRegistryModelSummary = {
  id: string;
  name: string;
  openRouterOutputPricePerM: number;
  usagePricePerM: number;
};

export type SyncModelRegistryResult = {
  deletedCount: number;
  createdCount: number;
  maxActiveNodes: number;
  modelIds: string[];
  models: SyncedRegistryModelSummary[];
  fixturePath?: string;
};

function toPrismaModelRecords(fixture: ModelsFixture) {
  return fixture.models.map((model) => ({
    id: model.id,
    name: model.name,
    provider: model.provider,
    icon: model.icon,
    active: model.active,
    accent: model.accent ?? null,
    paramCount: model.paramCount,
    contextWindow: model.contextWindow,
    releaseDate: model.releaseDate,
    reasoningStyle: model.reasoningStyle,
    usagePricePerM: model.usagePricePerM,
  }));
}

async function writeModelsFixture(fixture: ModelsFixture): Promise<void> {
  await writeFile(
    MODELS_FIXTURE_PATH,
    `${JSON.stringify(fixture, null, 2)}\n`,
    "utf8",
  );
}

/**
 * Replaces the entire Model Registry with the latest filtered OpenRouter models.
 */
export async function syncModelRegistry(
  prisma: PrismaClient,
  params: SyncModelRegistryParams = {},
): Promise<SyncModelRegistryResult> {
  const {
    writeFixture = true,
    sort = "newest",
    maxCompletionPricePerM = 2,
    minCompletionPricePerM = 0,
    limit = 16,
    requireTextOutput = true,
    outputModalities = ["text"],
    category,
    supportedParameters,
    useRss,
  } = params;

  const openRouterModels = await listOpenRouterModels({
    sort,
    maxCompletionPricePerM,
    minCompletionPricePerM,
    limit,
    requireTextOutput,
    outputModalities,
    category,
    supportedParameters,
    useRss,
  });

  if (openRouterModels.length === 0) {
    throw new Error("OpenRouter returned no models for the selected filters.");
  }

  const fixture = buildModelsFixture(openRouterModels);
  const records = toPrismaModelRecords(fixture);

  const result = await prisma.$transaction(async (tx) => {
    const deleted = await tx.model.deleteMany();
    const created = await tx.model.createMany({ data: records });

    await tx.appSetting.upsert({
      where: { key: "registry" },
      update: { value: { maxActiveNodes: fixture.maxActiveNodes } },
      create: {
        key: "registry",
        value: { maxActiveNodes: fixture.maxActiveNodes },
      },
    });

    return {
      deletedCount: deleted.count,
      createdCount: created.count,
    };
  });

  if (writeFixture) {
    await writeModelsFixture(fixture);
  }

  const models = openRouterModels.map((openRouterModel, index) => {
    const registryModel = fixture.models[index];

    return {
      id: registryModel.id,
      name: registryModel.name,
      openRouterOutputPricePerM: openRouterModel.completionPricePerM,
      usagePricePerM: registryModel.usagePricePerM,
    };
  });

  return {
    deletedCount: result.deletedCount,
    createdCount: result.createdCount,
    maxActiveNodes: fixture.maxActiveNodes,
    modelIds: fixture.models.map((model) => model.id),
    models,
    fixturePath: writeFixture ? MODELS_FIXTURE_PATH : undefined,
  };
}
