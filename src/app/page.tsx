import { CommandCenterForm } from "@/components/features/CommandCenterForm";
import { PageShell } from "@/components/layout/PageShell";
import { defaultDebateConfig } from "@/constants/debateDefaults";
import { prisma } from "@/lib/prisma";
import { withDatabase } from "@/lib/with-database";
import type { DebateConfig } from "@/types/debate";

export const dynamic = "force-dynamic";

function resolveDefaultConfig(
  availableModelIds: string[],
  storedDefaults?: unknown,
): DebateConfig {
  const fallback = defaultDebateConfig;

  if (!storedDefaults || typeof storedDefaults !== "object") {
    return {
      ...fallback,
      alpha: {
        ...fallback.alpha,
        model: availableModelIds.includes(fallback.alpha.model)
          ? fallback.alpha.model
          : (availableModelIds[0] ?? fallback.alpha.model),
      },
      beta: {
        ...fallback.beta,
        model: availableModelIds.includes(fallback.beta.model)
          ? fallback.beta.model
          : (availableModelIds[0] ?? fallback.beta.model),
      },
    };
  }

  return fallback;
}

export default async function Home() {
  const [models, defaultSetting] = await withDatabase(() =>
    Promise.all([
      prisma.model.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.appSetting.findUnique({
        where: { key: "defaultDebate" },
      }),
    ]),
  );

  const availableModels = models.map((model) => ({
    value: model.id,
    label: model.name,
  }));

  const availableModelIds = models.map((model) => model.id);
  const defaultConfig = resolveDefaultConfig(
    availableModelIds,
    defaultSetting?.value,
  );

  return (
    <PageShell>
      <CommandCenterForm
        availableModels={availableModels}
        defaultConfig={defaultConfig}
      />
    </PageShell>
  );
}
