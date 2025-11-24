"use client";

import { useState, useEffect, useCallback } from "react";
import { createTorreService } from "@/src/services";
import type {
  SearchOpportunitiesResponse,
  SearchOpportunitiesParams,
} from "@/src/services";
import { SearchResultItem } from "./SearchResultItem";
import { Pagination } from "./Pagination";
import { usePagination } from "@/src/hooks/usePagination";

const torreService = createTorreService();

export function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchOpportunitiesResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const searchOpportunities = useCallback(
    async (
      term: string,
      cursor: string | null = null,
      type?: "next" | "previous"
    ) => {
      if (!term.trim()) {
        setResults(null);
        setTotal(0);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const params: SearchOpportunitiesParams = cursor
          ? type === "previous"
            ? { before: cursor }
            : { after: cursor }
          : {};

        const response = await torreService.searchOpportunities(
          {
            and: [
              {
                keywords: {
                  term: term,
                  locale: "en",
                },
              },
              {
                status: {
                  code: "open",
                },
              },
            ],
          },
          params
        );

        setResults(response);
        setTotal(response.total);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to search opportunities"
        );
        setResults(null);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchOpportunities(searchTerm, null);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchOpportunities]);

  const handlePageChange = useCallback(
    (type: "next" | "previous", cursor: string | null) => {
      searchOpportunities(searchTerm, cursor, type);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [searchTerm, searchOpportunities]
  );

  const pagination = usePagination({
    results,
    onPageChange: handlePageChange,
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Torre Job Search
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Search for open job opportunities
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for jobs (e.g., Software Engineer, Designer, Product Manager...)"
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:border-zinc-400"
          />
        </div>

        {/* Results Count and Loading State */}
        {searchTerm && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {isLoading ? (
                "Searching..."
              ) : (
                <>
                  {total > 0 ? (
                    <>
                      Found <span className="font-semibold">{total}</span>{" "}
                      {total === 1 ? "opportunity" : "opportunities"}
                      {results &&
                        results?.results.length < total &&
                        ` (showing ${results?.results.length})`}
                    </>
                  ) : (
                    "No opportunities found"
                  )}
                </>
              )}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Results List */}
        <div className="space-y-4">
          {isLoading &&
          searchTerm &&
          results &&
          results.results.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-50" />
            </div>
          ) : (
            results?.results.map((opportunity) => (
              <SearchResultItem
                key={opportunity.id}
                opportunity={opportunity}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {results && results.results.length > 0 && (
          <div className="mt-6">
            <Pagination pagination={pagination} isLoading={isLoading} />
          </div>
        )}

        {/* Empty State */}
        {!searchTerm &&
          !isLoading &&
          results &&
          results.results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg
                className="mb-4 h-16 w-16 text-zinc-300 dark:text-zinc-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
                Start typing to search for opportunities
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
