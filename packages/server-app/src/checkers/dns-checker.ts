import { Platform } from '../platforms/platforms.js';
import { logger } from '../utils/logger.js';
import dns from 'node:dns';
import { promisify } from 'node:util';

// DNSのlookupメソッドをPromise化
const lookup = promisify(dns.lookup);

// for testing
export const dnsLookup = lookup;

// チェック結果の型
export type CheckResult = {
  available: boolean;
  error?: string;
};

/**
 * ドメインテンプレート内のユーザー名プレースホルダーを置換する
 */
const replaceUsername = (template: string, username: string): string => {
  return template.replace('{username}', username);
};

/**
 * DNSレコードを検索してユーザー名の利用可否をチェックする
 */
export const checkDns = async (platform: Platform, username: string): Promise<CheckResult> => {
  if (!platform.dnsOptions) {
    return {
      available: false,
      error: 'DNSオプションが設定されていません',
    };
  }

  const { domainTemplate, unavailableIfExists } = platform.dnsOptions;
  const domain = replaceUsername(domainTemplate, username);

  logger.debug({ platform: platform.id, domain }, 'DNS検索開始');

  try {
    // DNSレコードを検索
    await dnsLookup(domain);

    // ドメインが存在する場合
    logger.debug({ platform: platform.id, domain, exists: true }, 'ドメインが存在します');

    // 設定に基づいて利用可否を判定（通常は存在すれば利用不可）
    return {
      available: !unavailableIfExists,
    };
  } catch (error) {
    // ドメインが存在しない場合（ENOTFOUND）は通常利用可能
    if (error instanceof Error && 'code' in error && error.code === 'ENOTFOUND') {
      logger.debug({ platform: platform.id, domain, exists: false }, 'ドメインが存在しません');
      // 設定に基づいて利用可否を判定（通常は存在しなければ利用可能）
      return {
        available: unavailableIfExists,
      };
    }

    // その他のエラーの場合
    logger.error({ platform: platform.id, domain, error }, 'DNS検索エラー');
    return {
      available: false,
      error: error instanceof Error ? error.message : 'DNS検索中にエラーが発生しました',
    };
  }
};
