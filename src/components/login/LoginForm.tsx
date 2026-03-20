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

  const handleLogout = () => {
    setLoggedIn(false);
    setError(null);
  };

  if (loggedIn) {
    return <Home onLogout={handleLogout} />;
  }

  return (
    <div className="login-page">
      <section className="login-visual-panel" aria-hidden="true">
        <div className="login-visual-copy">
          <p className="login-kicker">AI Workspace</p>
          <h2>Pro Hub Access</h2>
          <p>
            Enter the workspace used for chat, models, agent workflows, and analytics in one
            corporate-ready environment.
          </p>
        </div>
        <div className="login-visual-grid">
          <div className="login-visual-card login-visual-card-meeting">
            <span>Executive Briefing</span>
            <strong>Team alignment and decision support</strong>
          </div>
          <div className="login-visual-card login-visual-card-dashboard">
            <span>Operations View</span>
            <strong>Insights, reporting, and model performance</strong>
          </div>
        </div>
      </section>

      <div className="login-wrapper">
        <p className="login-kicker">Secure Sign In</p>
        <h1>Login</h1>
        <p className="login-subtitle">Use your credentials to open the Pro Hub workspace.</p>
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
    </div>
  );
};

export default LoginForm;
