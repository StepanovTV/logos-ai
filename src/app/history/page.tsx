import { HistoryView } from "@/components/history/HistoryView";
import { PageShell } from "@/components/layout/PageShell";
import { archiveSessions } from "@/mocks/historyData";

export default function HistoryPage() {
  return (
    <PageShell variant="fluid">
      <HistoryView sessions={archiveSessions} />
    </PageShell>
  );
}
