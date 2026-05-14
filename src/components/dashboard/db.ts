import type { DeviceRequest, DashboardSettings, Chat, Note, Message } from './types';

export const DB = {
  /**
   * RÉCUPÉRER LES DEMANDES
   */
  async getRequests(): Promise<DeviceRequest[]> {
    try {
      const resp = await fetch('/api/dashboard?action=getRequests');
      const data = await resp.json();
      
      return (data || []).map((r: any) => ({
        id: r.id,
        number: `#${r.id.toString().slice(-4)}`,
        deviceName: r.device_name,
        storage: r.storage,
        color: r.color || 'Non spécifié',
        brand: r.brand,
        imageUrl: '', 
        thumbnails: [],
        estimatedPrice: r.estimated_price,
        basePrice: r.estimated_price * 1.2,
        status: r.status,
        date: new Date(r.created_at).toLocaleDateString('fr-FR'),
        time: new Date(r.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        client: {
          id: 'c' + r.id,
          name: r.client_name,
          initials: r.client_name.split(' ').map((n:any) => n[0]).join('').toUpperCase(),
          email: r.client_email,
          phone: r.client_phone,
          city: r.client_city,
          online: false
        },
        imei: '',
        unlocked: true,
        warranty: false,
        accessories: 'Non spécifié',
        condition: {
          screen: { label: 'Non spécifié', level: 'good' },
          battery: { label: 'Non spécifié', level: 'good' },
          chassis: { label: 'Non spécifié', level: 'good' },
          camera: { label: 'Non spécifié', level: 'good' },
          functional: { label: 'Non spécifié', level: 'good' },
        }
      }));
    } catch (e) {
      console.warn('API error, fallback to local:', e);
      const saved = localStorage.getItem('brigade_dashboard_state');
      return saved ? JSON.parse(saved).requests || [] : [];
    }
  },

  async updateStatus(id: string, status: string): Promise<void> {
    await fetch('/api/dashboard', {
      method: 'POST',
      body: JSON.stringify({ action: 'updateStatus', payload: { id, status } })
    });
  },

  async getNotes(repriseId: string): Promise<Note[]> {
    const resp = await fetch(`/api/dashboard?action=getNotes&id=${repriseId}`);
    const data = await resp.json();
    return (data || []).map((n: any) => ({
      id: n.id,
      author: n.author,
      text: n.text,
      time: new Date(n.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }));
  },

  async addNote(repriseId: string, author: string, text: string): Promise<void> {
    await fetch('/api/dashboard', {
      method: 'POST',
      body: JSON.stringify({ action: 'addNote', payload: { reprise_id: repriseId, author, text } })
    });
  },

  async getMessages(email: string): Promise<Message[]> {
    const resp = await fetch(`/api/dashboard?action=getMessages&email=${email}`);
    const data = await resp.json();
    return (data || []).map((m: any) => ({
      id: m.id,
      senderId: m.sender_role,
      senderName: m.sender_role === 'admin' ? 'Thomas' : 'Client',
      text: m.text,
      time: new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isMe: m.sender_role === 'admin',
      unread: !m.is_read
    }));
  },

  async sendMessage(email: string, text: string): Promise<void> {
    await fetch('/api/dashboard', {
      method: 'POST',
      body: JSON.stringify({ action: 'sendMessage', payload: { client_email: email, sender_role: 'admin', text } })
    });
  },

  async login(email: string, password: string): Promise<boolean> {
    // Simple admin check for now
    return password === 'admin123';
  },

  /**
   * ENVOYER UNE PHOTO SUR LE CLOUD
   * Note: On utilise un FormData pour l'envoi de fichier vers l'API
   */
  async uploadPhoto(file: File, clientEmail: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', clientEmail);
    formData.append('action', 'uploadPhoto');

    const resp = await fetch('/api/dashboard', {
      method: 'POST',
      body: formData
    });
    const data = await resp.json();
    return data.url;
  },

  async notifyAdmin(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }
};





