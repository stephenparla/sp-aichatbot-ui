import { useState } from 'react';
import ChatBot from '../chatbot/ChatBot';
import BasicModel from '../basic_model/BasicModel';
import './Home.css';

type ViewType = 'none' | 'chatbot' | 'basic_model' | 'agent' | 'dashboard';
type HomeProps = {
  onLogout?: () => void;
};

const ChatbotPlaceholder = () => (
  <div className="future-placeholder">
    <h2>Future enhancement: Agent orchestration</h2>
    <p>Coming soon: role-based agent workflow with multi-step prompts.</p>
  </div>
);

const AnalyticsPlaceholder = () => (
  <div className="future-placeholder">
    <h2>Future enhancement: Analytics</h2>
    <p>Coming soon: usage metrics, model performance, and conversation reports.</p>
  </div>
);

const Home = ({ onLogout }: HomeProps) => {
  const [activeView, setActiveView] = useState<ViewType>('none');
  const [error, setError] = useState<string | null>(null);

  const handleChatbotClick = () => {
    setError(null);
    setActiveView('chatbot');
  };

  const renderActiveComponent = () => {
    if (activeView === 'chatbot') return <ChatBot />;
    if (activeView === 'basic_model') return <BasicModel />;
    if (activeView === 'agent') return <ChatbotPlaceholder />;
    if (activeView === 'dashboard') return <AnalyticsPlaceholder />;
    return (
      <div className="home-placeholder">
        <h2>Pick one of the tiles above</h2>
        <p>Please select a feature to start working (Chat Bot, Basic Model, Agent, Analytics).</p>
      </div>
    );
  };

  return (
    <div className="home-wrapper">
      <header className="home-header">
        <div className="home-header-copy">
          <p className="home-kicker">AI Workspace</p>
          <h1>The Professional Hub</h1>
          <p className="home-subtitle">
            A single place for chat, models, agents, and analytics.
          </p>
        </div>
        <div className="home-header-actions">
          <div className="home-header-badge">Smart Tools Hub</div>
          {onLogout && (
            <button type="button" className="home-logout-button" onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
      </header>

      <div className="tile-grid">
        <button
          type="button"
          className={`tile tile-chatbot ${activeView === 'chatbot' ? 'active' : ''}`}
          onClick={handleChatbotClick}
          disabled={false}
        >
          <h2 className="tile-title tile-title-chatbot">Chat Bot</h2>
          <p>Talk to the conversational AI model.</p>
        </button>

        <button
          type="button"
          className={`tile tile-basic-model ${activeView === 'basic_model' ? 'active' : ''}`}
          onClick={() => setActiveView('basic_model')}
        >
          <h2 className="tile-title tile-title-basic">Basic LLM Model</h2>
          <p>Use a simple prompt/response model interface.</p>
        </button>

        <button
          type="button"
          className={`tile tile-agent ${activeView === 'agent' ? 'active' : ''}`}
          onClick={() => setActiveView('agent')}
        >
          <h2 className="tile-title tile-title-agent">Agent</h2>
          <p>Placeholder for future agent orchestration module.</p>
        </button>

        <button
          type="button"
          className={`tile tile-analytics ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveView('dashboard')}
        >
          <h2 className="tile-title tile-title-analytics">Analytics</h2>
          <p>Placeholder for future metrics and reporting dashboard.</p>
        </button>
      </div>

      {error && <div className="home-error">{error}</div>}
      <div className="active-component-container">{renderActiveComponent()}</div>

      <footer className="home-footer">
        <span>Portfolio</span>
        <span>Chat, models, agents, and analytics in one workspace</span>
      </footer>
    </div>
  );
};

export default Home;
