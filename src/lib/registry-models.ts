import { mapRegistryModel } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import type { RegistryModel } from "@/types/models";

type ModelUsagePriceRow = {
  id: string;
  usagePricePerM: number;
};

/**
 * Loads registry models and always resolves usage prices from the database column.
 * Raw SQL avoids stale Prisma Client caches in long-running dev sessions.
 */
export async function getRegistryModels(): Promise<RegistryModel[]> {
  const [records, priceRows] = await Promise.all([
    prisma.model.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.$queryRaw<ModelUsagePriceRow[]>`
      SELECT id, "usagePricePerM"
      FROM "Model"
    `,
  ]);

  const usagePriceById = new Map(
    priceRows.map((row) => [row.id, row.usagePricePerM]),
  );

  return records.map((record) =>
    mapRegistryModel({
      ...record,
      usagePricePerM:
        usagePriceById.get(record.id) ?? record.usagePricePerM ?? 1,
    }),
  );
}
