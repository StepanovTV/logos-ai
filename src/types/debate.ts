export type AgentId = "alpha" | "beta";

export type AgentConfig = {
  model: string;
  characterDescription: string;
  goals: string;
};

export type DebateConfig = {
  thesis: string;
  alpha: AgentConfig;
  beta: AgentConfig;
  iterations: number;
  initiator: AgentId;
};

export type DebateMessage = {
  id: string;
  agent: AgentId;
  timestamp: string;
  confidence: number;
  text: string;
  evidence: string[];
};

export type JointDecision = {
  text: string;
  alphaAgreement: number;
  betaAgreement: number;
};

export type SessionAgent = {
  name: string;
  framework: string;
  status: string;
};

export type DebateSessionConfig = {
  iterations: number;
  initiator: AgentId;
  alphaModelId: string;
  betaModelId: string;
  currentTurn: number;
  startedAt: Date | null;
  completedAt: Date | null;
};

export type DebateSession = {
  sessionId: string;
  topic: string;
  status: string;
  agents: Record<AgentId, SessionAgent>;
  config: DebateSessionConfig;
  history: DebateMessage[];
  jointDecision: JointDecision;
};
