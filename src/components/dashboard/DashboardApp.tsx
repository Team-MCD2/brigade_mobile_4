import React from 'react';
const { useReducer, useCallback, useEffect, useRef } = React;

import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import RequestList from './RequestList';
import DeviceHero from './DeviceHero';
import DeviceConditionGrid from './DeviceConditionGrid';
import DeviceGallery from './DeviceGallery';
import ClientPanel from './ClientPanel';
import ActionBar from './ActionBar';
import NewRequestModal from './NewRequestModal';
import NotificationPanel from './NotificationPanel';
import Overview from './Overview';
import MessagesPanel from './MessagesPanel';
import SettingsPanel from './SettingsPanel';
import ClientsManagement from './ClientsManagement';
import DevicesManagement from './DevicesManagement';
import PaymentsHistory from './PaymentsHistory';
import StatisticsView from './StatisticsView';
import LoginPage from './LoginPage';
import { DB } from './db';
import type { DeviceRequest, DashboardState, DashboardAction, RequestStatus, Note, Chat, Message, DashboardSettings } from './types';


import { MOCK_REQUESTS, MOCK_NOTES, MOCK_CHATS, DEFAULT_SETTINGS } from './mockData';


export const STATUS_LABELS: Record<string, string> = {
  pending:     'En attente',
  in_progress: 'En cours',
  offer_sent:  'Offre envoyée',
  completed:   'Terminée',
  refused:     'Refusée',
};

const STORAGE_KEY = 'brigade_dashboard_state';

const initialState: DashboardState = {
  requests:       MOCK_REQUESTS,
  notes:          MOCK_NOTES,
  chats:          MOCK_CHATS,
  settings:       DEFAULT_SETTINGS,
  selected:       MOCK_REQUESTS[0],
  searchQuery:    '',
  showNotif:      false,
  showNewRequest: false,
  showFilter:     false,
};


function getStoredState(): DashboardState {
  if (typeof window === 'undefined') return initialState;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return initialState;
  try {
    const parsed = JSON.parse(saved);
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}


function reducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SELECT':
      return { ...state, selected: action.payload, showNotif: false };
    case 'UPDATE_STATUS': {
      const requests = state.requests.map(r =>
        r.id === action.id ? { ...r, status: action.status } : r
      );
      const selected = state.selected?.id === action.id
        ? { ...state.selected, status: action.status } : state.selected;
      return { ...state, requests, selected };
    }
    case 'UPDATE_PRICE': {
      const requests = state.requests.map(r =>
        r.id === action.id ? { ...r, estimatedPrice: action.price } : r
      );
      const selected = state.selected?.id === action.id
        ? { ...state.selected, estimatedPrice: action.price } : state.selected;
      return { ...state, requests, selected };
    }
    case 'ADD_NOTE': {
      const existing = state.notes[action.id] ?? [];
      return { ...state, notes: { ...state.notes, [action.id]: [...existing, action.note] } };
    }
    case 'ADD_REQUEST': {
      const requests = [action.payload, ...state.requests];
      // Also create a chat if it doesn't exist for this client
      const chatExists = state.chats.some(c => c.clientName === action.payload.client.name);
      let chats = state.chats;
      if (!chatExists) {
        const newChat: Chat = {
          id: 'chat_' + action.payload.id,
          clientName: action.payload.client.name,
          lastMessage: "Demande de reprise reçue",
          time: action.payload.time,
          unreadCount: 1,
          messages: [
            {
              id: 'm_init_' + action.payload.id,
              senderId: 'system',
              senderName: 'Système',
              text: `Nouvelle demande de reprise pour ${action.payload.deviceName} (${action.payload.number})`,
              time: action.payload.time,
              isMe: false,
              unread: false
            }
          ]
        };
        chats = [newChat, ...state.chats];
      }
      return { ...state, requests, chats, selected: action.payload, showNewRequest: false };
    }

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };
    case 'SET_REQUESTS':
      return { ...state, requests: action.payload, selected: action.payload[0] || state.selected };
    case 'TOGGLE_NOTIF':

      return { ...state, showNotif: !state.showNotif, showFilter: false };
    case 'TOGGLE_NEW_REQUEST':
      return { ...state, showNewRequest: !state.showNewRequest, showNotif: false };
    case 'TOGGLE_FILTER':
      return { ...state, showFilter: !state.showFilter, showNotif: false };
    case 'SEND_MESSAGE': {
      const chats = state.chats.map(c => {
        if (c.id === action.chatId) {
          const messages = [...c.messages, action.message];
          return { ...c, messages, lastMessage: action.message.text, time: action.message.time };
        }
        return c;
      });
      return { ...state, chats };
    }
    case 'MARK_CHAT_READ': {
      const chats = state.chats.map(c => 
        c.id === action.chatId ? { ...c, unreadCount: 0 } : c
      );
      return { ...state, chats };
    }
    case 'UPDATE_SETTINGS':
      return { ...state, settings: action.settings };
    default:
      return state;

  }
}

