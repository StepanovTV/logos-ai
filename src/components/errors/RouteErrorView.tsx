"use client";

import { PageShell } from "@/components/layout/PageShell";
import { NeonButton } from "@/components/ui/NeonButton";
import { DatabaseErrorView } from "@/components/errors/DatabaseErrorView";
import { isDatabaseConnectionError } from "@/lib/db-errors";
import { AlertTriangle, RefreshCw } from "lucide-react";

type RouteErrorViewProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function RouteErrorView({ error, reset }: RouteErrorViewProps) {
  if (isDatabaseConnectionError(error)) {
    return (
      <PageShell>
        <DatabaseErrorView onRetry={reset} />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto flex max-w-xl flex-col items-center py-12 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg border border-[#ffb4ab]/30 bg-[#93000a]/20">
          <AlertTriangle
            className="h-8 w-8 text-[#ffb4ab]"
            aria-hidden="true"
          />
        </div>

        <p className="font-mono text-[10px] uppercase tracking-wider text-[#ffb4ab]">
          System Error
        </p>
        <h1 className="mt-3 font-heading text-2xl font-bold text-white">
          Something went wrong
        </h1>
        <p className="mt-3 font-body text-sm text-[#849495]">
          An unexpected error occurred while rendering this page.
        </p>

        <NeonButton
          onClick={reset}
          icon={<RefreshCw className="h-4 w-4" />}
          className="mt-8 justify-center"
        >
          Try Again
        </NeonButton>
      </div>
    </PageShell>
  );
}
