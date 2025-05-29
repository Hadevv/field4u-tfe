import { useEffect, useState } from "react";

/**
 * hook pour différer la mise à jour d'une valeur
 * utile pour limiter les appels API lors des recherches
 * @param value valeur à différer
 * @param delay délai en ms
 * @returns valeur différée
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // définir un timer pour mettre à jour la valeur après le délai
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // nettoyer le timer si la valeur change avant le délai
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
