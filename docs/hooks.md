# Custom Hooks

This document highlights the shared hooks introduced for issue [#52](https://github.com/tranminhthai7/Carbon-Credit-Trading-Platform-for-Electric-Vehicle-Owners/issues/52).

## `useApi`

- Wraps async functions and tracks `loading`, `error`, and `data`.
- Supports immediate execution, reusable default arguments, and lifecycle callbacks.

## `useLocalStorage`

- Persists state to `localStorage` with optional custom serialization.
- Synchronises state across browser tabs when `sync` is enabled.

## `useDebounce`

- Returns a debounced version of a value after the provided delay (default: 300 ms).
- Ideal for performing inexpensive updates from rapidly changing inputs.

## `usePagination`

- Manages pagination state (`page`, `pageSize`, totals) and exposes helpers to navigate between pages.
- Provides derived booleans (`isFirstPage`, `isLastPage`) and a configurable list of allowed page sizes.

## `useAuth` Enhancements

- Persists the authenticated user in `localStorage` via `useLocalStorage`.
- Exposes richer state: `isProcessing`, `error`, `refreshUser`, `clearError`, and `lastUpdatedAt`.
- Adds role helpers (`hasRole`, `hasAnyRole`) for fine-grained access control.

