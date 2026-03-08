import { useState } from 'react';
import { getDailyArticles } from '../data/articles';
import { ArticleReader } from '../components/ArticleReader';
import type { Flashcard } from '../types';

interface ArticlesPageProps {
  flashcardWords: Set<string>;
  isInFlashcards: (word: string) => boolean;
  onAddFlashcard: (card: Omit<Flashcard, 'addedAt' | 'status'>) => void;
  onRemoveFlashcard: (word: string) => void;
}

const dailyArticles = getDailyArticles();

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export function ArticlesPage({
  flashcardWords,
  isInFlashcards,
  onAddFlashcard,
  onRemoveFlashcard,
}: ArticlesPageProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const article = dailyArticles[selectedIdx];

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="px-8 pt-8 pb-4">
        <p className="text-sm text-gray-400 mb-1">{today}</p>
        <h2 className="text-2xl font-bold text-gray-900">Today's Reading</h2>
        <p className="text-gray-500 text-sm mt-1">3 curated articles, refreshed daily</p>
      </div>

      {/* Article tabs */}
      <div className="px-8 border-b border-gray-200">
        <div className="flex gap-1">
          {dailyArticles.map((a, i) => (
            <button
              key={a.id}
              onClick={() => setSelectedIdx(i)}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                i === selectedIdx
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {i + 1}. {a.title.length > 28 ? a.title.slice(0, 28) + '…' : a.title}
            </button>
          ))}
        </div>
      </div>

      {/* Article content */}
      <div className="flex-1 overflow-y-auto px-8 py-8 max-w-3xl">
        <ArticleReader
          article={article}
          flashcardWords={flashcardWords}
          isInFlashcards={isInFlashcards}
          onAddFlashcard={onAddFlashcard}
          onRemoveFlashcard={onRemoveFlashcard}
        />
      </div>
    </div>
  );
}
