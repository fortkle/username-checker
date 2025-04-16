import { Hono } from 'hono';
import type { Context } from 'hono';
import { z } from 'zod';
import { logger } from '../utils/logger.js';
import { platforms } from '../platforms/platforms.js';
import { checkHttp } from '../checkers/http-checker.js';
import { checkDns } from '../checkers/dns-checker.js';
import { ValidationError, ServiceUnavailableError } from '../middlewares/error-handler.js';

// リクエストパラメータのスキーマ定義
const usernameParamSchema = z.object({
  username: z.string().min(1).max(50),
});

// プラットフォーム情報のスキーマ定義
const platformSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url(),
  icon: z.string(),
});

// ステータスのスキーマ定義
const statusSchema = z.enum(['available', 'unavailable', 'error', 'checking']);

// プラットフォームチェック結果のスキーマ定義
const platformResultSchema = z.object({
  platform: platformSchema,
  status: statusSchema,
  message: z.string().optional(),
});

// レスポンススキーマの定義
const usernameCheckResponseSchema = z.object({
  username: z.string(),
  results: z.array(platformResultSchema),
  timestamp: z.number(),
});

// 型の推論
type UsernameCheckResponse = z.infer<typeof usernameCheckResponseSchema>;
type PlatformResult = z.infer<typeof platformResultSchema>;

// ユーザー名チェックルーター
export const usernameCheckRouter = new Hono();

// ユーザー名チェックエンドポイント
usernameCheckRouter.get('/:username', async (c: Context) => {
  const { username } = c.req.param();

  logger.info({ username }, 'Username check requested');

  // パラメータのバリデーション
  try {
    usernameParamSchema.parse({ username });
  } catch (error) {
    logger.warn({ username, error }, 'Invalid username parameter');
    throw new ValidationError('ユーザー名が無効です。1〜50文字の範囲で指定してください。');
  }

  try {
    // 各プラットフォームでのチェックを並行実行
    const checkPromises = platforms.map(async (platform) => {
      try {
        let checkResult;

        // チェックメソッドに基づいて適切なチェッカーを呼び出す
        if (platform.checkMethod === 'http') {
          checkResult = await checkHttp(platform, username);
        } else if (platform.checkMethod === 'dns') {
          checkResult = await checkDns(platform, username);
        } else {
          // 未対応のチェックメソッド
          return {
            platform: {
              id: platform.id,
              name: platform.name,
              url: platform.url,
              icon: platform.icon,
            },
            status: 'error' as const,
            message: '未対応のチェックメソッドです',
          };
        }

        // 結果をAPI応答形式に変換
        return {
          platform: {
            id: platform.id,
            name: platform.name,
            url: platform.url,
            icon: platform.icon,
          },
          status: checkResult.available ? 'available' : 'unavailable',
          message: checkResult.error,
        } as PlatformResult;
      } catch (error) {
        // チェック中の予期せぬエラー
        logger.error({ platform: platform.id, username, error }, 'Check error');
        return {
          platform: {
            id: platform.id,
            name: platform.name,
            url: platform.url,
            icon: platform.icon,
          },
          status: 'error' as const,
          message: error instanceof Error ? error.message : '予期せぬエラーが発生しました',
        };
      }
    });

    // 全てのチェック結果を待機
    const results = await Promise.all(checkPromises);

    // 全てのプラットフォームでエラーが発生した場合は
    // サービス利用不可エラーをスロー
    const allErrors = results.every((result) => result.status === 'error');
    if (allErrors) {
      throw new ServiceUnavailableError(
        '全てのプラットフォームチェックでエラーが発生しました。しばらく経ってから再度お試しください。'
      );
    }

    // レスポンスの作成
    const response: UsernameCheckResponse = {
      username,
      results,
      timestamp: Date.now(),
    };

    return c.json(response);
  } catch (error) {
    // エラーハンドラーミドルウェアに処理を委譲するため、
    // APIエラーでない場合は再スロー
    if (error instanceof Error) {
      logger.error({ username, error }, 'Username check error');
      throw error;
    } else {
      throw new Error('予期せぬエラーが発生しました');
    }
  }
});
