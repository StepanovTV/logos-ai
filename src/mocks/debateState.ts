import type { AgentModel } from "@/constants/models";
import type { DebateConfig } from "@/types/debate";
import rawDebateState from "./debateState.json";

export type DebateStateMock = {
  availableModels: AgentModel[];
  defaultState: DebateConfig;
};

export const debateState: DebateStateMock = {
  availableModels: rawDebateState.availableModels,
  defaultState: rawDebateState.defaultState as DebateConfig,
};
