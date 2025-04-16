import { Platform } from '../platforms/platforms.js';
import { logger } from '../utils/logger.js';

// チェック結果の型
export type CheckResult = {
  available: boolean;
  error?: string;
};

/**
 * URLテンプレート内のユーザー名プレースホルダーを置換する
 */
const replaceUsername = (template: string, username: string): string => {
  return template.replace('{username}', username);
};

/**
 * HTTPリクエストを送信してユーザー名の利用可否をチェックする
 */
export const checkHttp = async (platform: Platform, username: string): Promise<CheckResult> => {
  if (!platform.httpOptions) {
    return {
      available: false,
      error: 'HTTPオプションが設定されていません',
    };
  }

  const { urlTemplate, successStatusCodes, method, timeout } = platform.httpOptions;
  const url = replaceUsername(urlTemplate, username);

  try {
    logger.debug({ platform: platform.id, url, method }, 'HTTPリクエスト送信');

    // timeoutを含むAbortControllerを設定
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // フェッチオプションを設定
    const fetchOptions: RequestInit = {
      method,
      redirect: 'manual', // リダイレクトを手動で処理
      signal: controller.signal,
      headers: {
        'User-Agent': 'UsernameChecker/1.0',
      },
    };

    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    logger.debug({ platform: platform.id, url, statusCode: response.status }, 'HTTPレスポンス受信');

    // ステータスコードに基づいて利用可否を判定
    const available = successStatusCodes.includes(response.status);

    return {
      available,
    };
  } catch (error) {
    logger.error({ platform: platform.id, url, error }, 'HTTPリクエストエラー');

    let errorMessage = 'ネットワークエラーが発生しました';
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'リクエストがタイムアウトしました';
      } else {
        errorMessage = error.message;
      }
    }

    return {
      available: false,
      error: errorMessage,
    };
  }
};
