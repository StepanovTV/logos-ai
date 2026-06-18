import { prisma } from "@/lib/prisma";
import { withDatabase } from "@/lib/with-database";
import type { ArchiveStatus, ArchiveWinner } from "@/types/history";

type ArchiveUpdateExtra = {
  winner?: ArchiveWinner;
  resolution?: string;
  nodes?: number | null;
  cpu?: string | null;
  error?: string | null;
};

export async function updateArchiveStatus(
  archiveId: string,
  status: ArchiveStatus,
  extra?: ArchiveUpdateExtra,
): Promise<void> {
  await withDatabase(() =>
    prisma.archiveSession.update({
      where: { id: archiveId },
      data: {
        status,
        ...extra,
      },
    }),
  );
}

export async function finalizeArchiveForConsensus(
  sessionId: string,
  winner: ArchiveWinner,
  resolution: string,
  metrics: { nodes: number; cpu: string },
): Promise<void> {
  await withDatabase(() =>
    prisma.archiveSession.updateMany({
      where: { debateSessionId: sessionId },
      data: {
        status: "archived",
        winner,
        resolution,
        nodes: metrics.nodes,
        cpu: metrics.cpu,
        error: null,
      },
    }),
  );
}
