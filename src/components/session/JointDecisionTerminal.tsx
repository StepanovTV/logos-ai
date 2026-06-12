"use client";

import type { JointDecision } from "@/types/debate";
import { Handshake } from "lucide-react";

type JointDecisionTerminalProps = {
  decision: JointDecision;
};

export function JointDecisionTerminal({ decision }: JointDecisionTerminalProps) {
  return (
    <section
      className="rounded-lg border border-[#3b494b] bg-[#0e0e11] p-6"
    >
      <h2 className="mb-4 flex items-center gap-2 font-mono text-sm text-white">
        <Handshake className="h-4 w-4 shrink-0" />
        СОВМЕСТНОЕ РЕШЕНИЕ (JOINT DECISION)
      </h2>

      <p className="font-body text-[16px] text-white">{decision.text}</p>

      <footer className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-[#e4e1e6]">
          <span className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full bg-[#00f0ff]"
              aria-hidden="true"
            />
            Alpha Agreement: {decision.alphaAgreement}%
          </span>
          <span className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full bg-[#e9b3ff]"
              aria-hidden="true"
            />
            Beta Agreement: {decision.betaAgreement}%
          </span>
        </div>

        <button
          type="button"
          className="rounded-sm border border-white/20 px-4 py-2 font-mono text-xs uppercase tracking-wider text-white transition-colors hover:border-white"
        >
          Log Consensus
        </button>
      </footer>
    </section>
  );
}
