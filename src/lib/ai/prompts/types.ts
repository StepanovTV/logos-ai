/** Debate orchestration mode — determines which prompt layers are included. */
export type PromptMode = "debate_turn" | "consensus";

/** Identifier for a prompt layer in the assembly stack. */
export type PromptLayerId = "root" | "mode" | "session" | "agent" | "turn";

/** Metadata parsed from a layer file's YAML frontmatter. */
export type PromptLayerMeta = {
  layer: number;
  id: PromptLayerId;
  version: string;
  required: boolean;
  applies_to: PromptMode[];
};

/** Ordered layer definition used by the future prompt assembler (Phase 2). */
export type PromptLayerDefinition = {
  meta: PromptLayerMeta;
  /** Raw template body (may contain {{placeholders}}). */
  body: string;
};

/** Variables substituted into layers 1–4 at assembly time. */
export type PromptVariables = {
  mode?: PromptMode;
  topic?: string;
  iterations?: number;
  currentTurn?: number;
  initiator?: "alpha" | "beta";
  agentId?: "alpha" | "beta";
  agentName?: string;
  framework?: string;
  history?: string;
};

/** Result of prompt assembly — ready for OpenRouter message payload. */
export type AssembledPrompt = {
  system: string;
  user?: string;
};
