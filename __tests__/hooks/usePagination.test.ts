import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePagination } from "@/src/hooks/usePagination";
import type { SearchOpportunitiesResponse } from "@/src/services";

describe("usePagination", () => {
  const mockResults: SearchOpportunitiesResponse = {
    total: 100,
    offset: 0,
    size: 20,
    results: [],
    pagination: {
      previous: null,
      next: "next-page-token",
    },
  };

  it("should initialize with correct values", () => {
    const onPageChange = vi.fn();
    const { result } = renderHook(() =>
      usePagination({ results: mockResults, onPageChange })
    );

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.canGoNext).toBe(true);
    expect(result.current.canGoPrevious).toBe(false);
    expect(result.current.pageSize).toBe(20);
  });

  it("should handle next page with cursor", () => {
    const onPageChange = vi.fn();
    const { result } = renderHook(() =>
      usePagination({ results: mockResults, onPageChange })
    );

    act(() => {
      result.current.nextPage();
    });

    expect(onPageChange).toHaveBeenCalledWith("next-page-token");
  });

  it("should handle previous page with cursor", () => {
    const resultsOnPage2: SearchOpportunitiesResponse = {
      ...mockResults,
      offset: 20,
      pagination: {
        previous: "prev-page-token",
        next: "next-page-token",
      },
    };

    const onPageChange = vi.fn();
    const { result } = renderHook(() =>
      usePagination({ results: resultsOnPage2, onPageChange })
    );

    expect(result.current.currentPage).toBe(2);
    expect(result.current.canGoPrevious).toBe(true);

    act(() => {
      result.current.previousPage();
    });

    expect(onPageChange).toHaveBeenCalledWith("prev-page-token");
  });

  it("should not go to next page when canGoNext is false", () => {
    const resultsLastPage: SearchOpportunitiesResponse = {
      ...mockResults,
      pagination: {
        previous: "prev-page-token",
        next: null,
      },
    };

    const onPageChange = vi.fn();
    const { result } = renderHook(() =>
      usePagination({ results: resultsLastPage, onPageChange })
    );

    expect(result.current.canGoNext).toBe(false);

    act(() => {
      result.current.nextPage();
    });

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("should not go to previous page when canGoPrevious is false", () => {
    const onPageChange = vi.fn();
    const { result } = renderHook(() =>
      usePagination({ results: mockResults, onPageChange })
    );

    expect(result.current.canGoPrevious).toBe(false);

    act(() => {
      result.current.previousPage();
    });

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("should handle null results", () => {
    const onPageChange = vi.fn();
    const { result } = renderHook(() =>
      usePagination({ results: null, onPageChange })
    );

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.canGoNext).toBe(false);
    expect(result.current.canGoPrevious).toBe(false);
  });
});
