import type { DeviceRequest, TimelineEvent, Note } from './types';

export const MOCK_REQUESTS: DeviceRequest[] = [
  {
    id: '1', number: '#1432',
    deviceName: 'iPhone 15 Pro Max', storage: '256 Go', color: 'Titane naturel', brand: 'apple',
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=800&hei=800&fmt=png-alpha',
    thumbnails: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=200&hei=200&fmt=jpeg',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-back-select?wid=200&hei=200&fmt=jpeg',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=200&hei=200&fmt=jpeg',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-back-select?wid=200&hei=200&fmt=jpeg',
    ],
    estimatedPrice: 1020, basePrice: 1200, status: 'pending',
    date: '27 mai 2025', time: '14:32',
    client: { id: 'c1', name: 'Mathieu Laurent', initials: 'ML', email: 'mathieu.laurent@email.com', phone: '06 45 78 93 21', city: 'Marseille, France', online: true },
    imei: '35209911223344', unlocked: true, warranty: false, accessories: 'Boîte d\'origine, câble',
    condition: {
      screen:     { label: 'Micro-rayures', level: 'good' },
      battery:    { label: 'Bonne (85%+)', level: 'very_good' },
      chassis:    { label: 'Très bon état', level: 'very_good' },
      camera:     { label: 'Irréprochable', level: 'perfect' },
      faceId:     { label: 'Fonctionnel', level: 'perfect' },
      functional: { label: 'Complet', level: 'perfect' },
    },
  },
  {
    id: '2', number: '#1431',
    deviceName: 'Samsung Galaxy S24 Ultra', storage: '512 Go', color: 'Titane Violet', brand: 'samsung',
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/fr/2401/gallery/fr-galaxy-s24-ultra-s928-sm-s928bzageub-thumb-539573185?$344_344_PNG$',
    thumbnails: [
      'https://images.samsung.com/is/image/samsung/p6pim/fr/2401/gallery/fr-galaxy-s24-ultra-s928-sm-s928bzageub-thumb-539573185?$344_344_PNG$',
      'https://images.samsung.com/is/image/samsung/p6pim/fr/2401/gallery/fr-galaxy-s24-ultra-s928-sm-s928bzageub-thumb-539573185?$344_344_PNG$',
    ],
    estimatedPrice: 860, basePrice: 1000, status: 'in_progress',
    date: '27 mai 2025', time: '11:05',
    client: { id: 'c2', name: 'Sophie Martin', initials: 'SM', email: 'sophie.martin@gmail.com', phone: '07 23 45 67 89', city: 'Lyon, France', online: false },
    imei: '49015420323751', unlocked: true, warranty: true, accessories: 'Câble uniquement',
    condition: {
      screen:     { label: 'Parfait état', level: 'perfect' },
      battery:    { label: 'Très bonne (90%+)', level: 'very_good' },
      chassis:    { label: 'Bon état', level: 'good' },
      camera:     { label: 'Fonctionnelle', level: 'very_good' },
      functional: { label: 'Complet', level: 'perfect' },
    },
  },
  {
    id: '3', number: '#1430',
    deviceName: 'iPhone 14', storage: '128 Go', color: 'Minuit', brand: 'apple',
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-midnight?wid=800&hei=800&fmt=png-alpha',
    thumbnails: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-midnight?wid=200&hei=200&fmt=jpeg',
    ],
    estimatedPrice: 580, basePrice: 700, status: 'pending',
    date: '27 mai 2025', time: '09:41',
    client: { id: 'c3', name: 'Lucas Bernard', initials: 'LB', email: 'lucas.b@proton.me', phone: '06 87 65 43 21', city: 'Paris, France', online: false },
    imei: '01234567890123', unlocked: false, warranty: false, accessories: 'Aucun',
    condition: {
      screen:     { label: 'Bon état', level: 'good' },
      battery:    { label: 'Bonne (82%)', level: 'good' },
      chassis:    { label: 'Quelques marques', level: 'good' },
      camera:     { label: 'Fonctionnelle', level: 'very_good' },
      functional: { label: 'Complet', level: 'perfect' },
    },
  },
  {
    id: '4', number: '#1429',
    deviceName: 'Google Pixel 8 Pro', storage: '128 Go', color: 'Noir volcanique', brand: 'google',
    imageUrl: 'https://lh3.googleusercontent.com/9Ub6MnNbMbVm-JbEJsz1A4EFiGvVc3z8bWHC3yyKjy1zU6cBaHC-Gy6PNnIIxCa9QL_0aPGF2ZWV1LkLjv0=rw-e365-w1500',
    thumbnails: [],
    estimatedPrice: 450, basePrice: 550, status: 'in_progress',
    date: '26 mai 2025', time: '16:23',
    client: { id: 'c4', name: 'Emma Petit', initials: 'EP', email: 'emma.petit@hotmail.com', phone: '06 77 88 99 00', city: 'Bordeaux, France', online: true },
    imei: '98765432109876', unlocked: true, warranty: false, accessories: 'Câble, chargeur',
    condition: {
      screen:     { label: 'Parfait état', level: 'perfect' },
      battery:    { label: 'Excellente (93%)', level: 'perfect' },
      chassis:    { label: 'Très bon état', level: 'very_good' },
      camera:     { label: 'Parfaite', level: 'perfect' },
      functional: { label: 'Complet', level: 'perfect' },
    },
  },
  {
    id: '5', number: '#1428',
    deviceName: 'iPhone 13 Pro', storage: '256 Go', color: 'Graphite', brand: 'apple',
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-graphite-select?wid=800&hei=800&fmt=png-alpha',
    thumbnails: [],
    estimatedPrice: 630, basePrice: 750, status: 'offer_sent',
    date: '26 mai 2025', time: '13:50',
    client: { id: 'c5', name: 'Antoine Leroy', initials: 'AL', email: 'a.leroy@gmail.com', phone: '07 11 22 33 44', city: 'Toulouse, France', online: false },
    imei: '11223344556677', unlocked: true, warranty: false, accessories: 'Boîte d\'origine',
    condition: {
      screen:     { label: 'Très bon état', level: 'very_good' },
      battery:    { label: 'Bonne (87%)', level: 'very_good' },
      chassis:    { label: 'Bon état', level: 'good' },
      camera:     { label: 'Fonctionnelle', level: 'very_good' },
      functional: { label: 'Complet', level: 'perfect' },
    },
  },
  {
    id: '6', number: '#1427',
    deviceName: 'Xiaomi 13T Pro', storage: '256 Go', color: 'Noir', brand: 'xiaomi',
    imageUrl: 'https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-13t-pro/pc/img1.png',
    thumbnails: [],
    estimatedPrice: 380, basePrice: 480, status: 'completed',
    date: '26 mai 2025', time: '10:22',
    client: { id: 'c6', name: 'Marie Dubois', initials: 'MD', email: 'marie.dubois@yahoo.fr', phone: '06 55 44 33 22', city: 'Nice, France', online: false },
    imei: '77665544332211', unlocked: true, warranty: true, accessories: 'Complet',
    condition: {
      screen:     { label: 'Parfait état', level: 'perfect' },
      battery:    { label: 'Excellente (96%)', level: 'perfect' },
      chassis:    { label: 'Parfait état', level: 'perfect' },
      camera:     { label: 'Parfaite', level: 'perfect' },
      functional: { label: 'Complet', level: 'perfect' },
    },
  },
];

