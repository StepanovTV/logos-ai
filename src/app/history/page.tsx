import { HistoryView } from "@/components/history/HistoryView";
import { PageShell } from "@/components/layout/PageShell";
import { mapArchiveSession } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import { withDatabase } from "@/lib/with-database";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const archives = await withDatabase(() =>
    prisma.archiveSession.findMany({
      orderBy: { date: "desc" },
    }),
  );

  const sessions = archives.map(mapArchiveSession);

  return (
    <PageShell variant="fluid">
      <HistoryView sessions={sessions} />
    </PageShell>
  );
}
