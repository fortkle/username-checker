import { UsernameForm } from './components/UsernameForm';
import { ResultsGrid } from './components/ResultsGrid';
import { useUsernameCheck } from './hooks/useUsernameCheck';

function App() {
  const { results, isLoading, isFetching, isError, error, checkUserAvailability } =
    useUsernameCheck();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 bg-gray-50">
      <header className="text-center mb-8 mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Username Checker</h1>
        <p className="text-gray-600">複数のプラットフォームでユーザー名の利用可否を確認</p>
      </header>

      <main className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        <UsernameForm onSubmit={checkUserAvailability} isLoading={isFetching} />

        <ResultsGrid results={results} isLoading={isLoading} error={isError ? error : null} />
      </main>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>© 2023 Username Checker | 利用可能なプラットフォームを確認</p>
      </footer>
    </div>
  );
}

export default App;
