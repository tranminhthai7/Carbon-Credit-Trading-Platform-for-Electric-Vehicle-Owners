import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface UseApiOptions<TArgs extends unknown[], TResult> {
  immediate?: boolean;
  defaultArgs?: TArgs;
  onSuccess?: (data: TResult, args: TArgs) => void;
  onError?: (error: unknown, args: TArgs) => void;
  onFinally?: (args: TArgs) => void;
}

export interface UseApiState<TResult> {
  data: TResult | null;
  loading: boolean;
  error: unknown;
}

export interface UseApiResult<TArgs extends unknown[], TResult> extends UseApiState<TResult> {
  execute: (...args: TArgs) => Promise<TResult | undefined>;
  reset: () => void;
  setData: (data: TResult | null) => void;
}

export function useApi<TArgs extends unknown[], TResult>(
  asyncFn: (...args: TArgs) => Promise<TResult>,
  { immediate = false, defaultArgs, onSuccess, onError, onFinally }: UseApiOptions<TArgs, TResult> = {},
): UseApiResult<TArgs, TResult> {
  const isMounted = useRef(true);
  const defaultArgsRef = useRef(defaultArgs);
  const [state, setState] = useState<UseApiState<TResult>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const setData = useCallback((data: TResult | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  const execute = useCallback(
    async (...args: TArgs) => {
      const effectiveArgs = (args.length ? args : defaultArgsRef.current) ?? ([] as unknown as TArgs);

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await asyncFn(...effectiveArgs);
        if (isMounted.current) {
          setState({ data: result, loading: false, error: null });
          onSuccess?.(result, effectiveArgs);
        }
        return result;
      } catch (error) {
        if (isMounted.current) {
          setState({ data: null, loading: false, error });
          onError?.(error, effectiveArgs);
        }
        return undefined;
      } finally {
        if (isMounted.current) {
          onFinally?.(effectiveArgs);
        }
      }
    },
    [asyncFn, onError, onFinally, onSuccess],
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  const result = useMemo<UseApiResult<TArgs, TResult>>(
    () => ({
      ...state,
      execute,
      reset,
      setData,
    }),
    [execute, reset, setData, state],
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!immediate) {
      return;
    }
    void execute(...((defaultArgsRef.current ?? []) as TArgs));
  }, [execute, immediate]);

  return result;
}

export default useApi;

