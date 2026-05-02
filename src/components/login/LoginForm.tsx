import { useState, useEffect, type SyntheticEvent } from 'react';
import './LoginForm.css';
import Home from '../home/Home';

const LoginForm = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  
  const [userCount, setUserCount] = useState<number | null>(null); // State to store the count

  // 1. Point this directly to your generated AWS Lambda URL
  const LAMBDA_URL = import.meta.env.VITE_LAMBDA_URL;

  // 2. Fetch the count on page load
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch(LAMBDA_URL);
        if (response.ok) {
          const data = await response.json();
          setUserCount(data.totalUsers); // Save the integer from Lambda
        }
      } catch (err) {
        console.error("Failed to load viewer count:", err);
      }
    };
    fetchCount();
  }, []);

const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  // 1. Basic Validation
  if (!username.trim() || !password.trim()) {
    setError('Username and password are required.');
    setLoading(false);
    return;
  }

  try {
    // 2. Generate the Token (This is what Spring Security expects)
    const token = btoa(`${username}:${password}`);
    const authHeader = `Basic ${token}`;

    // 3. The "Comparison" Handshake
    // We hit /ping because it's lightweight and returns 200 if Auth is correct
    const response = await fetch(`${API_URL}/api/aichat/ping`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader
      }
    });

    if (response.ok) {
      // ✅ SUCCESS: The credentials matched the AWS Secrets in the Backend
      // Save the token so the ChatBot component can use it later
      sessionStorage.setItem('hub_token', authHeader);
      setLoggedIn(true);
    } else {
      // FAILURE: Backend rejected the credentials
      setError('Invalid username or password.');
    }
  } catch (err) {
    // NETWORK ERROR: Backend is down or CORS is blocked
    setError('Cannot connect to the security service. Please try again later.');
  } finally {
    setLoading(false);
  }
};

const handleLogout = () => {
sessionStorage.removeItem('hub_token'); // Clear the secret
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
          <h2>Portfolio Access</h2>
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

        &nbsp;

        {/* 3. Render the dynamic badge if the count loaded */}
        {userCount !== null && (
        <div style={{
          backgroundColor: '#f0f4f8',
          color: '#1a202c',
          padding: '10px 15px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '0.9rem',
          border: '1px solid #e2e8f0'
        }}>
          🚀 <strong>{userCount}</strong> unique guests have explored this portfolio!!
        </div>
       )}

        {/* Rest of your login form UI goes here... */}

        <p className="login-subtitle">Use your credentials to open Portfolio catalogue.</p>

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
