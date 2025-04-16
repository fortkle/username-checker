import { describe, it, expect, vi } from 'vitest';
import {
  ApiError,
  NotFoundError,
  ValidationError,
  ServiceUnavailableError,
  errorHandler,
} from './error-handler';
import type { Context } from 'hono';

describe('API Error Classes', () => {
  it('should create ApiError with default values', () => {
    const error = new ApiError('テストエラー');
    expect(error.name).toBe('ApiError');
    expect(error.message).toBe('テストエラー');
    expect(error.status).toBe(500);
    expect(error.code).toBeUndefined();
  });

  it('should create ApiError with custom values', () => {
    const error = new ApiError('テストエラー', 400, 'TEST_ERROR');
    expect(error.name).toBe('ApiError');
    expect(error.message).toBe('テストエラー');
    expect(error.status).toBe(400);
    expect(error.code).toBe('TEST_ERROR');
  });

  it('should create NotFoundError', () => {
    const error = new NotFoundError();
    expect(error.name).toBe('NotFoundError');
    expect(error.message).toBe('リソースが見つかりません');
    expect(error.status).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
  });

  it('should create NotFoundError with custom message', () => {
    const error = new NotFoundError('カスタムメッセージ');
    expect(error.message).toBe('カスタムメッセージ');
    expect(error.status).toBe(404);
  });

  it('should create ValidationError', () => {
    const error = new ValidationError();
    expect(error.name).toBe('ValidationError');
    expect(error.message).toBe('リクエストデータが不正です');
    expect(error.status).toBe(400);
    expect(error.code).toBe('VALIDATION_ERROR');
  });

  it('should create ServiceUnavailableError', () => {
    const error = new ServiceUnavailableError();
    expect(error.name).toBe('ServiceUnavailableError');
    expect(error.status).toBe(503);
    expect(error.code).toBe('SERVICE_UNAVAILABLE');
  });
});

describe('Error Handler Middleware', () => {
  it('should pass through when no error occurs', async () => {
    const mockContext = {
      json: vi.fn().mockReturnValue('JSON Response'),
    };
    const mockNext = vi.fn().mockResolvedValue('Next Response');

    const _result = await errorHandler(mockContext as Partial<Context> as Context, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    // nextの戻り値はerrHandlerでは使用していないので検証しない
    expect(mockContext.json).not.toHaveBeenCalled();
  });

  it('should handle ApiError', async () => {
    const mockContext = {
      json: vi.fn().mockReturnValue('Error Response'),
    };
    const mockNext = vi.fn().mockRejectedValue(new ApiError('APIエラー', 400, 'TEST_ERROR'));

    const _result = await errorHandler(mockContext as Partial<Context> as Context, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockContext.json).toHaveBeenCalledWith(
      {
        error: 'ApiError',
        message: 'APIエラー',
        code: 'TEST_ERROR',
        status: 400,
      },
      400
    );
    expect(_result).toBe('Error Response');
  });

  it('should handle ValidationError', async () => {
    const mockContext = {
      json: vi.fn().mockReturnValue('Error Response'),
    };
    const mockNext = vi.fn().mockRejectedValue(new ValidationError('バリデーションエラー'));

    const _result = await errorHandler(mockContext as Partial<Context> as Context, mockNext);

    expect(mockContext.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'ValidationError',
        message: 'バリデーションエラー',
        status: 400,
      }),
      400
    );
  });

  it('should handle unknown errors', async () => {
    const mockContext = {
      json: vi.fn().mockReturnValue('Error Response'),
    };
    const mockNext = vi.fn().mockRejectedValue(new Error('通常のエラー'));

    const _result = await errorHandler(mockContext as Partial<Context> as Context, mockNext);

    expect(mockContext.json).toHaveBeenCalledWith(
      {
        error: 'InternalServerError',
        message: '内部サーバーエラーが発生しました',
        status: 500,
      },
      500
    );
  });
});
