import { Context, MiddlewareHandler } from 'hono';
import { logger } from '../utils/logger.js';

// エラーレスポンスの型
export type ErrorResponse = {
  error: string;
  message: string;
  code?: string;
  status: number;
};

// APIエラーの基本クラス
export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status = 500, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// 404エラー
export class NotFoundError extends ApiError {
  constructor(message = 'リソースが見つかりません') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

// バリデーションエラー
export class ValidationError extends ApiError {
  constructor(message = 'リクエストデータが不正です') {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

// サービス利用不可エラー
export class ServiceUnavailableError extends ApiError {
  constructor(message = '現在サービスが利用できません。しばらく経ってからお試しください') {
    super(message, 503, 'SERVICE_UNAVAILABLE');
    this.name = 'ServiceUnavailableError';
  }
}

// グローバルエラーハンドラーミドルウェア
export const errorHandler: MiddlewareHandler = async (c: Context, next) => {
  try {
    // 次のミドルウェアやハンドラーを実行
    await next();
  } catch (error) {
    // エラーの種類に基づいてレスポンスを生成
    if (error instanceof ApiError) {
      // APIエラーの場合は定義済みの処理
      logger.error(
        { error: error.name, message: error.message, code: error.code, status: error.status },
        'API Error'
      );

      const errorResponse: ErrorResponse = {
        error: error.name,
        message: error.message,
        code: error.code,
        status: error.status,
      };

      return c.json(errorResponse, error.status as 400 | 401 | 403 | 404 | 500 | 503);
    } else {
      // 未知のエラーの場合は汎用エラーを返す
      logger.error({ error }, '予期せぬエラーが発生しました');

      const errorResponse: ErrorResponse = {
        error: 'InternalServerError',
        message: '内部サーバーエラーが発生しました',
        status: 500,
      };

      return c.json(errorResponse, 500);
    }
  }
};
