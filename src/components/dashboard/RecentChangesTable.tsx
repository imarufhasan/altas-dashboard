"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

import { RecentChangesResponse } from "@/src/types";

import { StatusBadge } from "@/src/components/ui/StatusBadge";

type RecentChangesTableProps = {
  recentChanges: RecentChangesResponse;
};

export function RecentChangesTable({ recentChanges }: RecentChangesTableProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");

  const changes = recentChanges?.data ?? [];

  const filteredChanges = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return changes;
    }

    return changes.filter((change) =>
      [
        change.title,
        change.type,
        change.status,
        change.action,
        change.updatedBy,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [changes, search]);

  const total = filteredChanges.length;

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const visibleChanges = filteredChanges.slice(startIndex, endIndex);

  const startItem = total === 0 ? 0 : startIndex + 1;

  const endItem = Math.min(endIndex, total);

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }

    setPage(nextPage);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(event.target.value));
    setPage(1);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-atlas-border bg-atlas-surface">
      <div className="flex flex-col gap-3 border-b border-atlas-border px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h2 className="font-serif text-lg text-atlas-text">
          Recent Content Changes
        </h2>

        <div className="relative w-full sm:w-64">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-atlas-textMuted"
          />

          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search changes..."
            className="h-9 w-full rounded-md border border-atlas-border bg-atlas-background pl-9 pr-9 text-sm text-atlas-text outline-none placeholder:text-atlas-textMuted focus:border-atlas-gold"
          />

          {/* {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-atlas-textMuted hover:text-atlas-text"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )} */}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-212.5 border-collapse text-left">
          <thead>
            <tr className="border-b border-atlas-border bg-black text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
              <th className="px-6 py-3">Content</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Last Updated</th>
              <th className="px-6 py-3">Updated By</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-atlas-border text-sm text-atlas-text">
            {visibleChanges.length > 0 ? (
              visibleChanges.map((change) => (
                <tr
                  key={change.id}
                  className="transition-colors hover:bg-atlas-background/50"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold">{change.title}</p>

                      {/* <p className="mt-1 max-w-md text-xs text-atlas-textMuted">
                        {change.summary}
                      </p> */}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-atlas-textMuted">
                    {change.type}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={change.status} />
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-atlas-textMuted">
                    {change.updatedAt}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-atlas-textMuted">
                    {change.updatedBy}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-atlas-textMuted"
                >
                  No content changes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 border-t border-atlas-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        {/* Result Info */}
        <div className="flex items-center gap-2 text-xs text-atlas-textMuted">
          <span>Rows per page</span>

          <select
            value={limit}
            onChange={handleLimitChange}
            className="rounded-md border border-atlas-border bg-atlas-surface px-2 py-1.5 text-xs text-atlas-text outline-none focus:border-atlas-gold"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>

          <span className="ml-2">
            {startItem}-{endItem} of {total}
          </span>
        </div>

        {/* Page Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-atlas-border text-atlas-textMuted transition hover:border-atlas-gold hover:text-atlas-gold disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => goToPage(pageNumber)}
                className={`h-8 min-w-8 rounded-md border px-2 text-xs font-semibold transition ${
                  page === pageNumber
                    ? "border-atlas-gold bg-atlas-gold text-white"
                    : "border-atlas-border text-atlas-textMuted hover:border-atlas-gold hover:text-atlas-gold"
                }`}
              >
                {pageNumber}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-atlas-border text-atlas-textMuted transition hover:border-atlas-gold hover:text-atlas-gold disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
