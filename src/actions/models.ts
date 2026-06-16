"use server";

import { revalidatePath } from "next/cache";

import { resolveMaxActiveNodes } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import { withDatabase } from "@/lib/with-database";

export async function toggleModelActive(modelId: string): Promise<void> {
  await withDatabase(async () => {
    const model = await prisma.model.findUnique({
      where: { id: modelId },
    });

    if (!model) {
      throw new Error(`Model "${modelId}" was not found.`);
    }

    if (!model.active) {
      const [activeCount, registrySetting] = await Promise.all([
        prisma.model.count({ where: { active: true } }),
        prisma.appSetting.findUnique({ where: { key: "registry" } }),
      ]);

      const maxActiveNodes = resolveMaxActiveNodes(registrySetting?.value);

      if (activeCount >= maxActiveNodes) {
        throw new Error("Active node limit reached.");
      }
    }

    await prisma.model.update({
      where: { id: modelId },
      data: { active: !model.active },
    });
  });

  revalidatePath("/models");
  revalidatePath("/");
}
