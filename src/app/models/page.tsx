import { ModelsView } from "@/components/models/ModelsView";
import { PageShell } from "@/components/layout/PageShell";
import { modelsRegistry } from "@/mocks/models";

export default function ModelsPage() {
  return (
    <PageShell variant="fluid">
      <ModelsView
        initialModels={modelsRegistry.models}
        maxActiveNodes={modelsRegistry.maxActiveNodes}
      />
    </PageShell>
  );
}
