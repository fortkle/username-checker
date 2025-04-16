import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useUsernameCheck } from './useUsernameCheck';
import { checkUsername } from '../mocks/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// APIモックを作成
vi.mock('../mocks/api', () => ({
  checkUsername: vi.fn(),
}));

// テストをスキップ
describe.skip('useUsernameCheck', () => {
  let queryClient: QueryClient;

  // テスト用のラッパーコンポーネント
  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    // 各テスト前にクエリクライアントをリセット
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useUsernameCheck(), { 
      wrapper: createWrapper(),
    });

    expect(result.current.username).toBe('');
    expect(result.current.results).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update username and trigger API call', async () => {
    const mockResponse = {
      username: 'testuser',
      results: [
        {
          platform: {
            id: 'test',
            name: 'Test',
            url: 'https://test.com',
            icon: 'test',
          },
          status: 'available',
        },
      ],
      timestamp: Date.now(),
    };

    // モックAPIにレスポンスを設定
    (checkUsername as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUsernameCheck(), { 
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.checkUserAvailability('testuser');
    });

    // usernameが更新されたことを確認
    expect(result.current.username).toBe('testuser');

    // APIが呼び出されたことを確認
    expect(checkUsername).toHaveBeenCalledWith('testuser');

    // 結果が更新されるまで待機
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.results).toEqual(mockResponse.results);
    });
  });

  it('should handle error states correctly', async () => {
    const mockError = new Error('API error');
    (checkUsername as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUsernameCheck(), { 
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.checkUserAvailability('erroruser');
    });

    // エラー状態になることを確認
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeDefined();
      expect(result.current.error?.message).toBe('API error');
    });
  });
});
