"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import type { DebateConfig } from "@/types/debate";

function buildAgentName(label: string, modelId: string): string {
  return `${label} · ${modelId}`;
}

function buildFramework(config: DebateConfig["alpha"]): string {
  return `${config.characterDescription}\n\nGoals: ${config.goals}`;
}

export async function initializeBreach(config: DebateConfig): Promise<void> {
  if (!config.thesis.trim()) {
    throw new Error("Thesis is required to initialize a debate session.");
  }

  const sessionId = `sys-${Date.now()}`;

  await prisma.debateSession.create({
    data: {
      sessionId,
      topic: config.thesis.trim(),
      status: "initialized",
      alphaName: buildAgentName("Agent Alpha", config.alpha.model),
      alphaFramework: buildFramework(config.alpha),
      alphaStatus: config.initiator === "alpha" ? "active" : "idle",
      betaName: buildAgentName("Agent Beta", config.beta.model),
      betaFramework: buildFramework(config.beta),
      betaStatus: config.initiator === "beta" ? "active" : "idle",
    },
  });

  redirect(`/session/${sessionId}`);
}
