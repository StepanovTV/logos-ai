export type ModelIcon = "brain" | "cpu" | "infinity" | "network";

export type ModelAccent = "alpha" | "beta";

export type RegistryModel = {
  id: string;
  name: string;
  provider: string;
  icon: ModelIcon;
  active: boolean;
  accent?: ModelAccent;
  paramCount: string;
  contextWindow: string;
  releaseDate: string;
  reasoningStyle: string;
};

export type ModelsRegistry = {
  maxActiveNodes: number;
  models: RegistryModel[];
};
