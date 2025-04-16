import { CheckResponse, PlatformResult, PlatformStatus } from '../types';
import { platforms } from './platformsData';

/**
 * ランダムなプラットフォームステータスを生成する
 * モック用にランダムな結果を返す
 */
const _getRandomStatus = (): PlatformStatus => {
  const statuses: PlatformStatus[] = ['available', 'unavailable', 'error'];
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex];
};

/**
 * 指定されたユーザー名に基づいた決定論的な結果を生成する
 * 同じユーザー名に対しては常に同じ結果を返す
 */
const getDeterministicStatus = (platformId: string, username: string): PlatformStatus => {
  // ユーザー名とプラットフォームIDを元にハッシュ値を生成
  let hash = 0;
  const str = platformId + username;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // 32bitに変換
  }

  // ハッシュ値をステータスに変換
  // 0: available, 1: unavailable, 2: error
  const statusIndex = Math.abs(hash % 3);
  const statuses: PlatformStatus[] = ['available', 'unavailable', 'error'];
  return statuses[statusIndex];
};

/**
 * モックAPI関数: ユーザー名が利用可能かどうかを確認
 * @param username チェックするユーザー名
 * @returns チェック結果のPromise
 */
export async function checkUsername(username: string): Promise<CheckResponse> {
  // 非同期処理を模倣するため、遅延を設ける
  return new Promise((resolve) => {
    setTimeout(() => {
      const results: PlatformResult[] = platforms.map((platform) => {
        const status = getDeterministicStatus(platform.id, username);
        let message;
        
        if (status === 'error') {
          message = 'サーバーエラーが発生しました';
        }
        
        return {
          platform,
          status,
          message,
        };
      });

      resolve({
        username,
        results,
        timestamp: Date.now(),
      });
    }, 1500); // 1.5秒の遅延
  });
} 