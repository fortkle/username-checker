import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultsGrid } from './ResultsGrid';
import { PlatformResult } from '../types';

describe('ResultsGrid', () => {
  const mockResults: PlatformResult[] = [
    {
      platform: {
        id: 'test1',
        name: 'Test Platform 1',
        url: 'https://test1.com',
        icon: 'test1',
      },
      status: 'available',
    },
    {
      platform: {
        id: 'test2',
        name: 'Test Platform 2',
        url: 'https://test2.com',
        icon: 'test2',
      },
      status: 'unavailable',
    },
  ];

  it('should render loading state correctly', () => {
    render(<ResultsGrid results={null} isLoading={true} error={null} />);

    expect(screen.getByText('プラットフォームを確認中...')).toBeInTheDocument();
  });

  it('should render error state correctly', () => {
    const error = new Error('テストエラー');
    render(<ResultsGrid results={null} isLoading={false} error={error} />);

    expect(screen.getByText(/エラーが発生しました/)).toBeInTheDocument();
    expect(screen.getByText(/テストエラー/)).toBeInTheDocument();
  });

  it('should render empty state correctly', () => {
    render(<ResultsGrid results={null} isLoading={false} error={null} />);

    expect(screen.getByText('チェックするユーザー名を入力してください')).toBeInTheDocument();
  });

  it('should render results correctly', () => {
    render(<ResultsGrid results={mockResults} isLoading={false} error={null} />);

    expect(screen.getByText('チェック結果')).toBeInTheDocument();
    expect(screen.getByText('Test Platform 1')).toBeInTheDocument();
    expect(screen.getByText('Test Platform 2')).toBeInTheDocument();
    expect(screen.getByText('利用可能')).toBeInTheDocument();
    expect(screen.getByText('利用不可')).toBeInTheDocument();
  });

  it('should render results grid with correct number of items', () => {
    render(<ResultsGrid results={mockResults} isLoading={false} error={null} />);

    // チェック結果グリッドに2つのプラットフォームカードが表示されていることを確認
    const gridItems = screen.getAllByText(/Test Platform/);
    expect(gridItems).toHaveLength(2);
  });
});
