import { useState, type SyntheticEvent } from 'react';
import './LoginForm.css'; 
import ChatBot from '../chatbot/ChatBot';

const LoginForm = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Handle login logic (e.g., fetch to your backend API)
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        // You can inspect response.status or the response body for better error messages
        setError('Login failed — please check your credentials.');
        setLoading(false);
        return;
      }

      const data = await response.json();
      // Example: store token if your backend returns one
      if (data?.token) {
        localStorage.setItem('authToken', data.token);
      }

      // Mark as logged in and render chat landing
      setLoggedIn(true);
      setLoading(false);
      console.log('Login successful:', data);
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed — network or server error.');
      setLoading(false);
    }
  };

  if (loggedIn) {
    return <ChatBot />;
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
