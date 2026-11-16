import { useCallback, useEffect, useState } from "react";

const KEY = "hope:pending-letter";
const TTL_MS = 48 * 60 * 60 * 1000;

export type PendingLetter = { id: string; submittedAt: number };

function read(): PendingLetter | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as PendingLetter;
    if (typeof p.id !== "string" || typeof p.submittedAt !== "number")
      return null;
    if (Date.now() - p.submittedAt > TTL_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return p;
  } catch {
    return null;
  }
}

export function usePendingLetter() {
  const [pending, setPending] = useState<PendingLetter | null>(read);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === KEY || event.key === null) setPending(read());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const mark = useCallback((id: string) => {
    const p = { id, submittedAt: Date.now() };
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch {
      /* storage unavailable: in-memory only */
    }
    setPending(p);
  }, []);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setPending(null);
  }, []);

  return { pending, mark, clear };
}
