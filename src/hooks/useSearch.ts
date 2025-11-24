import { useState, useCallback, useEffect } from "react";
import { createTorreService } from "@/src/services";
import type {
  SearchOpportunitiesResponse,
  SearchOpportunitiesParams,
} from "@/src/services";

const torreService = createTorreService();

export interface UseSearchProps {
  initialSearchTerm?: string;
  debounceMs?: number;
}

export interface UseSearchReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  results: SearchOpportunitiesResponse | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  searchOpportunities: (
    term: string,
    cursor?: string | null,
    type?: "next" | "previous"
  ) => Promise<void>;
}

export function useSearch({
  initialSearchTerm = "",
  debounceMs = 300,
}: UseSearchProps = {}): UseSearchReturn {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [results, setResults] = useState<SearchOpportunitiesResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const updateURL = useCallback((term: string, cursor: string | null) => {
    const params = new URLSearchParams();
    if (term) {
      params.set("q", term);
    }
    if (cursor) {
      params.set("cursor", cursor);
    }
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : "/";
    //   router.replace(newUrl, { scroll: false });
    history.replaceState(null, "", newUrl);
  }, []);

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

        // Update URL with search term and cursor
        updateURL(term, cursor);
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
    [updateURL]
  );

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchOpportunities(searchTerm, null);
    }, debounceMs);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchOpportunities, debounceMs]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    isLoading,
    error,
    total,
    searchOpportunities,
  };
}
