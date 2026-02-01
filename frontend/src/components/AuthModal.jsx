import React, { useState } from 'react';
import { signup, login } from '../services/api';

/**
 * Auth modal supports signup/login
 * After successful call, returns user object to parent which saves to localStorage (MVP)
 */
export default function AuthModal({ onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function submit() {
    setLoading(true);
    setErr(null);
    try {
      if (mode === 'login') {
        const user = await login(email, password);
        onLogin(user);
      } else {
        const user = await signup(email, password);
        onLogin(user);
      }
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal">
      <div className="panel">
        <h3>{mode === 'login' ? 'Login' : 'Sign up'}</h3>
        {err && <div style={{ color: 'red' }}>{err}</div>}
        <div>
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div style={{ marginTop: 8 }}>
          <button onClick={submit} disabled={loading}>{mode === 'login' ? 'Login' : 'Sign up'}</button>
          <button onClick={onClose} style={{ marginLeft: 8 }}>Cancel</button>
        </div>

        <div style={{ marginTop: 10 }}>
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Switch to Sign up' : 'Switch to Login'}
          </button>
        </div>
      </div>
    </div>
  );
}