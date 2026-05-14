import React from 'react';
const { useState } = React;

import { motion, AnimatePresence } from 'framer-motion';
import RequestCard from './RequestCard';
import type { DeviceRequest, TabKey } from './types';
import { STATS } from './mockData';

const TABS: { key: TabKey; label: string; count: number }[] = [
  { key: 'all',         label: 'Toutes',    count: STATS.totalRequests },
  { key: 'new',         label: 'Nouvelles', count: STATS.newRequests },
  { key: 'in_progress', label: 'En cours',  count: STATS.inProgress },
  { key: 'to_validate', label: 'À valider', count: 0 },
  { key: 'completed',   label: 'Terminées', count: STATS.completed },
];

function filterRequests(requests: DeviceRequest[], tab: TabKey): DeviceRequest[] {
  if (tab === 'all')         return requests;
  if (tab === 'new')         return requests.filter(r => r.status === 'pending');
  if (tab === 'in_progress') return requests.filter(r => r.status === 'in_progress');
  if (tab === 'to_validate') return requests.filter(r => r.status === 'offer_sent');
  if (tab === 'completed')   return requests.filter(r => r.status === 'completed' || r.status === 'refused');
  return requests;
}

interface Props {
  requests: DeviceRequest[];
  allRequests: DeviceRequest[];
  selectedId: string | null;
  onSelect: (r: DeviceRequest) => void;
}


export default function RequestList({ requests, allRequests, selectedId, onSelect }: Props) {
  const [tab, setTab] = useState<TabKey>('all');
  
  const counts = {
    all: allRequests.length,
    new: allRequests.filter(r => r.status === 'pending').length,
    in_progress: allRequests.filter(r => r.status === 'in_progress').length,
    to_validate: allRequests.filter(r => r.status === 'offer_sent').length,
    completed: allRequests.filter(r => r.status === 'completed' || r.status === 'refused').length,
  };

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'all',         label: 'Toutes',    count: counts.all },
    { key: 'new',         label: 'Nouvelles', count: counts.new },
    { key: 'in_progress', label: 'En cours',  count: counts.in_progress },
    { key: 'to_validate', label: 'À valider', count: counts.to_validate },
    { key: 'completed',   label: 'Terminées', count: counts.completed },
  ];

  const filtered = filterRequests(requests, tab);
  const hasSelection = selectedId !== null;

  return (
    <div className="db-list-col">
      {/* Tabs */}
      <div className="db-tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`db-tab${tab === t.key ? ' active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            {t.count > 0 && <span className="db-tab-count">{t.count}</span>}
          </button>
        ))}
      </div>


      {/* List */}
      <div className="db-list-scroll">
        <AnimatePresence mode="popLayout">
          {filtered.map(r => (
            <RequestCard
              key={r.id}
              request={r}
              active={r.id === selectedId}
              dimmed={hasSelection && r.id !== selectedId}
              onClick={() => onSelect(r)}
            />
          ))}
        </AnimatePresence>

        <button className="db-load-more">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2v8M2 8l4 4 4-4"/>
          </svg>
          Charger plus
        </button>
      </div>
    </div>
  );
}
