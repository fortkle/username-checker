/**
 * プラットフォームの状態を表す型
 */
export type PlatformStatus = 'available' | 'unavailable' | 'error' | 'checking';

/**
 * プラットフォーム情報の型
 */
export interface Platform {
  id: string;
  name: string;
  url: string;
  icon: string;
}

/**
 * プラットフォームのチェック結果
 */
export interface PlatformResult {
  platform: Platform;
  status: PlatformStatus;
  message?: string;
}

/**
 * APIレスポンスの型
 */
export interface CheckResponse {
  username: string;
  results: PlatformResult[];
  timestamp: number;
}
