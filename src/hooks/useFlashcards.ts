import { useState, useEffect, useCallback } from 'react';
import type { Flashcard } from '../types';

const STORAGE_KEY = 'english-flashcards';

export function useFlashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flashcards));
  }, [flashcards]);

  const addFlashcard = useCallback((card: Omit<Flashcard, 'addedAt' | 'status'>) => {
    setFlashcards(prev => {
      const exists = prev.find(f => f.word.toLowerCase() === card.word.toLowerCase());
      if (exists) return prev;
      return [...prev, { ...card, addedAt: Date.now(), status: 'new' }];
    });
  }, []);

  const removeFlashcard = useCallback((word: string) => {
    setFlashcards(prev => prev.filter(f => f.word.toLowerCase() !== word.toLowerCase()));
  }, []);

  const updateStatus = useCallback((word: string, status: Flashcard['status']) => {
    setFlashcards(prev =>
      prev.map(f =>
        f.word.toLowerCase() === word.toLowerCase() ? { ...f, status } : f
      )
    );
  }, []);

  const isInFlashcards = useCallback(
    (word: string) => flashcards.some(f => f.word.toLowerCase() === word.toLowerCase()),
    [flashcards]
  );

  const flashcardWords = new Set(flashcards.map(f => f.word.toLowerCase()));

  return { flashcards, addFlashcard, removeFlashcard, updateStatus, isInFlashcards, flashcardWords };
}
