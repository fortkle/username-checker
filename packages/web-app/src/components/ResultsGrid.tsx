import { PlatformResult } from '../types';
import { PlatformCard } from './PlatformCard';

interface ResultsGridProps {
  results: PlatformResult[] | null;
  isLoading: boolean;
  error: Error | null;
}

export function ResultsGrid({ results, isLoading, error }: ResultsGridProps) {
  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        <p>エラーが発生しました: {error.message}</p>
      </div>
    );
  }

  if (isLoading && !results) {
    // 初回ローディング時のプレースホルダー
    return (
      <div className="w-full text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">プラットフォームを確認中...</p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-md text-gray-700">
        <p>チェックするユーザー名を入力してください</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">チェック結果</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result) => (
          <PlatformCard key={result.platform.id} result={result} />
        ))}
      </div>
    </div>
  );
}
