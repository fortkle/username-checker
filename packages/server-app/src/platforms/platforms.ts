import { z } from 'zod';

// チェック方法の種類を定義
export const CheckMethodEnum = z.enum(['http', 'dns']);
export type CheckMethod = z.infer<typeof CheckMethodEnum>;

// プラットフォーム定義のスキーマ
export const PlatformSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url(),
  icon: z.string(),
  checkMethod: CheckMethodEnum,
  // 各チェック方法に必要な追加情報
  httpOptions: z
    .object({
      // URLテンプレート: {username} はユーザー名に置換される
      urlTemplate: z.string(),
      // 成功とみなすステータスコード
      successStatusCodes: z.array(z.number()),
      // HTTPメソッド（デフォルトはGET）
      method: z.enum(['GET', 'HEAD']).default('GET'),
      // タイムアウト（ミリ秒、デフォルトは5000ms）
      timeout: z.number().optional().default(5000),
    })
    .optional(),
  dnsOptions: z
    .object({
      // ドメインテンプレート: {username} はユーザー名に置換される
      domainTemplate: z.string(),
      // 成功条件（存在すれば利用不可、存在しなければ利用可能）
      unavailableIfExists: z.boolean().default(true),
    })
    .optional(),
});

export type Platform = z.infer<typeof PlatformSchema>;

// プラットフォーム定義のリスト
export const platforms: Platform[] = [
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com',
    icon: 'github',
    checkMethod: 'http',
    httpOptions: {
      urlTemplate: 'https://github.com/{username}',
      successStatusCodes: [404], // 404の場合は利用可能（ユーザーが存在しない）
      method: 'HEAD',
      timeout: 5000,
    },
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    url: 'https://twitter.com',
    icon: 'twitter',
    checkMethod: 'http',
    httpOptions: {
      urlTemplate: 'https://twitter.com/{username}',
      successStatusCodes: [404], // 404の場合は利用可能（ユーザーが存在しない）
      method: 'HEAD',
      timeout: 5000,
    },
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://instagram.com',
    icon: 'instagram',
    checkMethod: 'http',
    httpOptions: {
      urlTemplate: 'https://instagram.com/{username}',
      successStatusCodes: [404], // 404の場合は利用可能（ユーザーが存在しない）
      method: 'HEAD',
      timeout: 5000,
    },
  },
  {
    id: 'medium',
    name: 'Medium',
    url: 'https://medium.com',
    icon: 'medium',
    checkMethod: 'http',
    httpOptions: {
      urlTemplate: 'https://medium.com/@{username}',
      successStatusCodes: [404], // 404の場合は利用可能（ユーザーが存在しない）
      method: 'HEAD',
      timeout: 5000,
    },
  },
  {
    id: 'dev',
    name: 'Dev.to',
    url: 'https://dev.to',
    icon: 'dev',
    checkMethod: 'http',
    httpOptions: {
      urlTemplate: 'https://dev.to/{username}',
      successStatusCodes: [404], // 404の場合は利用可能（ユーザーが存在しない）
      method: 'HEAD',
      timeout: 5000,
    },
  },
  {
    id: 'codepen',
    name: 'CodePen',
    url: 'https://codepen.io',
    icon: 'codepen',
    checkMethod: 'http',
    httpOptions: {
      urlTemplate: 'https://codepen.io/{username}',
      successStatusCodes: [404], // 404の場合は利用可能（ユーザーが存在しない）
      method: 'HEAD',
      timeout: 5000,
    },
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    url: 'https://gitlab.com',
    icon: 'gitlab',
    checkMethod: 'http',
    httpOptions: {
      urlTemplate: 'https://gitlab.com/{username}',
      successStatusCodes: [404], // 404の場合は利用可能（ユーザーが存在しない）
      method: 'HEAD',
      timeout: 5000,
    },
  },
  {
    id: 'mastodon',
    name: 'Mastodon (.social)',
    url: 'https://mastodon.social',
    icon: 'mastodon',
    checkMethod: 'http',
    httpOptions: {
      urlTemplate: 'https://mastodon.social/@{username}',
      successStatusCodes: [404], // 404の場合は利用可能（ユーザーが存在しない）
      method: 'HEAD',
      timeout: 5000,
    },
  },
  {
    id: 'custom-domain',
    name: 'カスタムドメイン',
    url: 'https://example.com',
    icon: 'globe',
    checkMethod: 'dns',
    dnsOptions: {
      domainTemplate: '{username}.com',
      unavailableIfExists: true,
    },
  },
];
