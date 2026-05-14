import React, { useState } from 'react';
import { REQUESTS } from '../data/adminRequests';

export default function RequestList() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="requests-list">
      {REQUESTS.map(r => {
        const active = selectedId === r.id;
        return (
          <div
            key={r.id}
            className={`req-card${active ? ' req-card--active' : ''}`}
            onClick={() => {
              const next = active ? null : r.id;
              setSelectedId(next);
              const payload = next ? REQUESTS.find(x => x.id === next) ?? null : null;
              window.dispatchEvent(new CustomEvent('req-select', { detail: payload }));
            }}
          >
            <div className={`req-thumb req-thumb--${r.brand}`} />
            <div className="req-body">
              <div className="req-top">
                <span className="req-name">{r.name}</span>
                <span className={`status-pill ${r.status}`}>{r.statusLabel}</span>
              </div>
              <span className="req-specs">{r.specs}</span>
              <div className="req-foot">
                <span className="req-date">{r.date}</span>
                <span className="req-price">{r.price}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