export const MOCK_TIMELINE: Record<string, TimelineEvent[]> = {
  '1': [
    { id: 't1', label: 'Demande créée', date: '27 mai 2025', time: '14:32', type: 'created' },
    { id: 't2', label: 'Photos envoyées', date: '27 mai 2025', time: '14:33', type: 'photos' },
    { id: 't3', label: 'En attente d\'évaluation', date: '27 mai 2025', time: '14:33', type: 'evaluation' },
  ],
  '2': [
    { id: 't4', label: 'Demande créée', date: '27 mai 2025', time: '11:05', type: 'created' },
    { id: 't5', label: 'Photos envoyées', date: '27 mai 2025', time: '11:12', type: 'photos' },
    { id: 't6', label: 'Évaluation en cours', date: '27 mai 2025', time: '11:15', type: 'evaluation' },
  ],
};

export const MOCK_NOTES: Record<string, Note[]> = {
  '1': [],
  '2': [{ id: 'n1', text: 'Client très réactif, a envoyé toutes les photos rapidement.', date: '27 mai 2025', author: 'Thomas' }],
};

export const STATS = {
  monthlyRevenue: 24680,
  growth: '+10.6%',
  totalRequests: 24,
  newRequests: 6,
  inProgress: 9,
  completed: 9,
};

export const MOCK_CHATS = [
  {
    id: 'chat1',
    clientId: 'c1',
    clientName: 'Mathieu Laurent',
    lastMessage: 'D\'accord, je passe demain matin.',
    time: '14:50',
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'c1', senderName: 'Mathieu Laurent', text: 'Bonjour, l\'offre de 1020€ est-elle toujours valable ?', time: '14:45', isMe: false, unread: false },
      { id: 'm2', senderId: 'admin', senderName: 'Thomas', text: 'Bonjour Mathieu, oui l\'offre est valable 7 jours.', time: '14:48', isMe: true, unread: false },
      { id: 'm3', senderId: 'c1', senderName: 'Mathieu Laurent', text: 'D\'accord, je passe demain matin.', time: '14:50', isMe: false, unread: false },
    ]
  },
  {
    id: 'chat2',
    clientId: 'c2',
    clientName: 'Sophie Martin',
    lastMessage: 'Quels documents dois-je apporter ?',
    time: '11:20',
    unreadCount: 1,
    messages: [
      { id: 'm4', senderId: 'c2', senderName: 'Sophie Martin', text: 'Quels documents dois-je apporter ?', time: '11:20', isMe: false, unread: true },
    ]
  }
];

export const DEFAULT_SETTINGS = {
  shopName: 'Brigade Mobile Toulouse',
  adminEmail: 'contact@brigade-mobile.fr',
  margin: 15,
  minOffer: 20,
  autoValidate: false,
  theme: 'dark' as const,
};

