// To update on each new key :
export type LocalStorageKeys = "intent-configuration";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const localStorageDefaultValues: Record<LocalStorageKeys, any> = {
  "intent-configuration": {},
};

export const localStorageListenerMap = new Map<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Set<(value: any) => void>
>();

const isSSR = () => typeof window === "undefined";

export class LocalStorageHelper {
  static set<T>(key: LocalStorageKeys, value: T): void {
    if (isSSR()) return;

    const newItem = JSON.stringify(value);
    localStorage.setItem(key, newItem);
    localStorageListenerMap.get(key)?.forEach((listener) => {
      listener(newItem);
    });
  }

  static get<T>(key: LocalStorageKeys): T {
    if (isSSR()) return localStorageDefaultValues[key];

    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : localStorageDefaultValues[key];
    } catch {
      return localStorageDefaultValues[key];
    }
  }

  static remove(key: LocalStorageKeys): void {
    if (isSSR()) return;
    localStorage.removeItem(key);
  }

  static has(key: LocalStorageKeys): boolean {
    if (isSSR()) return false;
    return localStorage.getItem(key) !== null;
  }
}
