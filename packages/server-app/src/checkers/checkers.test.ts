import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkHttp } from './http-checker';
import { checkDns } from './dns-checker';
import * as dnsChecker from './dns-checker';

// dnsLookupをモック
vi.spyOn(dnsChecker, 'dnsLookup').mockImplementation(
  () => Promise.resolve({ address: '192.168.1.1', family: 4 }) as any
);

// globalのfetchをモック化
// @ts-ignore - 必要なTypeScriptエラーを無視
global.fetch = vi.fn();
// @ts-ignore - 必要なTypeScriptエラーを無視
global.AbortController = vi.fn(() => ({
  abort: vi.fn(),
  signal: 'mocked-signal',
}));

describe('HTTP Checker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return error if HTTP options are missing', async () => {
    const platform = {
      id: 'test',
      name: 'Test',
      url: 'https://example.com',
      icon: 'test',
      checkMethod: 'http' as const,
      // httpOptionsを省略
    };

    const result = await checkHttp(platform, 'testuser');
    expect(result.available).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('HTTPオプション');
  });

  it('should return available=true if status code matches', async () => {
    // @ts-ignore - フェッチのモック
    global.fetch.mockResolvedValueOnce({
      status: 404,
    });

    // setTimeout のモック
    vi.spyOn(global, 'setTimeout').mockImplementationOnce((fn) => {
      return 123 as unknown as NodeJS.Timeout;
    });

    // clearTimeout のモック
    vi.spyOn(global, 'clearTimeout');

    const platform = {
      id: 'test',
      name: 'Test',
      url: 'https://example.com',
      icon: 'test',
      checkMethod: 'http' as const,
      httpOptions: {
        urlTemplate: 'https://example.com/{username}',
        successStatusCodes: [404],
        method: 'HEAD' as const,
        timeout: 5000,
      },
    };

    const result = await checkHttp(platform, 'testuser');
    expect(result.available).toBe(true);
    expect(result.error).toBeUndefined();

    // フェッチが呼ばれたことを確認
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/testuser', expect.any(Object));
    expect(global.clearTimeout).toHaveBeenCalled();
  });

  it('should return available=false if status code does not match', async () => {
    // @ts-ignore - フェッチのモック
    global.fetch.mockResolvedValueOnce({
      status: 200,
    });

    const platform = {
      id: 'test',
      name: 'Test',
      url: 'https://example.com',
      icon: 'test',
      checkMethod: 'http' as const,
      httpOptions: {
        urlTemplate: 'https://example.com/{username}',
        successStatusCodes: [404],
        method: 'HEAD' as const,
        timeout: 5000,
      },
    };

    const result = await checkHttp(platform, 'testuser');
    expect(result.available).toBe(false);
    expect(result.error).toBeUndefined();
  });

  it('should handle network errors', async () => {
    // @ts-ignore - フェッチのモック
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const platform = {
      id: 'test',
      name: 'Test',
      url: 'https://example.com',
      icon: 'test',
      checkMethod: 'http' as const,
      httpOptions: {
        urlTemplate: 'https://example.com/{username}',
        successStatusCodes: [404],
        method: 'HEAD' as const,
        timeout: 5000,
      },
    };

    const result = await checkHttp(platform, 'testuser');
    expect(result.available).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('Network error');
  });
});

describe('DNS Checker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return error if DNS options are missing', async () => {
    const platform = {
      id: 'test',
      name: 'Test',
      url: 'https://example.com',
      icon: 'test',
      checkMethod: 'dns' as const,
      // dnsOptionsを省略
    };

    const result = await checkDns(platform, 'testuser');
    expect(result.available).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('DNSオプション');
  });

  it('should return available=true if domain exists and unavailableIfExists=false', async () => {
    // モックを設定 - 成功ケース
    vi.spyOn(dnsChecker, 'dnsLookup').mockResolvedValueOnce({
      address: '192.168.1.1',
      family: 4,
    } as any);

    const platform = {
      id: 'test',
      name: 'Test',
      url: 'https://example.com',
      icon: 'test',
      checkMethod: 'dns' as const,
      dnsOptions: {
        domainTemplate: '{username}.example.com',
        unavailableIfExists: false, // 存在すれば利用可能
      },
    };

    const result = await checkDns(platform, 'testuser');
    expect(result.available).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should return available=false if domain exists and unavailableIfExists=true', async () => {
    // モックを設定 - 成功ケース
    vi.spyOn(dnsChecker, 'dnsLookup').mockResolvedValueOnce({
      address: '192.168.1.1',
      family: 4,
    } as any);

    const platform = {
      id: 'test',
      name: 'Test',
      url: 'https://example.com',
      icon: 'test',
      checkMethod: 'dns' as const,
      dnsOptions: {
        domainTemplate: '{username}.example.com',
        unavailableIfExists: true,
      },
    };

    const result = await checkDns(platform, 'testuser');
    // トラブルシューティングのためにコンソールログを追加
    console.log('Test result:', result);
    expect(result.available).toBe(false);
    expect(result.error).toBeUndefined();
  });

  it('should return available=true if domain does not exist and unavailableIfExists=true', async () => {
    // モックを設定 - エラーケース
    const error = new Error('ENOTFOUND');
    // @ts-ignore
    error.code = 'ENOTFOUND';
    vi.spyOn(dnsChecker, 'dnsLookup').mockRejectedValueOnce(error);

    const platform = {
      id: 'test',
      name: 'Test',
      url: 'https://example.com',
      icon: 'test',
      checkMethod: 'dns' as const,
      dnsOptions: {
        domainTemplate: '{username}.example.com',
        unavailableIfExists: true,
      },
    };

    const result = await checkDns(platform, 'testuser');
    expect(result.available).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should handle other DNS errors', async () => {
    // モックを設定 - その他のエラーケース
    const error = new Error('DNS server error');
    // @ts-ignore
    error.code = 'SERVFAIL';
    vi.spyOn(dnsChecker, 'dnsLookup').mockRejectedValueOnce(error);

    const platform = {
      id: 'test',
      name: 'Test',
      url: 'https://example.com',
      icon: 'test',
      checkMethod: 'dns' as const,
      dnsOptions: {
        domainTemplate: '{username}.example.com',
        unavailableIfExists: false, // falseに変更
      },
    };

    const result = await checkDns(platform, 'testuser');
    expect(result.available).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('DNS server error');
  });
});
