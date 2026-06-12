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
};
