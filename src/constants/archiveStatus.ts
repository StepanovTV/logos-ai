import type { ArchiveStatus, ArchiveWinner } from "@/types/history";

type StatusMeta = {
  label: string;
  className: string;
};

export const ARCHIVE_STATUS_META: Record<ArchiveStatus, StatusMeta> = {
  initialized: {
    label: "QUEUED",
    className:
      "border-white/20 bg-white/5 text-[#849495]",
  },
  active: {
    label: "LIVE",
    className:
      "border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff] animate-pulse",
  },
  consensus_reached: {
    label: "RESOLVED",
    className:
      "border-[#4caf50]/30 bg-[#4caf50]/10 text-[#81c784]",
  },
  timeout: {
    label: "TIMEOUT",
    className:
      "border-[#ffb74d]/30 bg-[#ffb74d]/10 text-[#ffb74d]",
  },
  failed: {
    label: "FAILED",
    className:
      "border-[#ffb4ab]/30 bg-[#93000a]/20 text-[#ffb4ab]",
  },
  archived: {
    label: "ARCHIVED",
    className:
      "border-[#849495]/30 bg-[#849495]/10 text-[#b9cacb]",
  },
};

type OutcomeMeta = {
  label: string;
  className: string;
};

export const ARCHIVE_OUTCOME_META: Record<
  Exclude<ArchiveWinner, "pending">,
  OutcomeMeta
> = {
  alpha: {
    label: "ALPHA WON",
    className: "border-[#00f0ff]/30 text-[#00f0ff]",
  },
  beta: {
    label: "BETA WON",
    className: "border-[#e9b3ff]/30 text-[#e9b3ff]",
  },
  draw: {
    label: "DRAW",
    className: "border-white/20 text-[#849495]",
  },
};

export const STATUS_FILTER_OPTIONS: Array<{
  value: "All" | ArchiveStatus;
  label: string;
}> = [
  { value: "All", label: "All" },
  { value: "initialized", label: "Queued" },
  { value: "active", label: "Live" },
  { value: "consensus_reached", label: "Resolved" },
  { value: "timeout", label: "Timeout" },
  { value: "failed", label: "Failed" },
  { value: "archived", label: "Archived" },
];

export function getArchiveStatusMeta(status: ArchiveStatus): StatusMeta {
  return ARCHIVE_STATUS_META[status] ?? ARCHIVE_STATUS_META.initialized;
}
