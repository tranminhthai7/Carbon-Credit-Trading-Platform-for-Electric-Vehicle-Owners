import { useCallback, useEffect, useMemo, useState } from 'react';

export interface UseLocalStorageOptions<T> {
  key: string;
  defaultValue: T | (() => T);
  serializer?: (value: T) => string;
  parser?: (value: string) => T;
  sync?: boolean;
}

const isBrowser = typeof window !== 'undefined';

export function useLocalStorage<T>({
  key,
  defaultValue,
  serializer = JSON.stringify,
  parser = JSON.parse,
  sync = true,
}: UseLocalStorageOptions<T>) {
  const getDefaultValue = useCallback((): T => {
    return typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue;
  }, [defaultValue]);

  const readValue = useCallback((): T => {
    if (!isBrowser) {
      return getDefaultValue();
    }

    try {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue === null) {
        return getDefaultValue();
      }
      return parser(storedValue);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(`[useLocalStorage] Failed to parse value for key "${key}".`, error);
      }
      return getDefaultValue();
    }
  }, [getDefaultValue, key, parser]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const newValue = typeof value === 'function' ? (value as (prevValue: T) => T)(prev) : value;

        if (isBrowser) {
          try {
            window.localStorage.setItem(key, serializer(newValue));
          } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
              // eslint-disable-next-line no-console
              console.warn(`[useLocalStorage] Failed to save value for key "${key}".`, error);
            }
          }
        }

        return newValue;
      });
    },
    [key, serializer],
  );

  const removeValue = useCallback(() => {
    if (!isBrowser) {
      return;
    }
    try {
      window.localStorage.removeItem(key);
      setStoredValue(getDefaultValue());
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(`[useLocalStorage] Failed to remove value for key "${key}".`, error);
      }
    }
  }, [getDefaultValue, key]);

  useEffect(() => {
    if (!sync || !isBrowser) {
      return;
    }

    const handler = (event: StorageEvent) => {
      if (event.key !== key || event.storageArea !== window.localStorage) {
        return;
      }
      setStoredValue(event.newValue === null ? getDefaultValue() : parser(event.newValue));
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [getDefaultValue, key, parser, sync]);

  return useMemo(
    () => ({
      value: storedValue,
      setValue,
      removeValue,
    }),
    [removeValue, setValue, storedValue],
  );
}

export default useLocalStorage;

