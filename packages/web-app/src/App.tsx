import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Username Checker</h1>
        <p className="text-gray-600">複数のプラットフォームでユーザー名の利用可否を確認</p>
      </header>

      <main className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => setCount((count) => count + 1)}
          >
            カウント: {count}
          </button>
          <p className="mt-4 text-gray-700">
            このボタンをクリックして React が正常に動作していることを確認
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
