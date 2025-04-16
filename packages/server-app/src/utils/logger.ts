import pinoLib from 'pino';
const pino = pinoLib as typeof pinoLib & ((...args: any[]) => any);

// ロガー設定
export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
    },
  },
  level: process.env.LOG_LEVEL || 'info',
});
