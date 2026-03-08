import { useCallback, useState } from 'react';
import type { Article, Flashcard, WordPopupData } from '../types';
import { useDictionary } from '../hooks/useDictionary';
import { WordPopup } from './WordPopup';

interface ArticleReaderProps {
  article: Article;
  flashcardWords: Set<string>;
  isInFlashcards: (word: string) => boolean;
  onAddFlashcard: (card: Omit<Flashcard, 'addedAt' | 'status'>) => void;
  onRemoveFlashcard: (word: string) => void;
}

function tokenize(text: string): string[] {
  // Split on whitespace but keep newlines as separate tokens
  return text.split(/(\s+)/);
}

export function ArticleReader({
  article,
  flashcardWords,
  isInFlashcards,
  onAddFlashcard,
  onRemoveFlashcard,
}: ArticleReaderProps) {
  const [popup, setPopup] = useState<WordPopupData | null>(null);
  const { entry, loading, error, lookup, clear } = useDictionary();

  const handleWordClick = useCallback(
    (word: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const clean = word.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '');
      if (!clean || clean.length < 2) return;
      setPopup({ word: clean, x: e.clientX, y: e.clientY });
      lookup(clean);
    },
    [lookup]
  );

  const handleClose = useCallback(() => {
    setPopup(null);
    clear();
  }, [clear]);

  const paragraphs = article.text.split(/\n\n+/);

  const renderParagraph = (para: string, pIdx: number) => {
    const tokens = tokenize(para);
    return (
      <p key={pIdx} className="mb-5 leading-8 text-gray-800">
        {tokens.map((token, tIdx) => {
          // whitespace tokens: render as-is
          if (/^\s+$/.test(token)) return token;

          // Word token: may contain punctuation
          const clean = token.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '');
          const isWord = clean.length >= 2;
          const inFlashcard = isWord && flashcardWords.has(clean.toLowerCase());

          if (!isWord) return <span key={tIdx}>{token}</span>;

          const prefix = token.slice(0, token.indexOf(clean));
          const suffix = token.slice(token.indexOf(clean) + clean.length);

          return (
            <span key={tIdx}>
              {prefix}
              <span
                className={`word-token${inFlashcard ? ' in-flashcard' : ''}`}
                onClick={e => handleWordClick(clean, e)}
              >
                {clean}
              </span>
              {suffix}
            </span>
          );
        })}
      </p>
    );
  };

  return (
    <div className="relative">
      {/* Article header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              article.level === 'Advanced'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {article.level}
          </span>
          <span className="text-xs text-gray-400">{article.readTime}</span>
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-400">{article.source}</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 leading-snug mb-2">
          {article.title}
        </h2>
        <p className="text-gray-500 text-base italic">{article.excerpt}</p>
        <div className="mt-3 flex gap-1.5 flex-wrap">
          {article.tags.map(tag => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <hr className="border-gray-200 mb-6" />

      {/* Article body */}
      <div className="text-[17px]">
        {paragraphs.map((para, i) => renderParagraph(para.trim(), i))}
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center">
        Click any word to look it up · Underlined words are in your flashcards
      </p>

      {/* Word popup */}
      {popup && (
        <WordPopup
          word={popup.word}
          x={popup.x}
          y={popup.y}
          entry={entry}
          loading={loading}
          error={error}
          isInFlashcards={isInFlashcards(popup.word)}
          onAddFlashcard={onAddFlashcard}
          onRemoveFlashcard={onRemoveFlashcard}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
