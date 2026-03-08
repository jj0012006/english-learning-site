import type { Flashcard } from '../types';
import { FlashcardReview } from '../components/FlashcardReview';

interface FlashcardsPageProps {
  flashcards: Flashcard[];
  onUpdateStatus: (word: string, status: Flashcard['status']) => void;
  onRemove: (word: string) => void;
}

export function FlashcardsPage({ flashcards, onUpdateStatus, onRemove }: FlashcardsPageProps) {
  const knownCount = flashcards.filter(f => f.status === 'known').length;
  const reviewCount = flashcards.filter(f => f.status === 'review').length;
  const newCount = flashcards.filter(f => f.status === 'new').length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Flashcards</h2>
        <p className="text-gray-500 text-sm mt-1">
          Review the words you've collected from your reading
        </p>
      </div>

      {/* Stats */}
      {flashcards.length > 0 && (
        <div className="px-8 pb-4">
          <div className="flex gap-3">
            <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{flashcards.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">Total</p>
            </div>
            <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-green-600">{knownCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">Known</p>
            </div>
            <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-amber-600">{reviewCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">To Review</p>
            </div>
            <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-indigo-600">{newCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">New</p>
            </div>
          </div>
        </div>
      )}

      {/* Review */}
      <div className="flex-1 overflow-y-auto px-8 pb-8 max-w-xl">
        <FlashcardReview
          flashcards={flashcards}
          onUpdateStatus={onUpdateStatus}
          onRemove={onRemove}
        />
      </div>
    </div>
  );
}
