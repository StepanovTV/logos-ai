import { PrismaClient } from "@prisma/client";

import debateSessionData from "../src/mocks/debateSession.json";
import historyData from "../src/mocks/historyData.json";
import modelsData from "../src/mocks/models.json";

const prisma = new PrismaClient();

type ArchiveMetrics =
  | { nodes: number; cpu: string }
  | { error: string };

function flattenMetrics(metrics: ArchiveMetrics) {
  if ("error" in metrics) {
    return { nodes: null, cpu: null, error: metrics.error };
  }

  return { nodes: metrics.nodes, cpu: metrics.cpu, error: null };
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
    const metrics = flattenMetrics(session.metrics as ArchiveMetrics);

    await prisma.archiveSession.upsert({
      where: { id: session.id },
      update: {
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
      },
      create: {
        id: session.id,
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
      },
    });
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
