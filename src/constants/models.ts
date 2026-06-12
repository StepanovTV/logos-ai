export type AgentModel = {
  value: string;
  label: string;
};

export const AGENT_MODELS: AgentModel[] = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
  { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
  { value: "deepseek-r1", label: "DeepSeek R1" },
];
