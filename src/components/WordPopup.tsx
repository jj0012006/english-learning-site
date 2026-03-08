import { useEffect, useRef } from 'react';
import type { DictionaryEntry, Flashcard } from '../types';

interface WordPopupProps {
  word: string;
  x: number;
  y: number;
  entry: DictionaryEntry[] | null;
  loading: boolean;
  error: string | null;
  isInFlashcards: boolean;
  onAddFlashcard: (card: Omit<Flashcard, 'addedAt' | 'status'>) => void;
  onRemoveFlashcard: (word: string) => void;
  onClose: () => void;
}

export function WordPopup({
  word,
  x,
  y,
  entry,
  loading,
  error,
  isInFlashcards,
  onAddFlashcard,
  onRemoveFlashcard,
  onClose,
}: WordPopupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  // Desktop positioning: keep popup within viewport
  let left = 0;
  let top = 0;
  if (!isMobile) {
    const POPUP_W = 320;
    const POPUP_H = 300;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    left = x + 8;
    top = y + 8;
    if (left + POPUP_W > vw - 8) left = x - POPUP_W - 8;
    if (top + POPUP_H > vh - 8) top = y - POPUP_H - 8;
    if (left < 8) left = 8;
    if (top < 8) top = 8;
  }

  const firstEntry = entry?.[0];
  const phonetic =
    firstEntry?.phonetic ||
    firstEntry?.phonetics?.find(p => p.text)?.text;
  const firstMeaning = firstEntry?.meanings?.[0];
  const firstDef = firstMeaning?.definitions?.[0];

  function handleFlashcard() {
    if (isInFlashcards) {
      onRemoveFlashcard(word);
    } else if (firstDef) {
      onAddFlashcard({
        word,
        phonetic,
        partOfSpeech: firstMeaning?.partOfSpeech,
        definition: firstDef.definition,
        example: firstDef.example,
      });
    }
  }

  return (
    <div
      ref={ref}
      className={
        isMobile
          ? 'fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl border border-gray-100 overflow-hidden'
          : 'fixed z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden'
      }
      style={isMobile ? {} : { left, top }}
    >
      {/* Header */}
      <div className="bg-indigo-600 px-4 py-3 flex items-start justify-between">
        <div>
          <h3 className="text-white font-bold text-lg leading-tight">{word}</h3>
          {phonetic && (
            <p className="text-indigo-200 text-sm mt-0.5">{phonetic}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-indigo-300 hover:text-white ml-2 mt-0.5 text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        {loading && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
            Looking up definition…
          </div>
        )}

        {error && !loading && (
          <p className="text-gray-400 text-sm italic">{error}</p>
        )}

        {!loading && !error && firstMeaning && (
          <div className="space-y-2">
            <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
              {firstMeaning.partOfSpeech}
            </span>
            <p className="text-gray-800 text-sm leading-relaxed">
              {firstDef?.definition}
            </p>
            {firstDef?.definitionZh && (
              <p className="text-gray-400 text-xs leading-relaxed">
                {firstDef.definitionZh}
              </p>
            )}
            {firstDef?.example && (
              <p className="text-gray-500 text-sm italic border-l-2 border-indigo-200 pl-3">
                "{firstDef.example}"
              </p>
            )}
            {entry && entry.length > 0 && firstEntry?.meanings && firstEntry.meanings.length > 1 && (
              <p className="text-xs text-gray-400">
                +{firstEntry.meanings.length - 1} more meaning{firstEntry.meanings.length > 2 ? 's' : ''}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {!loading && (firstDef || isInFlashcards) && (
        <div className="px-4 pb-4">
          <button
            onClick={handleFlashcard}
            className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              isInFlashcards
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isInFlashcards ? '✓ Remove from Flashcards' : '+ Add to Flashcards'}
          </button>
        </div>
      )}
    </div>
  );
}
