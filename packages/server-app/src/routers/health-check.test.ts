import { describe, expect, it } from 'vitest';
import { healthCheckRouter } from './health-check.js';

describe('Health Check API', () => {
  it('should return status ok with timestamp and version', async () => {
    // ルーターからレスポンスを取得
    const res = await healthCheckRouter.request('/');
    expect(res.status).toBe(200);

    // レスポンスのJSONを解析
    const data = await res.json();

    // 期待する構造と型を持っているか確認
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('version');

    // timestampが有効なISO日付文字列か確認
    expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp);
  });
});
