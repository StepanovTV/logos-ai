import type { DebateMessage, AgentId } from "@/types/debate";
import { BotMessageSquare } from "lucide-react";

type MessageLogProps = {
  message: DebateMessage;
};

const agentAccent: Record<
  AgentId,
  { border: string; badgeBg: string; label: string }
> = {
  alpha: {
    border: "border-l-[#00f0ff]",
    badgeBg: "bg-[#00f0ff]",
    label: "Alpha",
  },
  beta: {
    border: "border-l-[#e9b3ff]",
    badgeBg: "bg-[#e9b3ff]",
    label: "Beta",
  },
};

export function MessageLog({ message }: MessageLogProps) {
  const accent = agentAccent[message.agent];

  return (
    <article
      className={`rounded-lg border border-white/10 border-l-2 bg-[#131316] p-4 ${accent.border}`}
    >
      <header className="mb-3 flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-xs text-[#002022] ${accent.badgeBg}`}
        >
          <BotMessageSquare className="h-3.5 w-3.5 shrink-0" />
          {accent.label} [{message.timestamp}]
        </span>
        <span className="font-mono text-sm text-[#849495]">
          Confidence: {message.confidence}%
        </span>
      </header>

      <p className="font-body text-[16px] leading-relaxed text-[#e4e1e6]">
        {message.text}
      </p>

      {message.evidence.length > 0 && (
        <footer className="mt-4 flex flex-wrap gap-2">
          {message.evidence.map((source) => (
            <span
              key={source}
              className="rounded bg-white/5 px-2 py-1 font-mono text-xs text-[#849495]"
            >
              Data: {source}
            </span>
          ))}
        </footer>
      )}
    </article>
  );
}
