import { QueryClient } from '@tanstack/react-query';

// QueryClientの設定
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // ウィンドウフォーカス時の再取得を無効
      retry: 1, // エラー時のリトライは1回まで
      staleTime: 1000 * 60 * 5, // データが古くなるまでの時間: 5分
      cacheTime: 1000 * 60 * 30, // キャッシュの保持時間: 30分
    },
  },
});
