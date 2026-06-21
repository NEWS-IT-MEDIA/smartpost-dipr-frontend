import { useEffect, useState } from "react";

/**
 * Prototype helper: shows a brief loading phase on mount so skeleton/loading
 * states are exercised. In production this is replaced by real fetch state.
 */
export function useSimulatedLoad(ms = 500): boolean {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(id);
  }, [ms]);
  return loading;
}
