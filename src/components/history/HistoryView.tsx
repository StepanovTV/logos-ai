"use client";

import { ArchiveCard } from "@/components/history/ArchiveCard";
import { TopNav } from "@/components/layout/TopNav";
import { STATUS_FILTER_OPTIONS } from "@/constants/archiveStatus";
import type { ArchiveSession, ArchiveStatus } from "@/types/history";
import { Filter, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type HistoryViewProps = {
  sessions: ArchiveSession[];
};

type SortTab = "Recent" | "Impact" | "Duration";
type StatusFilter = "All" | ArchiveStatus;

const sortTabs: SortTab[] = ["Recent", "Impact", "Duration"];

export function HistoryView({ sessions }: HistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] = useState<SortTab>("Recent");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSessions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return sessions.filter((session) => {
      const matchesSearch =
        !query ||
        session.title.toLowerCase().includes(query) ||
        session.category.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || session.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, sessions, statusFilter]);

  const activeFilterLabel =
    STATUS_FILTER_OPTIONS.find((option) => option.value === statusFilter)
      ?.label ?? "All";

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
            <div className="relative ml-0.5" ref={filterRef}>
              <button
                type="button"
                aria-label="Filter archives by status"
                aria-expanded={isFilterOpen}
                onClick={() => setIsFilterOpen((open) => !open)}
                className={`flex h-7 items-center gap-1 rounded-sm px-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                  statusFilter !== "All"
                    ? "text-[#00f0ff]"
                    : "text-[#849495] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Filter className="h-3.5 w-3.5" />
                {statusFilter !== "All" ? activeFilterLabel : ""}
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 min-w-[10rem] rounded-sm border border-white/10 bg-[#1f1f22] p-1 shadow-lg backdrop-blur-md">
                  {STATUS_FILTER_OPTIONS.map((option) => {
                    const isActive = statusFilter === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setStatusFilter(option.value);
                          setIsFilterOpen(false);
                        }}
                        className={`block w-full rounded-sm px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider transition-colors ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-[#849495] hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
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
          {statusFilter !== "All" || searchQuery.trim()
            ? "No archives match your search or status filter."
            : "No archives available."}
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
