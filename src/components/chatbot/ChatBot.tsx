import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import './ChatBot.css';

export type Message = { sender: 'user' | 'bot'; text: string };

const toDisplayText = (value?: string): string => {
  if (!value) return 'No response';

  const trimmed = value.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed) as { message?: string };
      if (typeof parsed.message === 'string' && parsed.message.trim()) {
        return parsed.message;
      }
    } catch {
      // Keep original value when it is not valid JSON.
    }
  }

  return value;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/aichat/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa('sparla:password1')}`,
        },
        body: JSON.stringify({ message: userText }),
      });

      if (!response.ok) {
        setError('Failed to get response from Chat Bot.');
        return;
      }

      const data: { message?: string; statusCode?: number } = await response.json();
      console.log('Chat Bot response:', data);

      if (data?.statusCode === 200) {
        setMessages((prev) => [...prev, { sender: 'bot', text: toDisplayText(data?.message) }]);
      } else {
        setError(toDisplayText(data?.message));
      }
    } catch (err) {
      console.error('Chat Bot error:', err);
      setError('Network or server error while communicating with Chat Bot.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInput('');
    setError(null);
  };

  return (
    <div className="chatbot-wrapper">
      <h2>Chat Bot</h2>
      <div
        ref={transcriptRef}
        className="chat-transcript"
      >
        {messages.length === 0 && !loading ? (
          <div className="chat-empty-state">Conversation will appear here...</div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${index}-${message.text}`}
                className={`chat-message chat-message-${message.sender}`}
              >
                <div className="chat-message-label">{message.sender === 'user' ? 'You' : 'Bot'}</div>
                <div className="chat-message-text">{message.text}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-message chat-message-bot">
                <div className="chat-message-label">Bot</div>
                <div className="chat-message-text">...</div>
              </div>
            )}
          </>
        )}
      </div>
      {error && <div className="chat-error">{error}</div>}
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
        <button type="button" onClick={handleReset} disabled={loading && messages.length === 0}>
          Reset
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
