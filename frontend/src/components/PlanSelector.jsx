import React from 'react';

/**
 * Displays plan options pulled from plans.json (imported by App)
 */
export default function PlanSelector({ plans, onClose, onBuy }) {
  return (
    <div className="modal">
      <div className="panel">
        <h3>Choose a plan</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          {Object.entries(plans).map(([key, p]) => (
            <div key={key} style={{ border: '1px solid rgba(0,0,0,0.06)', padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ color: 'var(--muted)' }}>{p.features.join(' • ')}</div>
                </div>
                <div>
                  <div style={{ fontSize: 18 }}>${p.price}</div>
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <button onClick={() => onBuy(key)}>Buy</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}