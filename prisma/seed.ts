import { PrismaClient } from "@prisma/client";

import { linkArchiveToDebateSession } from "../src/lib/link-archive-session";
import debateSessionData from "../src/fixtures/debateSession.json";
import historyData from "../src/fixtures/historyData.json";
import modelsData from "../src/fixtures/models.json";

const prisma = new PrismaClient();

type ArchiveMetrics =
  | { nodes: number; cpu: string }
  | { error: string };

type HistoryEntry = (typeof historyData)[number];

function flattenMetrics(metrics: ArchiveMetrics) {
  if ("error" in metrics) {
    return { nodes: null, cpu: null, error: metrics.error };
  }

  return { nodes: metrics.nodes, cpu: metrics.cpu, error: null };
}

function debateStatus(session: HistoryEntry): string {
  if ("error" in session.metrics) {
    return "timeout";
  }

  return "consensus_reached";
}

function agreementScores(winner: HistoryEntry["winner"]) {
  if (winner === "alpha") {
    return { alphaAgreement: 92, betaAgreement: 68 };
  }

  if (winner === "beta") {
    return { alphaAgreement: 64, betaAgreement: 91 };
  }

  return { alphaAgreement: 50, betaAgreement: 50 };
}

function buildArchiveMessages(session: HistoryEntry) {
  const sessionId = session.debateSessionId;

  return [
    {
      id: `${sessionId}-msg-1`,
      sessionId,
      agent: "alpha",
      timestamp: "00:08",
      confidence: 84,
      text: `${session.agentAlpha} opened with a structured thesis on "${session.title}".`,
      evidence: [session.category],
    },
    {
      id: `${sessionId}-msg-2`,
      sessionId,
      agent: "beta",
      timestamp: "00:22",
      confidence: 79,
      text: `${session.agentBeta} countered with an alternate framework before the session resolved.`,
      evidence: ["Archive Record"],
    },
  ];
}

async function seedArchiveDebateSession(session: HistoryEntry) {
  const { alphaAgreement, betaAgreement } = agreementScores(session.winner);
  const hasJointDecision = !("error" in session.metrics);

  await prisma.debateSession.upsert({
    where: { sessionId: session.debateSessionId },
    update: {
      topic: session.title,
      status: debateStatus(session),
      alphaName: session.agentAlpha,
      alphaFramework: `${session.category} · Analytical Framework`,
      alphaStatus: "idle",
      betaName: session.agentBeta,
      betaFramework: `${session.category} · Adversarial Framework`,
      betaStatus: "idle",
      jointDecisionText: hasJointDecision ? session.resolution : null,
      alphaAgreement: hasJointDecision ? alphaAgreement : null,
      betaAgreement: hasJointDecision ? betaAgreement : null,
    },
    create: {
      sessionId: session.debateSessionId,
      topic: session.title,
      status: debateStatus(session),
      alphaName: session.agentAlpha,
      alphaFramework: `${session.category} · Analytical Framework`,
      alphaStatus: "idle",
      betaName: session.agentBeta,
      betaFramework: `${session.category} · Adversarial Framework`,
      betaStatus: "idle",
      jointDecisionText: hasJointDecision ? session.resolution : null,
      alphaAgreement: hasJointDecision ? alphaAgreement : null,
      betaAgreement: hasJointDecision ? betaAgreement : null,
    },
  });

  for (const message of buildArchiveMessages(session)) {
    await prisma.debateMessage.upsert({
      where: { id: message.id },
      update: message,
      create: message,
    });
  }
}

async function main() {
  await prisma.appSetting.upsert({
    where: { key: "registry" },
    update: { value: { maxActiveNodes: modelsData.maxActiveNodes } },
    create: {
      key: "registry",
      value: { maxActiveNodes: modelsData.maxActiveNodes },
    },
  });

  for (const model of modelsData.models) {
    await prisma.model.upsert({
      where: { id: model.id },
      update: {
        name: model.name,
        provider: model.provider,
        icon: model.icon,
        active: model.active,
        accent: model.accent ?? null,
        paramCount: model.paramCount,
        contextWindow: model.contextWindow,
        releaseDate: model.releaseDate,
        reasoningStyle: model.reasoningStyle,
      },
      create: {
        id: model.id,
        name: model.name,
        provider: model.provider,
        icon: model.icon,
        active: model.active,
        accent: model.accent ?? null,
        paramCount: model.paramCount,
        contextWindow: model.contextWindow,
        releaseDate: model.releaseDate,
        reasoningStyle: model.reasoningStyle,
      },
    });
  }

  for (const session of historyData) {
    await seedArchiveDebateSession(session);

    const metrics = flattenMetrics(session.metrics as ArchiveMetrics);

    const archiveFields = {
      category: session.category,
      date: session.date,
      title: session.title,
      agentAlpha: session.agentAlpha,
      agentBeta: session.agentBeta,
      winner: session.winner,
      resolution: session.resolution,
      nodes: metrics.nodes,
      cpu: metrics.cpu,
      error: metrics.error,
    };

    await prisma.archiveSession.upsert({
      where: { id: session.id },
      update: archiveFields,
      create: {
        id: session.id,
        ...archiveFields,
      },
    });

    await linkArchiveToDebateSession(
      prisma.debateSession,
      session.id,
      session.debateSessionId,
    );
  }

  const { agents, history, jointDecision, sessionId, status, topic } =
    debateSessionData;

  await prisma.debateSession.upsert({
    where: { sessionId },
    update: {
      topic,
      status,
      alphaName: agents.alpha.name,
      alphaFramework: agents.alpha.framework,
      alphaStatus: agents.alpha.status,
      betaName: agents.beta.name,
      betaFramework: agents.beta.framework,
      betaStatus: agents.beta.status,
      jointDecisionText: jointDecision.text,
      alphaAgreement: jointDecision.alphaAgreement,
      betaAgreement: jointDecision.betaAgreement,
    },
    create: {
      sessionId,
      topic,
      status,
      alphaName: agents.alpha.name,
      alphaFramework: agents.alpha.framework,
      alphaStatus: agents.alpha.status,
      betaName: agents.beta.name,
      betaFramework: agents.beta.framework,
      betaStatus: agents.beta.status,
      jointDecisionText: jointDecision.text,
      alphaAgreement: jointDecision.alphaAgreement,
      betaAgreement: jointDecision.betaAgreement,
    },
  });

  for (const message of history) {
    await prisma.debateMessage.upsert({
      where: { id: message.id },
      update: {
        sessionId,
        agent: message.agent,
        timestamp: message.timestamp,
        confidence: message.confidence,
        text: message.text,
        evidence: message.evidence,
      },
      create: {
        id: message.id,
        sessionId,
        agent: message.agent,
        timestamp: message.timestamp,
        confidence: message.confidence,
        text: message.text,
        evidence: message.evidence,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
