import { NavLink } from 'react-router-dom';

interface SidebarProps {
  flashcardCount: number;
}

export function Sidebar({ flashcardCount }: SidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-900 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">ReadWell</h1>
            <p className="text-gray-500 text-xs">English Learning</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`
          }
        >
          <span className="text-base">📰</span>
          Daily Articles
        </NavLink>

        <NavLink
          to="/flashcards"
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
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-800">
        <p className="text-gray-600 text-xs leading-relaxed">
          Click any word while reading to look it up and add to flashcards.
        </p>
      </div>
    </aside>
  );
}
