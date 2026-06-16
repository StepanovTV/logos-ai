import { ModelsView } from "@/components/models/ModelsView";
import { PageShell } from "@/components/layout/PageShell";
import { mapRegistryModel, resolveMaxActiveNodes } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import { withDatabase } from "@/lib/with-database";

export const dynamic = "force-dynamic";

export default async function ModelsPage() {
  const [records, registrySetting] = await withDatabase(() =>
    Promise.all([
      prisma.model.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.appSetting.findUnique({
        where: { key: "registry" },
      }),
    ]),
  );

  const models = records.map(mapRegistryModel);
  const maxActiveNodes = resolveMaxActiveNodes(registrySetting?.value);

  return (
    <PageShell variant="fluid">
      <ModelsView initialModels={models} maxActiveNodes={maxActiveNodes} />
    </PageShell>
  );
}
