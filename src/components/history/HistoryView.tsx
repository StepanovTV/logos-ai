"use client";

import { ArchiveCard } from "@/components/history/ArchiveCard";
import { TopNav } from "@/components/layout/TopNav";
import type { ArchiveSession } from "@/types/history";
import { Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";

type HistoryViewProps = {
  sessions: ArchiveSession[];
};

type SortTab = "Recent" | "Impact" | "Duration";

const sortTabs: SortTab[] = ["Recent", "Impact", "Duration"];

export function HistoryView({ sessions }: HistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] = useState<SortTab>("Recent");

  const filteredSessions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return sessions;
    }

    return sessions.filter(
      (session) =>
        session.title.toLowerCase().includes(query) ||
        session.category.toLowerCase().includes(query),
    );
  }, [searchQuery, sessions]);

  return (
    <div className="p-8">
      <TopNav />

      <header className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            Battle History
          </h1>
          <p className="mt-2 font-body text-sm text-[#849495] sm:text-base">
            Review past logical conflicts and synthetic resolutions.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#849495]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search parameters.."
              className="w-full rounded-sm border border-white/10 bg-[#1f1f22]/60 py-2 pl-9 pr-4 font-mono text-xs text-[#e4e1e6] placeholder:text-[#849495]/60 backdrop-blur-md focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff]/30 sm:w-64"
            />
          </div>

          <div className="inline-flex items-center rounded-sm border border-white/10 bg-[#1f1f22]/60 p-0.5 backdrop-blur-md">
            {sortTabs.map((tab) => {
              const isActive = activeSort === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveSort(tab)}
                  className={`rounded-sm px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    isActive
                      ? "border border-white/20 bg-white/10 text-white"
                      : "border border-transparent text-[#849495] hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
            <button
              type="button"
              aria-label="Filter archives"
              className="ml-0.5 flex h-7 w-7 items-center justify-center rounded-sm text-[#849495] transition-colors hover:bg-white/5 hover:text-white"
            >
              <Filter className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredSessions.map((session) => (
          <ArchiveCard key={session.id} session={session} />
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <p className="mt-8 text-center font-body text-sm text-[#849495]">
          No archives match your search parameters.
        </p>
      )}

      <div className="mt-12 flex justify-center">
        <button
          type="button"
          className="rounded-sm border border-white/10 px-6 py-3 font-mono text-xs uppercase tracking-widest text-[#849495] transition-colors hover:border-white/20 hover:text-white"
        >
          LOAD ARCHIVE
        </button>
      </div>
    </div>
  );
}
