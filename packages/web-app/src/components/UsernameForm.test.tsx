import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UsernameForm } from './UsernameForm';

describe('UsernameForm', () => {
  it('should render the form correctly', () => {
    const mockSubmit = vi.fn();
    render(<UsernameForm onSubmit={mockSubmit} />);

    expect(screen.getByLabelText(/ユーザー名/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /利用可能か確認する/i })).toBeInTheDocument();
  });

  it('should show loading state when isLoading is true', () => {
    const mockSubmit = vi.fn();
    render(<UsernameForm onSubmit={mockSubmit} isLoading={true} />);

    expect(screen.getByRole('button', { name: /確認中\.\.\./i })).toBeDisabled();
    expect(screen.getByLabelText(/ユーザー名/i)).toBeDisabled();
  });

  it('should call onSubmit with the entered username when form is submitted', async () => {
    const mockSubmit = vi.fn();
    render(<UsernameForm onSubmit={mockSubmit} />);

    const input = screen.getByLabelText(/ユーザー名/i);
    fireEvent.change(input, { target: { value: 'testuser' } });

    // フォームを送信（ボタンをクリック）
    const button = screen.getByRole('button', { name: /利用可能か確認する/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith('testuser');
    });
  });

  it('should show validation error for invalid username', async () => {
    const mockSubmit = vi.fn();
    render(<UsernameForm onSubmit={mockSubmit} />);

    // 空の入力でフォーム送信
    const button = screen.getByRole('button', { name: /利用可能か確認する/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.queryByText(/ユーザー名を入力してください/i)).toBeInTheDocument();
    });
    expect(mockSubmit).not.toHaveBeenCalled();

    // 不正な文字を含む入力
    const input = screen.getByLabelText(/ユーザー名/i);
    fireEvent.change(input, { target: { value: 'test user@123' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.queryByText(/英数字、アンダースコア、ドット、ハイフンのみ使用可能です/i)
      ).toBeInTheDocument();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
