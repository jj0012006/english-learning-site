import { NavLink } from 'react-router-dom';

interface SidebarProps {
  flashcardCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ flashcardCount, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
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
            onClick={onClose}
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
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800">
          <p className="text-gray-600 text-xs leading-relaxed">
            Click any word while reading to look it up and add to flashcards.
          </p>
        </div>
      </aside>
    </>
  );
}
