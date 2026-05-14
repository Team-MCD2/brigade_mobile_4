export type RequestStatus = 'pending' | 'in_progress' | 'offer_sent' | 'completed' | 'refused';
export type ConditionLevel = 'perfect' | 'very_good' | 'good' | 'fair' | 'bad';

export interface DeviceCondition {
  screen: { label: string; level: ConditionLevel };
  battery: { label: string; level: ConditionLevel };
  chassis: { label: string; level: ConditionLevel };
  camera: { label: string; level: ConditionLevel };
  faceId?: { label: string; level: ConditionLevel };
  functional: { label: string; level: ConditionLevel };
}

export interface Client {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  city: string;
  online: boolean;
}

export interface DeviceRequest {
  id: string;
  number: string;
  deviceName: string;
  storage: string;
  color: string;
  brand: 'apple' | 'samsung' | 'google' | 'xiaomi' | 'other';
  imageUrl: string;
  thumbnails: string[];
  estimatedPrice: number;
  basePrice: number;
  status: RequestStatus;
  date: string;
  time: string;
  client: Client;
  imei: string;
  unlocked: boolean;
  warranty: boolean;
  accessories: string;
  condition: DeviceCondition;
}

export interface TimelineEvent {
  id: string;
  label: string;
  date: string;
  time: string;
  type: 'created' | 'photos' | 'evaluation' | 'offer' | 'completed';
}

export interface Note {
  id: string;
  text: string;
  date: string;
  author: string;
}

export type TabKey = 'all' | 'new' | 'in_progress' | 'to_validate' | 'completed';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  time: string;
  isMe: boolean;
  unread: boolean;
}

export interface Chat {
  id: string;
  clientId: string;
  clientName: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  messages: Message[];
}

export interface DashboardSettings {
  shopName: string;
  adminEmail: string;
  margin: number;
  minOffer: number;
  autoValidate: boolean;
  theme: 'dark' | 'light';
}

export interface DashboardState {
  requests: DeviceRequest[];
  notes: Record<string, Note[]>;
  chats: Chat[];
  settings: DashboardSettings;
  selected: DeviceRequest | null;
  searchQuery: string;
  showNotif: boolean;
  showNewRequest: boolean;
  showFilter: boolean;
}

export type DashboardAction =
  | { type: 'SELECT'; payload: DeviceRequest | null }
  | { type: 'UPDATE_STATUS'; id: string; status: RequestStatus }
  | { type: 'UPDATE_PRICE'; id: string; price: number }
  | { type: 'ADD_NOTE'; id: string; note: Note }
  | { type: 'ADD_REQUEST'; payload: DeviceRequest }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'SET_REQUESTS'; payload: DeviceRequest[] }
  | { type: 'TOGGLE_NOTIF' }

  | { type: 'TOGGLE_NEW_REQUEST' }
  | { type: 'TOGGLE_FILTER' }
  | { type: 'SEND_MESSAGE'; chatId: string; message: Message }
  | { type: 'UPDATE_SETTINGS'; settings: DashboardSettings }
  | { type: 'MARK_CHAT_READ'; chatId: string };

