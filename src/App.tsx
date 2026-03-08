import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { ArticlesPage } from './pages/ArticlesPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { useFlashcards } from './hooks/useFlashcards';

function App() {
  const { flashcards, addFlashcard, removeFlashcard, updateStatus, isInFlashcards, flashcardWords } =
    useFlashcards();

  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar flashcardCount={flashcards.length} />

        <main className="flex-1 bg-stone-50 overflow-hidden">
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
