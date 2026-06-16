"use client";

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

function isErrorMetrics(
  metrics: ArchiveSession["metrics"],
): metrics is { error: string } {
  return "error" in metrics;
}

export function ArchiveCard({ session }: ArchiveCardProps) {
  const styles = winnerStyles[session.winner];
  const isDraw = session.winner === "draw";
  const isPending = session.winner === "pending";

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col rounded-lg border border-white/10 bg-[#1f1f22]/60 p-6 backdrop-blur-md transition-shadow duration-200 ${styles.borderAccent} ${styles.hoverGlow}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`font-mono text-[10px] uppercase tracking-wider ${styles.categoryColor}`}
        >
          {session.category}
        </span>
        <span className="rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] text-[#849495]">
          {session.date}
        </span>
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

        {isPending ? (
          <span className="rounded border border-[#00f0ff]/30 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#00f0ff]">
            LIVE
          </span>
        ) : isDraw ? (
          <span className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#849495]">
            DRAW
          </span>
        ) : (
          <span className="text-[#849495]">VS</span>
        )}

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
          {isErrorMetrics(session.metrics) ? (
            <span className="rounded border border-[#ffb4ab]/30 bg-[#93000a]/20 px-2 py-1 font-mono text-[10px] text-[#ffb4ab]">
              {session.metrics.error}
            </span>
          ) : (
            <>
              <span className="rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-[#849495]">
                {session.metrics.nodes} Nodes
              </span>
              <span className="rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-[#849495]">
                {session.metrics.cpu} CPU
              </span>
            </>
          )}
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
