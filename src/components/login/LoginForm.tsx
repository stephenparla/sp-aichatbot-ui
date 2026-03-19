import { useState, type SyntheticEvent } from 'react';
import './LoginForm.css';
import Home from '../home/Home';

const LoginForm = () => {
  const [username, setUsername] = useState<string>('username');
  const [password, setPassword] = useState<string>('password');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      setLoading(false);
      return;
    }

    // Successful login leads to Home (the chatbot tile has the fetch call)
    setLoggedIn(true);
    setLoading(false);
  };

  if (loggedIn) {
    return <Home />;
  }

  return (
    <div className="login-wrapper">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {error && <div className="login-error">{error}</div>}
        <label>
          <p>Username</p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </label>
        <div>
          <button type="submit" disabled={loading}>{loading ? 'Logging in…' : 'Submit'}</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
