import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('shows validation error when username or password are empty', async () => {
    render(<LoginForm />);

    await userEvent.clear(screen.getByLabelText(/username/i));
    await userEvent.clear(screen.getByLabelText(/password/i));
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(screen.getByText(/username and password are required/i)).toBeInTheDocument());
    expect(screen.queryByRole('heading', { name: /ai hub/i })).not.toBeInTheDocument();
  });

  it('loads home when credentials are provided', async () => {
    render(<LoginForm />);

    await userEvent.clear(screen.getByLabelText(/username/i));
    await userEvent.type(screen.getByLabelText(/username/i), 'user');
    await userEvent.clear(screen.getByLabelText(/password/i));
    await userEvent.type(screen.getByLabelText(/password/i), 'pass');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(screen.getByRole('heading', { name: /ai hub/i })).toBeInTheDocument());
  });
});
