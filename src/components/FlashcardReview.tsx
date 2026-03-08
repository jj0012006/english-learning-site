import { useState } from 'react';
import type { Flashcard } from '../types';

interface FlashcardReviewProps {
  flashcards: Flashcard[];
  onUpdateStatus: (word: string, status: Flashcard['status']) => void;
  onRemove: (word: string) => void;
}

export function FlashcardReview({ flashcards, onUpdateStatus, onRemove }: FlashcardReviewProps) {
  const reviewQueue = flashcards.filter(f => f.status !== 'known');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No flashcards yet</h3>
        <p className="text-gray-400">
          Click any word while reading an article to add it to your flashcard deck.
        </p>
      </div>
    );
  }

  if (reviewQueue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">All caught up!</h3>
        <p className="text-gray-400 mb-6">You've marked all cards as known.</p>
        <button
          onClick={() => {
            flashcards.forEach(f => onUpdateStatus(f.word, 'new'));
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
        >
          Reset All Cards
        </button>
      </div>
    );
  }

  const card = reviewQueue[Math.min(currentIdx, reviewQueue.length - 1)];

  function nextCard() {
    setFlipped(false);
    setCurrentIdx(prev => (prev + 1) % reviewQueue.length);
  }

  function handleKnown() {
    onUpdateStatus(card.word, 'known');
    setFlipped(false);
    if (currentIdx >= reviewQueue.length - 1) setCurrentIdx(0);
  }

  function handleReview() {
    onUpdateStatus(card.word, 'review');
    nextCard();
  }

  const knownCount = flashcards.filter(f => f.status === 'known').length;

  return (
    <div>
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-1.5">
          <span>{knownCount} of {flashcards.length} known</span>
          <span>{reviewQueue.length} to review</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(knownCount / flashcards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        className="relative w-full cursor-pointer select-none"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped(f => !f)}
      >
        <div
          className="relative transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center min-h-[200px] flex flex-col items-center justify-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-4xl font-bold text-gray-900 mb-3">{card.word}</p>
            <p className="text-gray-400 text-sm">Tap to reveal</p>
            <span
              className={`mt-4 text-xs px-2 py-0.5 rounded-full ${
                card.status === 'review'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-indigo-50 text-indigo-600'
              }`}
            >
              {card.status === 'review' ? 'Review Again' : 'New'}
            </span>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-indigo-600 rounded-2xl shadow-lg p-8 text-center flex flex-col items-center justify-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {card.phonetic && (
              <p className="text-indigo-200 text-sm mb-2">{card.phonetic}</p>
            )}
            <p className="text-white text-xl font-bold mb-1">{card.word}</p>
            {card.partOfSpeech && (
              <span className="inline-block bg-indigo-500 text-indigo-100 text-xs px-2 py-0.5 rounded-full mb-3 uppercase tracking-wide">
                {card.partOfSpeech}
              </span>
            )}
            <p className="text-indigo-100 text-base leading-relaxed max-w-xs">{card.definition}</p>
            {card.example && (
              <p className="text-indigo-300 text-sm italic mt-3 border-t border-indigo-500 pt-3 max-w-xs">
                "{card.example}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions (shown after flip) */}
      <div className={`mt-6 transition-opacity duration-300 ${flipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex gap-3">
          <button
            onClick={e => { e.stopPropagation(); handleReview(); }}
            className="flex-1 py-3 bg-amber-50 text-amber-700 rounded-xl font-medium hover:bg-amber-100 transition-colors"
          >
            Review Again
          </button>
          <button
            onClick={e => { e.stopPropagation(); handleKnown(); }}
            className="flex-1 py-3 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100 transition-colors"
          >
            I Know This ✓
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => { setFlipped(false); setCurrentIdx(i => Math.max(0, i - 1)); }}
          disabled={currentIdx === 0}
          className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-30 px-3 py-1"
        >
          ← Previous
        </button>
        <span className="text-xs text-gray-400">
          {Math.min(currentIdx + 1, reviewQueue.length)} / {reviewQueue.length}
        </span>
        <button
          onClick={() => { setFlipped(false); setCurrentIdx(i => Math.min(reviewQueue.length - 1, i + 1)); }}
          disabled={currentIdx >= reviewQueue.length - 1}
          className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-30 px-3 py-1"
        >
          Next →
        </button>
      </div>

      {/* Word list */}
      <div className="mt-10">
        <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
          All Flashcards ({flashcards.length})
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {flashcards.map(fc => (
            <div
              key={fc.word}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                fc.status === 'known'
                  ? 'bg-green-50 text-green-700'
                  : fc.status === 'review'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-gray-50 text-gray-700'
              }`}
            >
              <span className="font-medium truncate">{fc.word}</span>
              <button
                onClick={() => onRemove(fc.word)}
                className="ml-2 text-gray-300 hover:text-red-400 text-base leading-none flex-shrink-0"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
