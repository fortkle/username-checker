import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from './utils/logger.js';
import { healthCheckRouter } from './routers/health-check.js';

// アプリケーションの作成
const app = new Hono();

// ルーターの設定
app.route('/health_check', healthCheckRouter);

// サーバー起動
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8787;

type ServerInfo = {
  port: number;
};

serve({
  fetch: app.fetch,
  port: PORT,
}, (info: ServerInfo) => {
  logger.info(`Server is running on port ${info.port}`);
}); 