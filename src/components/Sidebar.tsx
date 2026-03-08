import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getArticlesForDate, getRecentDates } from '../data/articles';

interface SidebarProps {
  flashcardCount: number;
  isOpen: boolean;
  onClose: () => void;
  selectedArticleId: string;
  selectedDate: Date;
  onSelectArticle: (articleId: string, date: Date) => void;
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function formatDateLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (isSameDay(date, today)) return `${monthDay} · Today`;
  if (isSameDay(date, yesterday)) return `${monthDay} · Yesterday`;
  return monthDay;
}

export function Sidebar({
  flashcardCount,
  isOpen,
  onClose,
  selectedArticleId,
  selectedDate,
  onSelectArticle,
}: SidebarProps) {
  const recentDates = getRecentDates(7);

  const [expandedDates, setExpandedDates] = useState<Set<string>>(() => {
    return new Set([dateKey(new Date())]);
  });

  function toggleDate(date: Date) {
    const key = dateKey(date);
    setExpandedDates(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen z-50
          md:static md:h-auto md:min-h-screen
          w-64 flex-shrink-0 bg-gray-900 flex flex-col
          transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-white text-xl leading-none"
          aria-label="Close menu"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">ReadWell</h1>
              <p className="text-gray-500 text-xs">English Learning</p>
            </div>
          </div>
        </div>

        {/* Date accordion list */}
        <nav className="flex-1 overflow-y-auto py-2">
          {recentDates.map(date => {
            const key = dateKey(date);
            const isExpanded = expandedDates.has(key);
            const isSelectedDate = isSameDay(date, selectedDate);
            const articlesForDate = getArticlesForDate(date);

            return (
              <div key={key}>
                {/* Date header button */}
                <button
                  onClick={() => toggleDate(date)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors
                    ${isSelectedDate ? 'text-indigo-300' : 'text-gray-400 hover:text-white'}`}
                >
                  <span className="font-medium">{formatDateLabel(date)}</span>
                  <span className="text-xs opacity-60">{isExpanded ? '▾' : '▸'}</span>
                </button>

                {/* Article list */}
                {isExpanded && (
                  <div className="pb-1">
                    {articlesForDate.map(article => {
                      const isSelected = article.id === selectedArticleId && isSelectedDate;
                      return (
                        <button
                          key={article.id}
                          onClick={() => onSelectArticle(article.id, date)}
                          className={`w-full text-left px-3 py-2 flex items-start gap-2 transition-colors
                            ${isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                        >
                          <span className={`flex-shrink-0 mt-0.5 text-xs px-1.5 py-0.5 rounded font-semibold
                            ${isSelected
                              ? 'bg-indigo-500 text-indigo-100'
                              : 'bg-gray-700 text-gray-400'
                            }`}>
                            {article.level}
                          </span>
                          <span className="text-xs leading-relaxed line-clamp-2">
                            {article.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Flashcards link */}
        <div className="border-t border-gray-800 p-3">
          <NavLink
            to="/flashcards"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }
          >
            <span className="text-base">🗂️</span>
            Flashcards
            {flashcardCount > 0 && (
              <span className="ml-auto bg-indigo-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {flashcardCount}
              </span>
            )}
          </NavLink>
        </div>
      </aside>
    </>
  );
}
