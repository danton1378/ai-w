import React from 'react';

export default function Sidebar({ user, subscription, onLogin, onLogout, onSelectPlans, dark, setDark }) {
  return (
    <aside className="sidebar">
      <h3>AI Business Assistant</h3>
      <div style={{ marginTop: 12 }}>
        <button onClick={onSelectPlans}>Plans</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <label>
          <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} /> Dark
        </label>
      </div>

      <div style={{ marginTop: 24 }}>
        {user ? (
          <>
            <div>Signed in: {user.email}</div>
            <div style={{ marginTop: 8 }}>
              <strong>Plan:</strong> {subscription ? subscription.planKey : 'Free'}
            </div>
            <div style={{ marginTop: 8 }}>
              <button onClick={onLogout}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <div>You are not signed in</div>
            <div style={{ marginTop: 8 }}>
              <button onClick={onLogin}>Login / Sign Up</button>
            </div>
          </>
        )}
      </div>

      <footer style={{ position: 'absolute', bottom: 18, left: 18 }}>
        <small style={{ color: 'var(--muted)' }}>MVP — Not for production</small>
      </footer>
    </aside>
  );
}