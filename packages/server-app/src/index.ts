import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { healthCheckRouter } from './routers/health-check.js';
import { usernameCheckRouter } from './routers/username-check.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middlewares/error-handler.js';

// アプリケーションの作成
const app = new Hono();

// グローバルエラーハンドラーの設定
app.use('*', errorHandler);

// CORSミドルウェアの設定
app.use(
  '*',
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
);

// ルーターの設定
app.route('/health_check', healthCheckRouter);
app.route('/api/check', usernameCheckRouter);

// サーバー起動
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8787;

type ServerInfo = {
  port: number;
};

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info: ServerInfo) => {
    logger.info(`Server is running on port ${info.port}`);
  }
);
