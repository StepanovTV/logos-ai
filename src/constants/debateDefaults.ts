import type { DebateConfig } from "@/types/debate";

export const defaultDebateConfig: DebateConfig = {
  thesis: "",
  alpha: {
    model: "gpt-4o",
    characterDescription:
      "Analytical, strict logic, utilitarian approach prioritizing quantifiable outcomes and systemic efficiency.",
    goals:
      "Deconstruct opposition argument based on empirical data and structural logic.",
  },
  beta: {
    model: "gpt-4o",
    characterDescription:
      "Empathetic, holistic thinking, deontological emphasis on human rights and intrinsic values.",
    goals:
      "Argue for human-centric ethical outcomes and dismantle purely utilitarian frameworks.",
  },
  iterations: 10,
  initiator: "alpha",
};
