import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// モックの作成
vi.mock('./hooks/useUsernameCheck', () => ({
  useUsernameCheck: () => ({
    results: null,
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    checkUserAvailability: vi.fn(),
  }),
}));

describe('App', () => {
  it('renders header correctly', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { name: /Username Checker/i })).toBeInTheDocument();
    expect(
      screen.getByText(/複数のプラットフォームでユーザー名の利用可否を確認/i)
    ).toBeInTheDocument();
  });

  it('renders form', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    expect(screen.getByLabelText(/ユーザー名/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /利用可能か確認する/i })).toBeInTheDocument();
  });
});
