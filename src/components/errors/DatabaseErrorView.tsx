"use client";

import { NeonButton } from "@/components/ui/NeonButton";
import { Database, RefreshCw } from "lucide-react";

type DatabaseErrorViewProps = {
  onRetry?: () => void;
};

export function DatabaseErrorView({ onRetry }: DatabaseErrorViewProps) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg border border-[#ffb4ab]/30 bg-[#93000a]/20">
        <Database className="h-8 w-8 text-[#ffb4ab]" aria-hidden="true" />
      </div>

      <p className="font-mono text-5xl font-bold tracking-tight text-[#ffb4ab] sm:text-6xl">
        500 Internal Server Error
      </p>

      <p className="mt-6 font-mono text-[10px] uppercase tracking-wider text-[#ffb4ab]">
        DATABASE CONNECTION FAILURE
      </p>
      <h1 className="mt-3 font-heading text-2xl font-bold text-white sm:text-3xl mb-6">
        PostgreSQL Unreachable
      </h1>

      {onRetry && (
        <NeonButton
          onClick={onRetry}
          icon={<RefreshCw className="h-4 w-4" />}
          className="mt-10 justify-center"
        >
          Retry Connection
        </NeonButton>
      )}
    </div>
  );
}
