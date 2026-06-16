export type ArchiveWinner = "alpha" | "beta" | "draw" | "pending";

export type ArchiveMetrics =
  | { nodes: number; cpu: string }
  | { error: string };

export type ArchiveSession = {
  id: string;
  debateSessionId: string | null;
  category: string;
  date: string;
  title: string;
  agentAlpha: string;
  agentBeta: string;
  winner: ArchiveWinner;
  resolution: string;
  metrics: ArchiveMetrics;
};
