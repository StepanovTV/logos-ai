"use server";

import { redirect } from "next/navigation";

import { linkArchiveToDebateSession } from "@/lib/link-archive-session";
import { prisma } from "@/lib/prisma";
import { withDatabase } from "@/lib/with-database";
import type { DebateConfig } from "@/types/debate";

function buildAgentName(label: string, modelId: string): string {
  return `${label} · ${modelId}`;
}

function buildFramework(config: DebateConfig["alpha"]): string {
  return `${config.characterDescription}\n\nGoals: ${config.goals}`;
}

function formatArchiveDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function createSessionIds(timestamp: number) {
  return {
    archiveId: `arch-${timestamp}`,
    debateSessionId: `sys-${timestamp}`,
  };
}

export async function initializeBreach(config: DebateConfig): Promise<void> {
  if (!config.thesis.trim()) {
    throw new Error("Thesis is required to initialize a debate session.");
  }

  const timestamp = Date.now();
  const { archiveId, debateSessionId } = createSessionIds(timestamp);
  const thesis = config.thesis.trim();
  const alphaName = buildAgentName("Agent Alpha", config.alpha.model);
  const betaName = buildAgentName("Agent Beta", config.beta.model);
  const alphaFramework = buildFramework(config.alpha);
  const betaFramework = buildFramework(config.beta);

  await withDatabase(() =>
    prisma.$transaction(async (tx) => {
      await tx.archiveSession.create({
        data: {
          id: archiveId,
          category: "ACTIVE",
          date: formatArchiveDate(new Date(timestamp)),
          title: thesis,
          agentAlpha: alphaName,
          agentBeta: betaName,
          winner: "pending",
          resolution: "Debate in progress.",
          nodes: null,
          cpu: null,
          error: null,
        },
      });

      await tx.debateSession.create({
        data: {
          sessionId: debateSessionId,
          topic: thesis,
          status: "initialized",
          alphaName,
          alphaFramework,
          alphaStatus: config.initiator === "alpha" ? "active" : "idle",
          betaName,
          betaFramework,
          betaStatus: config.initiator === "beta" ? "active" : "idle",
        },
      });

      await linkArchiveToDebateSession(tx.debateSession, archiveId, debateSessionId);
    }),
  );

  redirect(`/session/${debateSessionId}`);
}
