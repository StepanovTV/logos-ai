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

type DebateConfigFixture = {
  iterations: number;
  initiator: string;
  alphaModelId: string;
  betaModelId: string;
  currentTurn: number;
  startedAt: string | null;
  completedAt: string | null;
};

function buildDebateConfigFields(config: DebateConfigFixture) {
  return {
    iterations: config.iterations,
    initiator: config.initiator,
    alphaModelId: config.alphaModelId,
    betaModelId: config.betaModelId,
    currentTurn: config.currentTurn,
    startedAt: config.startedAt ? new Date(config.startedAt) : null,
    completedAt: config.completedAt ? new Date(config.completedAt) : null,
  };
}

function flattenMetrics(metrics: ArchiveMetrics) {
  if ("error" in metrics) {
    return { nodes: null, cpu: null, error: metrics.error };
  }

  return { nodes: metrics.nodes, cpu: metrics.cpu, error: null };
}

function deriveArchiveStatus(session: HistoryEntry): string {
  if ("status" in session && typeof session.status === "string") {
    return session.status;
  }

  if (session.winner === "pending") {
    return "initialized";
  }

  if ("error" in session.metrics) {
    return "timeout";
  }

  if (session.winner === "alpha" || session.winner === "beta" || session.winner === "draw") {
    return "archived";
  }

  return "initialized";
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
  const configFields = buildDebateConfigFields(session.debateConfig);

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
      ...configFields,
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
      ...configFields,
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
      status: deriveArchiveStatus(session),
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

  const { agents, config, history, jointDecision, sessionId, status, topic } =
    debateSessionData;
  const configFields = buildDebateConfigFields(config);

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
      ...configFields,
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
      ...configFields,
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
