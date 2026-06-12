export type ArchiveWinner = "alpha" | "beta" | "draw";

export type ArchiveMetrics =
  | { nodes: number; cpu: string }
  | { error: string };

export type ArchiveSession = {
  id: string;
  category: string;
  date: string;
  title: string;
  agentAlpha: string;
  agentBeta: string;
  winner: ArchiveWinner;
  resolution: string;
  metrics: ArchiveMetrics;
};
