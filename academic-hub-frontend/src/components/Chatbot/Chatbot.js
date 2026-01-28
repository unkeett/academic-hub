import React, { useState } from 'react';
import axios from '../../utils/axiosConfig';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi 👋 I am your Academic Assistant!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/chat', { message: input });
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: res.data.reply }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Something went wrong 😅' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✖' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot">
          <div className="chatbot-header">
            <span>Academic AI</span>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="msg bot">Thinking…</div>}
          </div>

          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
