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
    expect(screen.queryByRole('heading', { name: /pro hub/i })).not.toBeInTheDocument();
  });

  it('loads home when credentials are provided', async () => {
    render(<LoginForm />);

    await userEvent.clear(screen.getByLabelText(/username/i));
    await userEvent.type(screen.getByLabelText(/username/i), 'user');
    await userEvent.clear(screen.getByLabelText(/password/i));
    await userEvent.type(screen.getByLabelText(/password/i), 'pass');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(screen.getByRole('heading', { name: /pro hub/i })).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('returns to login form when logout is clicked', async () => {
    render(<LoginForm />);

    await userEvent.clear(screen.getByLabelText(/username/i));
    await userEvent.type(screen.getByLabelText(/username/i), 'user');
    await userEvent.clear(screen.getByLabelText(/password/i));
    await userEvent.type(screen.getByLabelText(/password/i), 'pass');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument());
  });
});
