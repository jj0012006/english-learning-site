import { getArticlesForDate } from '../data/articles';
import { ArticleReader } from '../components/ArticleReader';
import type { Flashcard } from '../types';

interface ArticlesPageProps {
  selectedDate: Date;
  selectedArticleId: string;
  flashcardWords: Set<string>;
  isInFlashcards: (word: string) => boolean;
  onAddFlashcard: (card: Omit<Flashcard, 'addedAt' | 'status'>) => void;
  onRemoveFlashcard: (word: string) => void;
}

export function ArticlesPage({
  selectedDate,
  selectedArticleId,
  flashcardWords,
  isInFlashcards,
  onAddFlashcard,
  onRemoveFlashcard,
}: ArticlesPageProps) {
  const articles = getArticlesForDate(selectedDate);
  const article = articles.find(a => a.id === selectedArticleId);

  if (!article) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        <div className="text-center">
          <p className="text-5xl mb-4">📖</p>
          <p className="text-lg">Select an article from the sidebar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-auto px-4 md:px-8 pt-16 md:pt-8 pb-8 max-w-3xl w-full">
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
