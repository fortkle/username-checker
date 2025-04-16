import { PlatformResult, PlatformStatus } from '../types';

interface PlatformCardProps {
  result: PlatformResult;
}

// ステータスによって表示を変更
const getStatusDisplay = (status: PlatformStatus) => {
  switch (status) {
    case 'available':
      return {
        text: '利用可能',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
      };
    case 'unavailable':
      return {
        text: '利用不可',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
      };
    case 'error':
      return {
        text: 'エラー',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200',
      };
    case 'checking':
      return {
        text: '確認中...',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200',
      };
    default:
      return {
        text: '不明',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        borderColor: 'border-gray-200',
      };
  }
};

export function PlatformCard({ result }: PlatformCardProps) {
  const { platform, status, message } = result;
  const statusStyle = getStatusDisplay(status);

  // アイコン表示のためのプレースホルダー（後で実装）
  const getIconElement = (iconName: string) => {
    // 実際のアイコンライブラリ実装まではプレースホルダーテキストを返す
    return <div className="text-xl font-bold">{iconName.charAt(0).toUpperCase()}</div>;
  };

  return (
    <div
      className={`p-4 rounded-lg border ${statusStyle.borderColor} ${statusStyle.bgColor} flex flex-col h-full`}
    >
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
          {getIconElement(platform.icon)}
        </div>
        <h3 className="font-medium">{platform.name}</h3>
      </div>

      <div className={`text-sm font-medium ${statusStyle.textColor} mt-auto`}>
        {statusStyle.text}
      </div>

      {message && status === 'error' && <p className="text-xs mt-1 text-gray-600">{message}</p>}

      {status !== 'checking' && (
        <a
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline mt-2 inline-block"
        >
          プラットフォームを開く
        </a>
      )}
    </div>
  );
}
