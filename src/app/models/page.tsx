import { ModelsView } from "@/components/models/ModelsView";
import { PageShell } from "@/components/layout/PageShell";
import { resolveMaxActiveNodes } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import { getRegistryModels } from "@/lib/registry-models";
import { withDatabase } from "@/lib/with-database";

export const dynamic = "force-dynamic";

export default async function ModelsPage() {
  const [models, registrySetting] = await withDatabase(() =>
    Promise.all([
      getRegistryModels(),
      prisma.appSetting.findUnique({
        where: { key: "registry" },
      }),
    ]),
  );

  const maxActiveNodes = resolveMaxActiveNodes(registrySetting?.value);

  return (
    <PageShell variant="fluid">
      <ModelsView initialModels={models} maxActiveNodes={maxActiveNodes} />
    </PageShell>
  );
}
