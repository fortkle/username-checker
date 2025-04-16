import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlatformCard } from './PlatformCard';
import { PlatformResult } from '../types';

describe('PlatformCard', () => {
  const mockPlatform = {
    id: 'test-platform',
    name: 'Test Platform',
    url: 'https://test.com',
    icon: 'test',
  };

  it('should render available status correctly', () => {
    const result: PlatformResult = {
      platform: mockPlatform,
      status: 'available',
    };

    render(<PlatformCard result={result} />);

    expect(screen.getByText('Test Platform')).toBeInTheDocument();
    expect(screen.getByText('利用可能')).toBeInTheDocument();
    expect(screen.getByText('プラットフォームを開く')).toHaveAttribute('href', 'https://test.com');
  });

  it('should render unavailable status correctly', () => {
    const result: PlatformResult = {
      platform: mockPlatform,
      status: 'unavailable',
    };

    render(<PlatformCard result={result} />);

    expect(screen.getByText('Test Platform')).toBeInTheDocument();
    expect(screen.getByText('利用不可')).toBeInTheDocument();
  });

  it('should render error status with message correctly', () => {
    const result: PlatformResult = {
      platform: mockPlatform,
      status: 'error',
      message: 'テストエラーメッセージ',
    };

    render(<PlatformCard result={result} />);

    expect(screen.getByText('Test Platform')).toBeInTheDocument();
    expect(screen.getByText('エラー')).toBeInTheDocument();
    expect(screen.getByText('テストエラーメッセージ')).toBeInTheDocument();
  });

  it('should render checking status correctly without link', () => {
    const result: PlatformResult = {
      platform: mockPlatform,
      status: 'checking',
    };

    render(<PlatformCard result={result} />);

    expect(screen.getByText('Test Platform')).toBeInTheDocument();
    expect(screen.getByText('確認中...')).toBeInTheDocument();
    expect(screen.queryByText('プラットフォームを開く')).not.toBeInTheDocument();
  });
}); 