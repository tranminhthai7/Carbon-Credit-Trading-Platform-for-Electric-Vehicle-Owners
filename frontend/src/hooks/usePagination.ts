import { useCallback, useMemo, useState } from 'react';

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
  pageSizeOptions?: number[];
}

export interface UsePaginationResult {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  pageSizeOptions: number[];
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setTotalItems: (total: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  reset: () => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  totalItems: initialTotal = 0,
  pageSizeOptions = [5, 10, 20, 50],
}: UsePaginationOptions = {}): UsePaginationResult {
  const [page, setPageState] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(initialTotal);

  const totalPages = useMemo(() => {
    if (pageSize <= 0) {
      return 0;
    }
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }, [pageSize, totalItems]);

  const safeSetPage = useCallback(
    (value: number) => {
      setPageState((prev) => {
        const upperBound = totalPages > 0 ? totalPages : 1;
        const next = clamp(value, 1, upperBound);
        return prev === next ? prev : next;
      });
    },
    [totalPages],
  );

  const safeSetPageSize = useCallback(
    (value: number) => {
      setPageSizeState(value);
      setPageState(1);
    },
    [],
  );

  const nextPage = useCallback(() => {
    safeSetPage(page + 1);
  }, [page, safeSetPage]);

  const previousPage = useCallback(() => {
    safeSetPage(page - 1);
  }, [page, safeSetPage]);

  const reset = useCallback(() => {
    setPageState(initialPage);
    setPageSizeState(initialPageSize);
    setTotalItems(initialTotal);
  }, [initialPage, initialPageSize, initialTotal]);

  return useMemo<UsePaginationResult>(
    () => ({
      page,
      pageSize,
      totalItems,
      totalPages,
      isFirstPage: page <= 1,
      isLastPage: page >= totalPages,
      pageSizeOptions,
      setPage: safeSetPage,
      setPageSize: safeSetPageSize,
      setTotalItems,
      nextPage,
      previousPage,
      reset,
    }),
    [
      nextPage,
      page,
      pageSize,
      pageSizeOptions,
      previousPage,
      reset,
      safeSetPage,
      safeSetPageSize,
      setTotalItems,
      totalItems,
      totalPages,
    ],
  );
}

export default usePagination;

