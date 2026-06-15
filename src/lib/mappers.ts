import type { ArchiveSession as ArchiveSessionRecord } from "@prisma/client";

import type {
  AgentId,
  DebateMessage,
  DebateSession,
  JointDecision,
} from "@/types/debate";
import type { ArchiveSession, ArchiveWinner } from "@/types/history";

type DebateSessionWithMessages = {
  sessionId: string;
  topic: string;
  status: string;
  alphaName: string;
  alphaFramework: string;
  alphaStatus: string;
  betaName: string;
  betaFramework: string;
  betaStatus: string;
  jointDecisionText: string | null;
  alphaAgreement: number | null;
  betaAgreement: number | null;
  messages: {
    id: string;
    agent: string;
    timestamp: string;
    confidence: number;
    text: string;
    evidence: string[];
  }[];
};

export function mapArchiveSession(record: ArchiveSessionRecord): ArchiveSession {
  return {
    id: record.id,
    category: record.category,
    date: record.date,
    title: record.title,
    agentAlpha: record.agentAlpha,
    agentBeta: record.agentBeta,
    winner: record.winner as ArchiveWinner,
    resolution: record.resolution,
    metrics:
      record.error !== null
        ? { error: record.error }
        : { nodes: record.nodes ?? 0, cpu: record.cpu ?? "0s" },
  };
}

export function mapDebateSession(record: DebateSessionWithMessages): DebateSession {
  const history: DebateMessage[] = record.messages.map((message) => ({
    id: message.id,
    agent: message.agent as AgentId,
    timestamp: message.timestamp,
    confidence: message.confidence,
    text: message.text,
    evidence: message.evidence,
  }));

  return {
    sessionId: record.sessionId,
    topic: record.topic,
    status: record.status,
    agents: {
      alpha: {
        name: record.alphaName,
        framework: record.alphaFramework,
        status: record.alphaStatus,
      },
      beta: {
        name: record.betaName,
        framework: record.betaFramework,
        status: record.betaStatus,
      },
    },
    history,
    jointDecision: mapJointDecision(record),
  };
}

function mapJointDecision(record: DebateSessionWithMessages): JointDecision {
  return {
    text: record.jointDecisionText ?? "",
    alphaAgreement: record.alphaAgreement ?? 0,
    betaAgreement: record.betaAgreement ?? 0,
  };
}

export function hasJointDecision(record: DebateSessionWithMessages): boolean {
  return record.jointDecisionText !== null;
}
