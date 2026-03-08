import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { ArticlesPage } from './pages/ArticlesPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { useFlashcards } from './hooks/useFlashcards';

function App() {
  const { flashcards, addFlashcard, removeFlashcard, updateStatus, isInFlashcards, flashcardWords } =
    useFlashcards();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar
          flashcardCount={flashcards.length}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 bg-stone-50 overflow-hidden min-w-0">
          {/* Hamburger button — mobile only */}
          <button
            className="md:hidden fixed top-4 left-4 z-30 p-2 bg-gray-900 text-white rounded-lg leading-none"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>

          <Routes>
            <Route
              path="/"
              element={
                <ArticlesPage
                  flashcardWords={flashcardWords}
                  isInFlashcards={isInFlashcards}
                  onAddFlashcard={addFlashcard}
                  onRemoveFlashcard={removeFlashcard}
                />
              }
            />
            <Route
              path="/flashcards"
              element={
                <FlashcardsPage
                  flashcards={flashcards}
                  onUpdateStatus={updateStatus}
                  onRemove={removeFlashcard}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
