import { useState, useCallback, useRef } from 'react';
import type { DictionaryEntry } from '../types';

const cache = new Map<string, DictionaryEntry[] | null>();

export function useDictionary() {
  const [entry, setEntry] = useState<DictionaryEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const lookup = useCallback(async (word: string) => {
    const key = word.toLowerCase();

    if (cache.has(key)) {
      setEntry(cache.get(key) ?? null);
      setError(cache.get(key) === null ? 'No definition found.' : null);
      setLoading(false);
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setEntry(null);

    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`,
        { signal: abortRef.current.signal }
      );

      if (!res.ok) {
        cache.set(key, null);
        setError('No definition found.');
        setEntry(null);
      } else {
        const data: DictionaryEntry[] = await res.json();
        cache.set(key, data);
        setEntry(data);
        setError(null);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError('Failed to fetch definition.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setEntry(null);
    setError(null);
    setLoading(false);
  }, []);

  return { entry, loading, error, lookup, clear };
}
