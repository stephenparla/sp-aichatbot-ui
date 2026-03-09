import { useState, type SyntheticEvent } from 'react';
import './ChatBot.css'; 

// Define Message type outside the component
export type Message = { sender: 'user' | 'bot'; text: string };

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return; // Don't send empty messages

    // Add user message to chat
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      // Send message to backend API
      const response = await fetch('http://localhost:8080/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        setError('Failed to get response from chatbot.');
        setLoading(false);
        return;
      }

      const data = await response.json();
      const botMessage: Message = { sender: 'bot', text: data?.reply || 'No response' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setError('Network or server error while communicating with chatbot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      <h1>ChatBot</h1>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot">...</div>}
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
      </form>
    </div>
  );
};

export default ChatBot;
