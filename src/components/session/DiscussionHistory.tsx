"use client";

import type { DebateMessage } from "@/types/debate";
import { ChevronsUpDown, RotateCcw } from "lucide-react";
import { useState } from "react";
import { MessageLog } from "./MessageLog";

type DiscussionHistoryProps = {
  history: DebateMessage[];
};

export function DiscussionHistory({ history }: DiscussionHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section className="mt-8">
      <button
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-[#1f1f22]/40 px-4 py-3 text-left transition-colors hover:bg-[#1f1f22]/60"
        aria-expanded={isExpanded}
      >
        <span className="flex items-center gap-2 font-body text-sm text-white">
          <RotateCcw className="h-4 w-4 text-[#849495]" />
          История дискуссии (Discussion History)
        </span>
        <ChevronsUpDown className="h-4 w-4 text-[#849495]" />
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {history.map((message) => (
            <MessageLog key={message.id} message={message} />
          ))}
        </div>
      )}
    </section>
  );
}
