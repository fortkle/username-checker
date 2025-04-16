import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { checkUsername } from '../mocks/api';
import { CheckResponse, PlatformResult } from '../types';
import { platforms } from '../mocks/platformsData';

export function useUsernameCheck() {
  const [username, setUsername] = useState<string>('');

  // ローディング中のプレースホルダー結果を作成する関数
  const createLoadingResults = (): PlatformResult[] => {
    return platforms.map((platform) => ({
      platform,
      status: 'checking',
    }));
  };

  // TanStack Queryを使用してユーザー名チェックの状態を管理
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    refetch: _refetch,
  } = useQuery<CheckResponse, Error>(['usernameCheck', username], () => checkUsername(username), {
    // ユーザー名が空の場合はクエリを実行しない
    enabled: !!username,
    // 表示が唐突に変わるのを防ぐため、古いデータを表示し続ける
    keepPreviousData: true,
  });

  // ユーザー名チェックを実行する関数
  const checkUserAvailability = (newUsername: string) => {
    setUsername(newUsername);
  };

  // 現在の結果を計算（ローディング中またはデータがある場合）
  const currentResults = isFetching ? createLoadingResults() : data?.results || null;

  return {
    username,
    results: currentResults,
    isLoading,
    isFetching,
    isError,
    error,
    checkUserAvailability,
  };
}
