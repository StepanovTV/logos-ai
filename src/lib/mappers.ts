import type {
  ArchiveSession as ArchiveSessionRecord,
  Model as ModelRecord,
} from "@prisma/client";

import type {
  AgentId,
  DebateMessage,
  DebateSession,
  JointDecision,
} from "@/types/debate";
import type { ArchiveSession, ArchiveWinner } from "@/types/history";
import type {
  ModelAccent,
  ModelIcon,
  RegistryModel,
} from "@/types/models";

const DEFAULT_MAX_ACTIVE_NODES = 16;

const MODEL_ICONS: ModelIcon[] = ["brain", "cpu", "infinity", "network"];
const MODEL_ACCENTS: ModelAccent[] = ["alpha", "beta"];

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
    debateSessionId: record.debateSessionId,
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

function isModelIcon(value: string): value is ModelIcon {
  return MODEL_ICONS.includes(value as ModelIcon);
}

function isModelAccent(value: string): value is ModelAccent {
  return MODEL_ACCENTS.includes(value as ModelAccent);
}

export function mapRegistryModel(record: ModelRecord): RegistryModel {
  return {
    id: record.id,
    name: record.name,
    provider: record.provider,
    icon: isModelIcon(record.icon) ? record.icon : "brain",
    active: record.active,
    accent:
      record.accent && isModelAccent(record.accent) ? record.accent : undefined,
    paramCount: record.paramCount,
    contextWindow: record.contextWindow,
    releaseDate: record.releaseDate,
    reasoningStyle: record.reasoningStyle,
  };
}

export function resolveMaxActiveNodes(registrySetting?: unknown): number {
  if (
    registrySetting &&
    typeof registrySetting === "object" &&
    "maxActiveNodes" in registrySetting &&
    typeof registrySetting.maxActiveNodes === "number"
  ) {
    return registrySetting.maxActiveNodes;
  }

  return DEFAULT_MAX_ACTIVE_NODES;
}
