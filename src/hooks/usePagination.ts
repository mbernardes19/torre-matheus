import { useCallback } from "react";
import type { SearchOpportunitiesResponse } from "@/src/services";

export interface UsePaginationProps {
  results: SearchOpportunitiesResponse | null;
  onPageChange: (type: "next" | "previous", cursor: string | null) => void;
}

export interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  pageSize: number;
  nextPage: () => void;
  previousPage: () => void;
}

export function usePagination({
  results,
  onPageChange,
}: UsePaginationProps): UsePaginationReturn {
  const pageSize = results?.size || 20;
  const total = results?.total || 0;
  const currentPage = results?.offset
    ? Math.floor(results.offset / pageSize) + 1
    : 1;
  const totalPages = Math.ceil(total / pageSize);

  const canGoNext =
    results?.pagination?.next !== null &&
    results?.pagination?.next !== undefined;
  const canGoPrevious =
    results?.pagination?.previous !== null &&
    results?.pagination?.previous !== undefined;

  const nextPage = useCallback(() => {
    if (canGoNext && results?.pagination?.next) {
      onPageChange("next", results.pagination.next);
    }
  }, [canGoNext, results, onPageChange]);

  const previousPage = useCallback(() => {
    if (canGoPrevious && results?.pagination?.previous) {
      onPageChange("previous", results.pagination.previous);
    }
  }, [canGoPrevious, results, onPageChange]);

  return {
    currentPage,
    totalPages,
    canGoNext,
    canGoPrevious,
    pageSize,
    nextPage,
    previousPage,
  };
}
