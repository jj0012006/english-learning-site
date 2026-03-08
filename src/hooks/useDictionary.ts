import { useState, useCallback, useRef } from 'react';
import type { DictionaryEntry } from '../types';

const cache = new Map<string, DictionaryEntry[] | null>();
const zhCache = new Map<string, string | null>();

async function translateToZh(text: string): Promise<string | null> {
  const cacheKey = text.slice(0, 500);
  if (zhCache.has(cacheKey)) return zhCache.get(cacheKey) ?? null;

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh`
    );
    if (!res.ok) {
      zhCache.set(cacheKey, null);
      return null;
    }
    const data = await res.json();
    const translated: string | null = data.responseData?.translatedText ?? null;
    zhCache.set(cacheKey, translated);
    return translated;
  } catch {
    zhCache.set(cacheKey, null);
    return null;
  }
}

async function addChineseTranslations(data: DictionaryEntry[]): Promise<void> {
  const firstMeaning = data[0]?.meanings?.[0];
  if (!firstMeaning?.definitions?.length) return;

  const defsToTranslate = firstMeaning.definitions.slice(0, 3);
  const translations = await Promise.all(
    defsToTranslate.map(def => translateToZh(def.definition))
  );
  defsToTranslate.forEach((def, i) => {
    if (translations[i]) def.definitionZh = translations[i] ?? undefined;
  });
}

function extractAudioUrl(data: DictionaryEntry[]): string | null {
  const phonetics = data[0]?.phonetics ?? [];
  const withAudio = phonetics.find(p => p.audio && p.audio.length > 0);
  return withAudio?.audio ?? null;
}

export function useDictionary() {
  const [entry, setEntry] = useState<DictionaryEntry[] | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const lookup = useCallback(async (word: string) => {
    const key = word.toLowerCase();

    if (cache.has(key)) {
      const cached = cache.get(key) ?? null;
      setEntry(cached);
      setAudioUrl(cached ? extractAudioUrl(cached) : null);
      setError(cached === null ? 'No definition found.' : null);
      setLoading(false);
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setEntry(null);
    setAudioUrl(null);

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
        // Translate definitions to Chinese (silent fail)
        await addChineseTranslations(data).catch(() => {});
        cache.set(key, data);
        setEntry(data);
        setAudioUrl(extractAudioUrl(data));
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
    setAudioUrl(null);
    setError(null);
    setLoading(false);
  }, []);

  return { entry, audioUrl, loading, error, lookup, clear };
}
