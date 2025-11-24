"use client";

import { useState, useEffect } from "react";
import { createTorreService } from "@/src/services";
import type { Opportunity } from "@/src/services";
import { SearchResultItem } from "./SearchResultItem";

const torreService = createTorreService();

export function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const searchOpportunities = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        setTotal(0);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await torreService.searchOpportunities({
          and: [
            {
              keywords: {
                term: searchTerm,
                locale: "en",
              },
            },
            {
              status: {
                code: "open",
              },
            },
          ],
        });

        setResults(response.results);
        setTotal(response.total);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to search opportunities"
        );
        setResults([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchOpportunities();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

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
                      {results.length < total && ` (showing ${results.length})`}
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
          {isLoading && searchTerm && results.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-50" />
            </div>
          ) : (
            results.map((opportunity) => (
              <SearchResultItem
                key={opportunity.id}
                opportunity={opportunity}
              />
            ))
          )}
        </div>

        {/* Empty State */}
        {!searchTerm && !isLoading && results.length === 0 && (
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
