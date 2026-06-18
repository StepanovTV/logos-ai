export type ArchiveStatus =
  | "initialized"
  | "active"
  | "consensus_reached"
  | "timeout"
  | "failed"
  | "archived";

export type ArchiveWinner = "alpha" | "beta" | "draw" | "pending";

export type ArchiveMetrics =
  | { nodes: number; cpu: string }
  | { error: string };

export type ArchiveSession = {
  id: string;
  debateSessionId: string | null;
  status: ArchiveStatus;
  category: string;
  date: string;
  title: string;
  agentAlpha: string;
  agentBeta: string;
  winner: ArchiveWinner;
  resolution: string;
  metrics: ArchiveMetrics;
};

export const ARCHIVE_STATUSES: ArchiveStatus[] = [
  "initialized",
  "active",
  "consensus_reached",
  "timeout",
  "failed",
  "archived",
];

export function isArchiveStatus(value: string): value is ArchiveStatus {
  return ARCHIVE_STATUSES.includes(value as ArchiveStatus);
}

export function normalizeArchiveStatus(
  status: string | null | undefined,
  context?: { winner: string; hasError: boolean },
): ArchiveStatus {
  if (status && isArchiveStatus(status)) {
    return status;
  }

  if (context) {
    if (context.winner === "pending") {
      return "initialized";
    }

    if (context.hasError) {
      return "timeout";
    }

    if (
      context.winner === "alpha" ||
      context.winner === "beta" ||
      context.winner === "draw"
    ) {
      return "archived";
    }
  }

  return "initialized";
}
