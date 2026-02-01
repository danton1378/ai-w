import React, { useEffect, useRef, useState } from 'react';
import { aiRoute } from '../services/api';

/**
 * Chat component:
 * - Stores chat history in localStorage (MVP)
 * - Sends prompt to /api/ai/route
 */
export default function Chat({ user, subscription }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('chat_history')) || [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(history));
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [history]);

  async function send() {
    if (!input.trim()) return;
    const userMessage = { id: Date.now(), from: 'user', text: input };
    setHistory((h) => [...h, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const planKey = subscription ? subscription.planKey : 'free';
      const resp = await aiRoute({ userId: user ? user.id : null, planKey, prompt: input });
      const text = resp?.result?.payload?.text || JSON.stringify(resp?.result?.payload);
      const aiMessage = { id: Date.now() + 1, from: 'ai', text };
      setHistory((h) => [...h, aiMessage]);
    } catch (err) {
      setHistory((h) => [...h, { id: Date.now() + 2, from: 'ai', text: 'Error: ' + (err.message || 'Unknown') }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: 12 }}>
        <h2>Assistant</h2>
        <div style={{ color: 'var(--muted)' }}>Ask for market research, images, code, or general help.</div>
      </div>

      <div ref={ref} className="chat-window" style={{ marginBottom: 12 }}>
        {history.map((m) => (
          <div key={m.id} className="message">
            <div className={m.from === 'user' ? 'user-bubble' : 'ai-bubble'}>
              <div style={{ fontSize: 14 }}>{m.text}</div>
            </div>
          </div>
        ))}
        {loading && <div className="message ai-bubble">Thinking…</div>}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a prompt: e.g. 'Market research for electric scooters in India'"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={send} disabled={loading}>Send</button>
      </div>
    </div>
  );
}