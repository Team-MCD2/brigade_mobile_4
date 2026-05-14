export type Status    = 'pending' | 'done' | 'refused' | 'review';
export type Brand     = 'apple' | 'samsung' | 'pixel' | 'autre';
export type Condition = 'Parfait état' | 'Très bon état' | 'Bon état' | 'État moyen' | 'Mauvais état';

export interface AdminRequest {
  id:          number;
  brand:       Brand;
  name:        string;
  specs:       string;
  storage:     string;
  date:        string;
  price:       string;
  status:      Status;
  statusLabel: string;
  screen:      Condition;
  body:        Condition;
  battery:     string;
  functional:  boolean;
  unlocked:    boolean;
  imei?:       string;
  client: {
    name:  string;
    email: string;
    phone: string;
  };
}

export const REQUESTS: AdminRequest[] = [
  {
    id: 1, brand: 'apple', name: 'iPhone 15 Pro Max', specs: '256 Go · Très bon état',
    storage: '256 Go', date: 'il y a 14 min', price: '420 €',
    status: 'pending', statusLabel: 'En attente',
    screen: 'Très bon état', body: 'Très bon état', battery: '91 %',
    functional: true, unlocked: true, imei: '356789012345678',
    client: { name: 'Thomas Renard', email: 'thomas.renard@gmail.com', phone: '06 12 34 56 78' },
  },
  {
    id: 2, brand: 'samsung', name: 'Galaxy S24 Ultra', specs: '512 Go · Bon état',
    storage: '512 Go', date: 'il y a 1h', price: '370 €',
    status: 'review', statusLabel: 'En cours',
    screen: 'Bon état', body: 'Très bon état', battery: '87 %',
    functional: true, unlocked: true,
    client: { name: 'Camille Morin', email: 'c.morin@outlook.fr', phone: '07 23 45 67 89' },
  },
  {
    id: 3, brand: 'pixel', name: 'Google Pixel 9 Pro', specs: '256 Go · Parfait état',
    storage: '256 Go', date: 'il y a 2h', price: '280 €',
    status: 'done', statusLabel: 'Validée',
    screen: 'Parfait état', body: 'Parfait état', battery: '95 %',
    functional: true, unlocked: true,
    client: { name: 'Lucas Bernard', email: 'lucas.b@proton.me', phone: '06 87 65 43 21' },
  },
  {
    id: 4, brand: 'apple', name: 'iPhone 14 Pro', specs: '128 Go · Bon état',
    storage: '128 Go', date: 'il y a 3h', price: '250 €',
    status: 'pending', statusLabel: 'En attente',
    screen: 'Bon état', body: 'Bon état', battery: '83 %',
    functional: true, unlocked: false,
    client: { name: 'Sophie Laurent', email: 'sophie.laurent@gmail.com', phone: '06 34 56 78 90' },
  },
  {
    id: 5, brand: 'autre', name: 'OnePlus 12', specs: '256 Go · Écran fissuré',
    storage: '256 Go', date: 'il y a 5h', price: '30 €',
    status: 'refused', statusLabel: 'Refusée',
    screen: 'Mauvais état', body: 'État moyen', battery: '76 %',
    functional: true, unlocked: true, imei: '490154203237518',
    client: { name: 'Antoine Leroy', email: 'a.leroy@gmail.com', phone: '07 11 22 33 44' },
  },
  {
    id: 6, brand: 'samsung', name: 'Galaxy S23', specs: '128 Go · Très bon état',
    storage: '128 Go', date: 'Hier, 17h42', price: '190 €',
    status: 'done', statusLabel: 'Validée',
    screen: 'Très bon état', body: 'Très bon état', battery: '89 %',
    functional: true, unlocked: true,
    client: { name: 'Marie Dubois', email: 'marie.dubois@yahoo.fr', phone: '06 55 44 33 22' },
  },
  {
    id: 7, brand: 'apple', name: 'iPhone 13 mini', specs: '128 Go · Bon état',
    storage: '128 Go', date: 'Hier, 11h15', price: '80 €',
    status: 'done', statusLabel: 'Validée',
    screen: 'Bon état', body: 'Bon état', battery: '79 %',
    functional: true, unlocked: true,
    client: { name: 'Emma Petit', email: 'emma.petit@hotmail.com', phone: '06 77 88 99 00' },
  },
  {
    id: 8, brand: 'autre', name: 'Xiaomi 14 Ultra', specs: '512 Go · Parfait état',
    storage: '512 Go', date: 'Hier, 09h03', price: '240 €',
    status: 'pending', statusLabel: 'En attente',
    screen: 'Parfait état', body: 'Parfait état', battery: '97 %',
    functional: true, unlocked: true, imei: '012345678901234',
    client: { name: 'Hugo Martin', email: 'hugo.martin@gmail.com', phone: '07 00 11 22 33' },
  },
  {
    id: 9, brand: 'pixel', name: 'Google Pixel 8 Pro', specs: '256 Go · Hors service',
    storage: '256 Go', date: '13 mai, 14h30', price: '30 €',
    status: 'refused', statusLabel: 'Refusée',
    screen: 'Mauvais état', body: 'Mauvais état', battery: 'N/A',
    functional: false, unlocked: false,
    client: { name: 'Léa Simon', email: 'lea.simon@free.fr', phone: '06 66 55 44 33' },
  },
  {
    id: 10, brand: 'apple', name: 'iPhone 15 Plus', specs: '256 Go · Très bon état',
    storage: '256 Go', date: '13 mai, 10h18', price: '310 €',
    status: 'review', statusLabel: 'En cours',
    screen: 'Très bon état', body: 'Très bon état', battery: '92 %',
    functional: true, unlocked: true,
    client: { name: 'Nathan Garcia', email: 'nathan.g@gmail.com', phone: '07 44 55 66 77' },
  },
  {
    id: 11, brand: 'autre', name: 'Motorola Edge 40 Pro', specs: '256 Go · Bon état',
    storage: '256 Go', date: '12 mai, 16h55', price: '100 €',
    status: 'done', statusLabel: 'Validée',
    screen: 'Bon état', body: 'Très bon état', battery: '85 %',
    functional: true, unlocked: true,
    client: { name: 'Chloé Roux', email: 'chloe.roux@gmail.com', phone: '06 22 33 44 55' },
  },
  {
    id: 12, brand: 'samsung', name: 'Galaxy S22 Ultra', specs: '128 Go · Très bon état',
    storage: '128 Go', date: '11 mai, 09h40', price: '175 €',
    status: 'done', statusLabel: 'Validée',
    screen: 'Très bon état', body: 'Bon état', battery: '81 %',
    functional: true, unlocked: true,
    client: { name: 'Pierre Fontaine', email: 'p.fontaine@laposte.net', phone: '07 88 77 66 55' },
  },
];
