import { useState, useEffect, useCallback, useRef } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  // Use a ref to track if it's the initial mount to avoid overwriting localStorage with initialValue
  // if we strictly relied on the second useEffect. However, the logic below handles reading first.

  // 1. Initialize with initialValue for SSR safety
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // 2. Use a State to track if we have initialized from localStorage to avoid overwriting it
  const [initialized, setInitialized] = useState(false);

  // 3. Read from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
        setInitialized(true);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setInitialized(true);
    }
  }, [key]);

  // 4. Update localStorage when state changes, BUT only after we've initialized
  // This prevents the initial render (with "initialValue") from overwriting existing localStorage data
  // before we've had a chance to read it.
  useEffect(() => {
    if (!initialized) return;

    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, initialized]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const newValue = value instanceof Function ? value(prev) : value;
      return newValue;
    });
  }, []);

  return [storedValue, setValue];
}