function filterRequests(requests: DeviceRequest[], query: string): DeviceRequest[] {
  if (!query.trim()) return requests;
  const q = query.toLowerCase();
  return requests.filter(r =>
    r.deviceName.toLowerCase().includes(q) ||
    r.client.name.toLowerCase().includes(q) ||
    r.client.email.toLowerCase().includes(q) ||
    r.imei.includes(q) ||
    r.number.toLowerCase().includes(q) ||
    r.color.toLowerCase().includes(q)
  );
}

export default function DashboardApp() {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    return getStoredState();
  });
  
  const [activeNav, setActiveNav] = React.useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('admin_session') === 'active';
  });
  const searchRef = useRef<HTMLInputElement>(null);


  const handleLogin = (pass: string) => {
    if (pass === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_session', 'active');
      DB.notifyAdmin('Connexion réussie', 'Bienvenue sur votre espace Brigade Mobile.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_session');
  };


  // Fetch initial data from Cloud
  useEffect(() => {
    const load = async () => {
      const requests = await DB.getRequests();
      // On dispatch une action spéciale pour charger les requêtes
      dispatch({ type: 'SET_REQUESTS', payload: requests });
    };
    load();
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      requests: state.requests,
      notes: state.notes,
      chats: state.chats,
      settings: state.settings,
      selected: state.selected
    }));
  }, [state.requests, state.notes, state.chats, state.settings, state.selected]);



  // Listen for changes from other tabs (e.g. client submissions)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newState = JSON.parse(e.newValue);
          // Only update requests and notes if they changed
          if (newState.requests) {
             // We use a manual dispatch or a simple page refresh? 
             // Let's just reload the data if it's external
             window.location.reload(); 
          }
        } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);



  const filtered = filterRequests(state.requests, state.searchQuery);
  const selected = state.selected;

  /* ⌘K / Ctrl+K focus search */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape') {
        dispatch({ type: 'TOGGLE_NOTIF' });
        searchRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSelect      = useCallback((r: DeviceRequest) => dispatch({ type: 'SELECT', payload: r }), []);
  const handleStatusChange = useCallback(async (id: string, s: RequestStatus) => {
    dispatch({ type: 'UPDATE_STATUS', id, status: s });
    // Sync with DB
    await DB.updateStatus(id, s);
  }, []);

  const handlePriceChange  = useCallback((id: string, p: number)         => dispatch({ type: 'UPDATE_PRICE',  id, price: p }), []);
  const handleAddNote = useCallback(async (id: string, note: Note) => {
    dispatch({ type: 'ADD_NOTE', id, note });
    await DB.addNote(id, note.author, note.text);
  }, []);

  const handleAddRequest = useCallback((req: DeviceRequest) => {
    dispatch({ type: 'ADD_REQUEST', payload: req });
  }, []);

  const handleSendMessage = async (chatId: string, text: string) => {
    const chat = state.chats.find(c => c.id === chatId);
    const msg: Message = { 
      id: Date.now().toString(), 
      senderId: 'admin', 
      senderName: 'Thomas', 
      text, 
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), 
      isMe: true, 
      unread: false 
    };
    dispatch({ type: 'SEND_MESSAGE', chatId, message: msg });
    
    // Sync with DB using the client email (or id if you prefer)
    if (chat) {
      // Find the request associated with this chat to get email
      const req = state.requests.find(r => r.client.name === chat.clientName);
      if (req) {
        await DB.sendMessage(req.client.email, text);
      }
    }
  };


  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="db-root" onClick={e => {

      /* close panels on outside click */
      if (!(e.target as HTMLElement).closest('.db-notif-panel, .db-btn-icon')) {
        if (state.showNotif) dispatch({ type: 'TOGGLE_NOTIF' });
      }
    }}>

      <Sidebar 
        active={activeNav} 
        onNav={setActiveNav} 
        requestCount={state.requests.length}
        unreadCount={state.chats.reduce((acc, c) => acc + c.unreadCount, 0)}
        monthlyRevenue={state.requests.reduce((acc, r) => acc + (r.status === 'completed' ? r.estimatedPrice : 0), 0)}
        shopName={state.settings.shopName}
        onLogout={handleLogout}
      />





      <div className="db-main">
        <Topbar
          searchRef={searchRef}
          searchQuery={state.searchQuery}
          onSearch={q => dispatch({ type: 'SET_SEARCH', query: q })}
          onNewRequest={() => dispatch({ type: 'TOGGLE_NEW_REQUEST' })}
          onToggleNotif={() => dispatch({ type: 'TOGGLE_NOTIF' })}
          showNotif={state.showNotif}
          title={
            activeNav === 'dashboard' ? 'Tableau de bord' :
            activeNav === 'requests' ? 'Demandes de reprise' :
            activeNav === 'devices' ? 'Gestion du catalogue' :
            activeNav === 'clients' ? 'Répertoire clients' :
            activeNav === 'messages' ? 'Messagerie' :
            activeNav === 'payments' ? 'Historique des paiements' :
            activeNav === 'stats' ? 'Analyses & Statistiques' :
            activeNav === 'settings' ? 'Paramètres système' : 'Dashboard'
          }
        />


        <div className="db-content" style={{ position: 'relative' }}>
          {activeNav === 'dashboard' && <Overview requests={state.requests} />}
          
          {activeNav === 'requests' && (
            <>
              <RequestList
                requests={filtered}
                allRequests={state.requests}
                selectedId={selected?.id ?? null}
                onSelect={handleSelect}
              />

              {/* Detail column */}
              <div className="db-detail-col">
                <div className="db-detail-topbar">
                  <span className="db-crumb">Demandes</span>
                  <span className="db-crumb-sep">›</span>
                  {selected
                    ? <span className="db-crumb-id">{selected.number}</span>
                    : <span className="db-crumb" style={{ opacity: 0.4 }}>Sélection</span>}
                  {selected && (
                    <div className="db-detail-status-row">
                      <span className={`db-status-pill ${selected.status}`}>
                        {STATUS_LABELS[selected.status]}
                      </span>
                      <select
                        className="db-status-select"
                        value={selected.status}
                        onChange={e => handleStatusChange(selected.id, e.target.value as RequestStatus)}
                      >
                        {Object.entries(STATUS_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                      <button className="db-more-btn">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="3" cy="7" r="1.2" fill="currentColor"/>
                          <circle cx="7" cy="7" r="1.2" fill="currentColor"/>
                          <circle cx="11" cy="7" r="1.2" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <div className="db-detail-scroll">
                  <AnimatePresence mode="wait">
                    {selected ? (
                      <motion.div
                        key={selected.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                      >
                        <DeviceHero
                          request={selected}
                          onPriceChange={p => handlePriceChange(selected.id, p)}
                        />
                        <div className="db-section">
                          <div className="db-section-title">État déclaré</div>
                          <DeviceConditionGrid condition={selected.condition} />
                        </div>
                        <DeviceGallery request={selected} />
                      </motion.div>
                    ) : (
                      <motion.div key="empty" className="db-empty-state"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="db-empty-icon">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
                            <rect x="4" y="1" width="12" height="18" rx="3"/>
                            <circle cx="10" cy="15.5" r="1" fill="currentColor" stroke="none"/>
                          </svg>
                        </div>
                        <div className="db-empty-title">Aucune demande sélectionnée</div>
                        <div className="db-empty-sub">Cliquez sur une demande dans la liste pour voir son détail.</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {selected && (
                  <ActionBar
                    request={selected}
                    onStatusChange={s => handleStatusChange(selected.id, s)}
                    onNav={setActiveNav}
                  />
                )}

              </div>

              {/* Client panel */}
              <AnimatePresence>
                {selected && (
                  <ClientPanel
                    key={selected.id}
                    request={selected}
                    notes={state.notes[selected.id] ?? []}
                    onAddNote={note => handleAddNote(selected.id, note)}
                  />
                )}
              </AnimatePresence>
            </>
          )}

          {activeNav === 'clients' && <ClientsManagement requests={state.requests} />}
          
          {activeNav === 'messages' && (
            <MessagesPanel 
              chats={state.chats} 
              onSendMessage={handleSendMessage}
              onMarkRead={chatId => dispatch({ type: 'MARK_CHAT_READ', chatId })}
            />
          )}


          {activeNav === 'settings' && (
            <SettingsPanel 
              settings={state.settings} 
              onUpdate={settings => dispatch({ type: 'UPDATE_SETTINGS', settings })} 
            />
          )}

          {activeNav === 'devices' && <DevicesManagement />}
          
          {activeNav === 'payments' && <PaymentsHistory requests={state.requests} />}
          
          {activeNav === 'stats' && <StatisticsView requests={state.requests} />}

          {/* Placeholder for missing views to ensure stability */}
          {['not_implemented'].includes(activeNav) && (


            <div style={{ padding: '4rem', textAlign: 'center', flex: 1, color: 'var(--db-text3)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏗️</div>
              <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>Bientôt disponible</h2>
              <p>Cette section est en cours de développement.</p>
            </div>
          )}
        </div>

      </div>

      {/* Modals */}
      <AnimatePresence>
        {state.showNewRequest && (
          <NewRequestModal
            onClose={() => dispatch({ type: 'TOGGLE_NEW_REQUEST' })}
            onSubmit={handleAddRequest}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state.showNotif && <NotificationPanel onClose={() => dispatch({ type: 'TOGGLE_NOTIF' })} />}
      </AnimatePresence>
    </div>
  );
}
