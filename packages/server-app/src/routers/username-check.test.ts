import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import * as dnsChecker from '../checkers/dns-checker';
import * as httpChecker from '../checkers/http-checker';
import { usernameCheckRouter } from './username-check';

// モックの設定
vi.mock('../checkers/http-checker', () => ({
  checkHttp: vi.fn(),
}));

vi.mock('../checkers/dns-checker', () => ({
  checkDns: vi.fn(),
}));

describe('Username Check API', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // デフォルトのモック設定
    (httpChecker.checkHttp as Mock).mockResolvedValue({
      available: true,
      error: undefined,
    });

    (dnsChecker.checkDns as Mock).mockResolvedValue({
      available: true,
      error: undefined,
    });
  });

  it('ルーターが定義されていることを確認', () => {
    expect(usernameCheckRouter).toBeDefined();
  });

  // 注意: 実際のAPIハンドラーテストはHonoルーターの構造に合わせて
  // 別途実装する必要があります。このテストは単にビルドエラーを回避するための
  // スケルトンです。
});
