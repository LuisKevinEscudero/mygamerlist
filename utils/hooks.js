import { useState, useEffect } from "react";

/**
 * Retorna un valor "debounced" que solo se actualiza después de `delay` ms
 */
export function useDebouncedValue(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}
