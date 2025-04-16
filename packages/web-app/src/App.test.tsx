import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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