import { useState, useEffect, useCallback } from "react";
import {
  localStorageDefaultValues,
  LocalStorageHelper,
  localStorageListenerMap,
} from "../helpers/localStorageHelper";
import type { LocalStorageKeys } from "../helpers/localStorageHelper";

const isSSR = () => window === undefined;

type Setter<T> = (value: T | ((val: T) => T)) => void;
type UseSharedLocalStorageReturn<T> = readonly [T, Setter<T>];

function useSharedLocalStorage<T>(
  key: LocalStorageKeys
): UseSharedLocalStorageReturn<T> {
  const readValue = useCallback((): T => {
    return LocalStorageHelper.get<T>(key);
  }, [key]);

  const [, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback<Setter<T>>(
    (value) => {
      if (isSSR()) return;
      try {
        const oldValue = readValue();
        const newValue =
          // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
          typeof value === "function" ? (value as Function)(oldValue) : value;

        LocalStorageHelper.set(key, newValue);
        setStoredValue(newValue);

        localStorageListenerMap
          .get(key)
          ?.forEach((listener) => listener(newValue));
      } catch (error) {
        console.warn(`useSharedLocalStorage: failed to set "${key}"`, error);
      }
    },
    [key, readValue]
  );

  useEffect(() => {
    if (isSSR()) return;

    const listeners = localStorageListenerMap.get(key) || new Set();

    listeners.add(setStoredValue);
    localStorageListenerMap.set(key, listeners);

    return () => {
      listeners.delete(setStoredValue);

      if (listeners.size === 0) localStorageListenerMap.delete(key);
    };
  }, [key]);

  useEffect(() => {
    if (isSSR()) return;

    const onStorage = (event: StorageEvent) => {
      if (event.key === key) {
        const newValue = event.newValue
          ? JSON.parse(event.newValue)
          : localStorageDefaultValues[key];

        setStoredValue(newValue);
      }
    };

    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  return [LocalStorageHelper.get<T>(key), setValue] as const;
}

export default useSharedLocalStorage;
