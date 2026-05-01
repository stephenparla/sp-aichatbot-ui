import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it } from 'vitest';
import Home from './Home';

describe('Home component', () => {
  it('shows placeholder when no tile is selected', () => {
    render(<Home />);

    expect(screen.getByText(/pick one of the tiles above/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /chat bot/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /basic llm model/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /agent/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analytics/i })).toBeInTheDocument();
  });

  it('renders logout button when logout handler is provided', () => {
    render(<Home onLogout={() => {}} />);

    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('renders Chat Bot component when Chat Bot tile is clicked', async () => {
    render(<Home />);

    await userEvent.click(screen.getByRole('button', { name: /chat bot/i }));

    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/conversation will appear here/i)).toBeInTheDocument();
  });

  it('renders Basic Model when Basic Model tile is clicked', async () => {
    render(<Home />);

    await userEvent.click(screen.getByRole('button', { name: /basic llm model/i }));

    expect(screen.getByText(/this is a placeholder for your basic model ui and ux/i)).toBeInTheDocument();
    expect(screen.queryByText(/pick one of the tiles above/i)).not.toBeInTheDocument();
  });
});
