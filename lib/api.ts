"use client";

import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import type { Fragrance, FragrancesResponse, FiltersResponse, FragranceFilters } from "./types";

// ============================================================================
// Fetcher
// ============================================================================

const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
};

// ============================================================================
// Build Query String
// ============================================================================

function buildQueryString(filters: FragranceFilters): string {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.gender) params.set("gender", filters.gender);
  if (filters.priceRange) params.set("priceRange", filters.priceRange);
  if (filters.scentFamily) params.set("scentFamily", filters.scentFamily);
  if (filters.season) params.set("season", filters.season);
  if (filters.occasion) params.set("occasion", filters.occasion);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.note) params.set("note", filters.note);
  if (filters.minRating) params.set("minRating", filters.minRating.toString());
  if (filters.maxRating) params.set("maxRating", filters.maxRating.toString());
  if (filters.minYear) params.set("minYear", filters.minYear.toString());
  if (filters.maxYear) params.set("maxYear", filters.maxYear.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
  if (filters.limit) params.set("limit", filters.limit.toString());
  if (filters.offset) params.set("offset", filters.offset.toString());

  return params.toString();
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Fetch a paginated list of fragrances with filters
 */
export function useFragrances(filters: FragranceFilters = {}) {
  const queryString = buildQueryString(filters);
  const url = `/api/fragrances${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<FragrancesResponse>(url, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  return {
    fragrances: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

/**
 * Fetch fragrances with infinite scrolling
 */
export function useInfiniteFragrances(filters: FragranceFilters = {}, pageSize: number = 24) {
  const getKey = (pageIndex: number, previousPageData: FragrancesResponse | null) => {
    // Reached the end
    if (previousPageData && !previousPageData.pagination.hasMore) return null;

    const offset = pageIndex * pageSize;
    const queryString = buildQueryString({ ...filters, limit: pageSize, offset });
    return `/api/fragrances?${queryString}`;
  };

  const { data, error, isLoading, isValidating, size, setSize, mutate } = useSWRInfinite<FragrancesResponse>(
    getKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateFirstPage: false,
    }
  );

  const fragrances = data?.flatMap((page) => page.data) ?? [];
  const total = data?.[0]?.pagination.total ?? 0;
  const hasMore = data ? data[data.length - 1]?.pagination.hasMore : true;

  return {
    fragrances,
    total,
    hasMore,
    isLoading,
    isLoadingMore: isValidating && size > 1,
    loadMore: () => setSize(size + 1),
    size,
    error,
    mutate,
  };
}

/**
 * Fetch a single fragrance by ID
 */
export function useFragrance(id: number | null) {
  const { data, error, isLoading } = useSWR<Fragrance>(
    id ? `/api/fragrances/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    fragrance: data,
    isLoading,
    isError: !!error,
    error,
  };
}

/**
 * Fetch multiple fragrances by IDs (for favorites, comparison, etc.)
 */
export function useFragrancesByIds(ids: number[]) {
  // Fetch each fragrance individually and combine
  // This is fine for small lists (favorites, comparison)
  const results = ids.map((id) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSWR<Fragrance>(`/api/fragrances/${id}`, fetcher, {
      revalidateOnFocus: false,
    });
  });

  const fragrances = results
    .map((r) => r.data)
    .filter((f): f is Fragrance => f !== undefined);

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.error);

  return {
    fragrances,
    isLoading,
    isError,
  };
}

/**
 * Fetch filter options (brands, notes, etc.)
 */
export function useFilters() {
  const { data, error, isLoading } = useSWR<FiltersResponse>("/api/filters", fetcher, {
    revalidateOnFocus: false,
    // Filters don't change often, cache for longer
    dedupingInterval: 60000, // 1 minute
  });

  return {
    filters: data,
    isLoading,
    isError: !!error,
    error,
  };
}
