import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Chat, Message } from './types';

interface Props {
  chats: Chat[];
  onSendMessage: (chatId: string, text: string) => void;
  onMarkRead: (chatId: string) => void;
}

export default function MessagesPanel({ chats, onSendMessage, onMarkRead }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(chats[0]?.id || null);
  const [inputText, setInputText] = useState('');

  const selectedChat = chats.find(c => c.id === selectedId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedId) return;
    onSendMessage(selectedId, inputText.trim());
    setInputText('');
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onMarkRead(id);
  };

  return (
    <div style={{ display: 'flex', height: '100%', flex: 1 }}>
      {/* Sidebar List */}
      <div style={{ width: '320px', borderRight: '1px solid var(--db-border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--db-border)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Messages</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
          {chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => handleSelect(chat.id)}
              style={{
                width: '100%', padding: '1rem', borderRadius: '16px', border: 'none',
                background: selectedId === chat.id ? 'rgba(245,166,35,0.1)' : 'transparent',
                display: 'flex', gap: '0.75rem', textAlign: 'left', cursor: 'pointer',
                transition: '0.2s', marginBottom: '0.25rem'
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--db-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#000', flexShrink: 0 }}>
                {chat.clientName[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{chat.clientName}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--db-text3)' }}>{chat.time}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: chat.unreadCount > 0 ? '#fff' : 'var(--db-text3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: chat.unreadCount > 0 ? 600 : 400 }}>
                  {chat.lastMessage}
                </div>
              </div>
              {chat.unreadCount > 0 && (
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--db-accent)', color: '#000', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {chat.unreadCount}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)' }}>
        {selectedChat ? (
          <>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--db-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>{selectedChat.clientName[0]}</div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{selectedChat.clientName}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--db-green)' }}>En ligne</div>
              </div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <AnimatePresence initial={false}>
                {selectedChat.messages.map(m => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    style={{
                      alignSelf: m.isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '70%',
                      background: m.isMe ? 'var(--db-accent)' : 'var(--db-surface)',
                      color: m.isMe ? '#000' : '#fff',
                      padding: '0.75rem 1rem',
                      borderRadius: m.isMe ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{m.text}</div>
                    <div style={{ fontSize: '0.6rem', opacity: 0.6, marginTop: '4px', textAlign: m.isMe ? 'right' : 'left' }}>{m.time}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <form onSubmit={handleSend} style={{ padding: '1.5rem', background: 'var(--db-bg)' }}>
              <div style={{ display: 'flex', gap: '1rem', background: 'var(--db-surface)', padding: '0.5rem', borderRadius: '24px', border: '1px solid var(--db-border)' }}>
                <input
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Écrivez votre message..."
                  style={{ flex: 1, background: 'none', border: 'none', color: '#fff', padding: '0.5rem 1rem', outline: 'none' }}
                />
                <button type="submit" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--db-accent)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" transform="rotate(45)">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--db-text3)' }}>
            Sélectionnez une conversation pour commencer.
          </div>
        )}
      </div>
    </div>
  );
}
