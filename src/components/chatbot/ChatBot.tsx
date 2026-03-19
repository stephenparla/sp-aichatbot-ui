import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import './ChatBot.css';

export type Message = { sender: 'user' | 'bot'; text: string };

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const transcriptRef = useRef<HTMLTextAreaElement>(null);

  const transcript =
    messages.map((m) => `${m.sender === 'user' ? 'user' : 'bot'}: ${m.text}`).join('\n') +
    (loading ? '\nbot: ...' : '');

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

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

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data?.reply || 'No response' }]);
    } catch (err) {
      console.error('Chat Bot error:', err);
      setError('Network or server error while communicating with Chat Bot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      <h2>Chat Bot</h2>
      <textarea
        ref={transcriptRef}
        className="chat-transcript"
        readOnly
        value={transcript}
        placeholder="Conversation will appear here..."
      />
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
      </form>
    </div>
  );
};

export default ChatBot;
