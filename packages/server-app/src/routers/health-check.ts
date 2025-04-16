import { Hono } from 'hono';
import type { Context } from 'hono';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

// レスポンススキーマの定義
const healthCheckResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string(),
  version: z.string(),
});

// 型の推論
type HealthCheckResponse = z.infer<typeof healthCheckResponseSchema>;

// ヘルスチェックルーター
export const healthCheckRouter = new Hono();

// ヘルスチェックエンドポイント
healthCheckRouter.get('/', (c: Context) => {
  logger.info('Health check requested');
  
  const response: HealthCheckResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.0.0',
  };
  
  return c.json(response);
}); 