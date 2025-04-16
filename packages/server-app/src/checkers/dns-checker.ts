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

    // 設定に基づいて利用可否を判定
    // unavailableIfExists が true の場合、ドメインが存在すれば利用不可（available=false）
    // unavailableIfExists が false の場合、ドメインが存在すれば利用可能（available=true）
    return {
      available: unavailableIfExists === false,
    };
  } catch (error) {
    // ドメインが存在しない場合（ENOTFOUND）
    if (error instanceof Error && 'code' in error && error.code === 'ENOTFOUND') {
      logger.debug({ platform: platform.id, domain, exists: false }, 'ドメインが存在しません');
      
      // 設定に基づいて利用可否を判定
      // unavailableIfExists が true の場合、ドメインが存在しなければ利用可能（available=true）
      // unavailableIfExists が false の場合、ドメインが存在しなければ利用不可（available=false）
      return {
        available: unavailableIfExists === true,
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
