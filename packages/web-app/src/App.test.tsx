import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders headline', () => {
    render(<App />);
    expect(screen.getByText('Username Checker')).toBeInTheDocument();
  });

  it('renders counter with initial value 0', () => {
    render(<App />);
    expect(screen.getByText(/カウント: 0/)).toBeInTheDocument();
  });
});
