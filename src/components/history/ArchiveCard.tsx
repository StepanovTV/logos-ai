"use client";

import {
  ARCHIVE_OUTCOME_META,
  getArchiveStatusMeta,
} from "@/constants/archiveStatus";
import type { ArchiveSession, ArchiveWinner } from "@/types/history";
import { motion } from "framer-motion";
import Link from "next/link";

type ArchiveCardProps = {
  session: ArchiveSession;
};

type WinnerStyles = {
  borderAccent: string;
  categoryColor: string;
  hoverGlow: string;
};

const winnerStyles: Record<ArchiveWinner, WinnerStyles> = {
  alpha: {
    borderAccent: "border-l-4 border-l-[#00f0ff]",
    categoryColor: "text-[#00f0ff]",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]",
  },
  beta: {
    borderAccent: "border-l-4 border-l-[#e9b3ff]",
    categoryColor: "text-[#e9b3ff]",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(233,179,255,0.15)]",
  },
  draw: {
    borderAccent: "border-l-4 border-l-[#849495]",
    categoryColor: "text-[#849495]",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(132,148,149,0.15)]",
  },
  pending: {
    borderAccent: "border-l-4 border-l-[#00f0ff]",
    categoryColor: "text-[#00f0ff]",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]",
  },
};

const pendingBorderStyles: Record<
  ArchiveSession["status"],
  string
> = {
  initialized: "border-l-4 border-l-[#849495]",
  active: "border-l-4 border-l-[#00f0ff]",
  consensus_reached: "border-l-4 border-l-[#81c784]",
  timeout: "border-l-4 border-l-[#ffb74d]",
  failed: "border-l-4 border-l-[#ffb4ab]",
  archived: "border-l-4 border-l-[#849495]",
};

function isErrorMetrics(
  metrics: ArchiveSession["metrics"],
): metrics is { error: string } {
  return "error" in metrics;
}

function resolveBorderAccent(session: ArchiveSession): string {
  if (session.winner !== "pending") {
    return winnerStyles[session.winner].borderAccent;
  }

  return pendingBorderStyles[session.status] ?? pendingBorderStyles.initialized;
}

function resolveHoverGlow(session: ArchiveSession): string {
  if (session.winner !== "pending") {
    return winnerStyles[session.winner].hoverGlow;
  }

  if (session.status === "active") {
    return winnerStyles.pending.hoverGlow;
  }

  return "hover:shadow-[0_0_20px_rgba(132,148,149,0.1)]";
}

function resolveCategoryColor(session: ArchiveSession): string {
  if (session.winner !== "pending") {
    return winnerStyles[session.winner].categoryColor;
  }

  return winnerStyles.pending.categoryColor;
}

export function ArchiveCard({ session }: ArchiveCardProps) {
  const statusMeta = getArchiveStatusMeta(session.status);
  const showOutcome = session.winner !== "pending";
  const outcomeMeta = showOutcome
    ? ARCHIVE_OUTCOME_META[session.winner as Exclude<typeof session.winner, "pending">]
    : null;
  const showErrorBadge =
    (session.status === "timeout" || session.status === "failed") &&
    isErrorMetrics(session.metrics);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col rounded-lg border border-white/10 bg-[#1f1f22]/60 p-6 backdrop-blur-md transition-shadow duration-200 ${resolveBorderAccent(session)} ${resolveHoverGlow(session)}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`font-mono text-[10px] uppercase tracking-wider ${resolveCategoryColor(session)}`}
        >
          {session.category}
        </span>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <span
            className={`rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${statusMeta.className}`}
          >
            {statusMeta.label}
          </span>
          {outcomeMeta && (
            <span
              className={`rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${outcomeMeta.className}`}
            >
              {outcomeMeta.label}
            </span>
          )}
          <span className="rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] text-[#849495]">
            {session.date}
          </span>
        </div>
      </div>

      <h3 className="mt-3 font-heading text-2xl font-semibold leading-tight text-white">
        {session.title}
      </h3>

      <div className="mt-4 flex items-center gap-2 font-mono text-xs">
        <span className="flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#00f0ff]"
            aria-hidden="true"
          />
          {session.agentAlpha}
        </span>

        <span className="text-[#849495]">VS</span>

        <span className="flex items-center gap-1.5">
          {session.agentBeta}
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#e9b3ff]"
            aria-hidden="true"
          />
        </span>
      </div>

      <div className="mt-4">
        <p className="font-medium text-white">Resolution:</p>
        <p className="mt-1 line-clamp-4 font-body text-sm text-[#b9cacb]">
          {session.resolution}
        </p>
      </div>

      <div className="mt-auto flex items-end justify-between gap-2 pt-6">
        <div className="flex flex-wrap gap-2">
          {showErrorBadge && isErrorMetrics(session.metrics) ? (
            <span className="rounded border border-[#ffb4ab]/30 bg-[#93000a]/20 px-2 py-1 font-mono text-[10px] text-[#ffb4ab]">
              {session.metrics.error}
            </span>
          ) : !isErrorMetrics(session.metrics) ? (
            <>
              <span className="rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-[#849495]">
                {session.metrics.nodes} Nodes
              </span>
              <span className="rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-[#849495]">
                {session.metrics.cpu} CPU
              </span>
            </>
          ) : null}
        </div>

        {session.debateSessionId && (
          <Link
            href={`/session/${session.debateSessionId}`}
            className="shrink-0 rounded-sm border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[#e9b3ff] transition-all hover:border-[#e9b3ff] hover:shadow-[0_0_15px_rgba(233,179,255,0.3)]"
          >
            VIEW DEBATE
          </Link>
        )}
      </div>
    </motion.article>
  );
}
