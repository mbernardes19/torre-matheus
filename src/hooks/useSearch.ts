import { useState, useCallback, useEffect, useRef } from "react";
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
}: UseSearchProps = {}): UseSearchReturn {
  const isInitializedRef = useRef(false);
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

  // Initialize from URL parameters on mount
  useEffect(() => {
    if (!isInitializedRef.current && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlSearchTerm = params.get("q");
      const urlCursor = params.get("cursor");

      if (urlSearchTerm) {
        setSearchTerm(urlSearchTerm);
        // If there's a cursor, make the request immediately with it
        if (urlCursor) {
          searchOpportunities(urlSearchTerm, urlCursor);
        }
      }
      isInitializedRef.current = true;
    }
  }, [searchOpportunities]);

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
