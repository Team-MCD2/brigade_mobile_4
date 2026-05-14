export interface StorageOption {
  capacity: string;
  marketPrice: number;
}

export interface PhoneModel {
  id: string;
  name: string;
  storages: StorageOption[];
}

export interface PhoneBrand {
  id: string;
  name: string;
  models: PhoneModel[];
}

export const BRIGADE_MARGIN = 200;
export const MIN_OFFER = 30;

export const SCREEN_DEDUCTIONS: Record<string, number> = {
  perfect: 0,
  good: 20,
  fair: 55,
  poor: 100,
};

export const BODY_DEDUCTIONS: Record<string, number> = {
  perfect: 0,
  good: 10,
  fair: 35,
  poor: 65,
};

export const BATTERY_DEDUCTIONS: Record<string, number> = {
  good: 0,
  degraded: 25,
  bad: 45,
};

export function calculateOffer(
  marketPrice: number,
  screen: string,
  body: string,
  battery: string,
  functional: boolean
): number {
  const deductions =
    (SCREEN_DEDUCTIONS[screen] ?? 0) +
    (BODY_DEDUCTIONS[body] ?? 0) +
    (BATTERY_DEDUCTIONS[battery] ?? 0) +
    (functional ? 0 : 60);
  return Math.max(marketPrice - BRIGADE_MARGIN - deductions, MIN_OFFER);
}

export const brands: PhoneBrand[] = [
  {
    id: 'apple',
    name: 'Apple iPhone',
    models: [
      { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max', storages: [
        { capacity: '256 Go', marketPrice: 850 },
        { capacity: '512 Go', marketPrice: 950 },
        { capacity: '1 To',   marketPrice: 1050 },
      ]},
      { id: 'iphone-15-pro', name: 'iPhone 15 Pro', storages: [
        { capacity: '128 Go', marketPrice: 720 },
        { capacity: '256 Go', marketPrice: 800 },
        { capacity: '512 Go', marketPrice: 880 },
      ]},
      { id: 'iphone-15-plus', name: 'iPhone 15 Plus', storages: [
        { capacity: '128 Go', marketPrice: 580 },
        { capacity: '256 Go', marketPrice: 650 },
      ]},
      { id: 'iphone-15', name: 'iPhone 15', storages: [
        { capacity: '128 Go', marketPrice: 530 },
        { capacity: '256 Go', marketPrice: 600 },
      ]},
      { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', storages: [
        { capacity: '128 Go', marketPrice: 660 },
        { capacity: '256 Go', marketPrice: 720 },
        { capacity: '512 Go', marketPrice: 800 },
        { capacity: '1 To',   marketPrice: 880 },
      ]},
      { id: 'iphone-14-pro', name: 'iPhone 14 Pro', storages: [
        { capacity: '128 Go', marketPrice: 560 },
        { capacity: '256 Go', marketPrice: 620 },
        { capacity: '512 Go', marketPrice: 700 },
      ]},
      { id: 'iphone-14-plus', name: 'iPhone 14 Plus', storages: [
        { capacity: '128 Go', marketPrice: 440 },
        { capacity: '256 Go', marketPrice: 500 },
      ]},
      { id: 'iphone-14', name: 'iPhone 14', storages: [
        { capacity: '128 Go', marketPrice: 400 },
        { capacity: '256 Go', marketPrice: 460 },
        { capacity: '512 Go', marketPrice: 530 },
      ]},
      { id: 'iphone-13-pro-max', name: 'iPhone 13 Pro Max', storages: [
        { capacity: '128 Go', marketPrice: 520 },
        { capacity: '256 Go', marketPrice: 580 },
        { capacity: '512 Go', marketPrice: 650 },
      ]},
      { id: 'iphone-13-pro', name: 'iPhone 13 Pro', storages: [
        { capacity: '128 Go', marketPrice: 440 },
        { capacity: '256 Go', marketPrice: 490 },
      ]},
      { id: 'iphone-13', name: 'iPhone 13', storages: [
        { capacity: '128 Go', marketPrice: 350 },
        { capacity: '256 Go', marketPrice: 400 },
        { capacity: '512 Go', marketPrice: 450 },
      ]},
      { id: 'iphone-13-mini', name: 'iPhone 13 mini', storages: [
        { capacity: '128 Go', marketPrice: 290 },
        { capacity: '256 Go', marketPrice: 330 },
      ]},
      { id: 'iphone-12-pro-max', name: 'iPhone 12 Pro Max', storages: [
        { capacity: '128 Go', marketPrice: 380 },
        { capacity: '256 Go', marketPrice: 420 },
        { capacity: '512 Go', marketPrice: 480 },
      ]},
      { id: 'iphone-12-pro', name: 'iPhone 12 Pro', storages: [
        { capacity: '128 Go', marketPrice: 310 },
        { capacity: '256 Go', marketPrice: 350 },
      ]},
      { id: 'iphone-12', name: 'iPhone 12', storages: [
        { capacity: '64 Go',  marketPrice: 240 },
        { capacity: '128 Go', marketPrice: 270 },
        { capacity: '256 Go', marketPrice: 310 },
      ]},
      { id: 'iphone-11-pro-max', name: 'iPhone 11 Pro Max', storages: [
        { capacity: '64 Go',  marketPrice: 260 },
        { capacity: '256 Go', marketPrice: 300 },
      ]},
      { id: 'iphone-11', name: 'iPhone 11', storages: [
        { capacity: '64 Go',  marketPrice: 180 },
        { capacity: '128 Go', marketPrice: 200 },
        { capacity: '256 Go', marketPrice: 230 },
      ]},
    ],
  },
  {
    id: 'samsung',
    name: 'Samsung Galaxy S',
    models: [
      { id: 's24-ultra', name: 'Galaxy S24 Ultra', storages: [
        { capacity: '256 Go', marketPrice: 740 },
        { capacity: '512 Go', marketPrice: 830 },
        { capacity: '1 To',   marketPrice: 920 },
      ]},
      { id: 's24-plus', name: 'Galaxy S24+', storages: [
        { capacity: '256 Go', marketPrice: 560 },
        { capacity: '512 Go', marketPrice: 640 },
      ]},
      { id: 's24', name: 'Galaxy S24', storages: [
        { capacity: '128 Go', marketPrice: 440 },
        { capacity: '256 Go', marketPrice: 500 },
      ]},
      { id: 's23-ultra', name: 'Galaxy S23 Ultra', storages: [
        { capacity: '256 Go', marketPrice: 580 },
        { capacity: '512 Go', marketPrice: 660 },
      ]},
      { id: 's23-plus', name: 'Galaxy S23+', storages: [
        { capacity: '256 Go', marketPrice: 430 },
        { capacity: '512 Go', marketPrice: 500 },
      ]},
      { id: 's23', name: 'Galaxy S23', storages: [
        { capacity: '128 Go', marketPrice: 350 },
        { capacity: '256 Go', marketPrice: 410 },
      ]},
      { id: 's22-ultra', name: 'Galaxy S22 Ultra', storages: [
        { capacity: '128 Go', marketPrice: 420 },
        { capacity: '256 Go', marketPrice: 480 },
        { capacity: '512 Go', marketPrice: 560 },
      ]},
      { id: 's22-plus', name: 'Galaxy S22+', storages: [
        { capacity: '128 Go', marketPrice: 330 },
        { capacity: '256 Go', marketPrice: 380 },
      ]},
      { id: 's22', name: 'Galaxy S22', storages: [
        { capacity: '128 Go', marketPrice: 270 },
        { capacity: '256 Go', marketPrice: 310 },
      ]},
      { id: 's21-ultra', name: 'Galaxy S21 Ultra', storages: [
        { capacity: '128 Go', marketPrice: 320 },
        { capacity: '256 Go', marketPrice: 370 },
        { capacity: '512 Go', marketPrice: 430 },
      ]},
      { id: 's21', name: 'Galaxy S21', storages: [
        { capacity: '128 Go', marketPrice: 220 },
        { capacity: '256 Go', marketPrice: 255 },
      ]},
    ],
  },
  {
    id: 'pixel',
    name: 'Google Pixel',
    models: [
      { id: 'pixel-9-pro-xl', name: 'Pixel 9 Pro XL', storages: [
        { capacity: '128 Go', marketPrice: 620 },
        { capacity: '256 Go', marketPrice: 700 },
        { capacity: '512 Go', marketPrice: 780 },
      ]},
      { id: 'pixel-9-pro', name: 'Pixel 9 Pro', storages: [
        { capacity: '128 Go', marketPrice: 540 },
        { capacity: '256 Go', marketPrice: 610 },
      ]},
      { id: 'pixel-9', name: 'Pixel 9', storages: [
        { capacity: '128 Go', marketPrice: 420 },
        { capacity: '256 Go', marketPrice: 490 },
      ]},
      { id: 'pixel-8-pro', name: 'Pixel 8 Pro', storages: [
        { capacity: '128 Go', marketPrice: 430 },
        { capacity: '256 Go', marketPrice: 490 },
        { capacity: '512 Go', marketPrice: 560 },
      ]},
      { id: 'pixel-8', name: 'Pixel 8', storages: [
        { capacity: '128 Go', marketPrice: 340 },
        { capacity: '256 Go', marketPrice: 400 },
      ]},
      { id: 'pixel-7-pro', name: 'Pixel 7 Pro', storages: [
        { capacity: '128 Go', marketPrice: 310 },
        { capacity: '256 Go', marketPrice: 360 },
      ]},
      { id: 'pixel-7', name: 'Pixel 7', storages: [
        { capacity: '128 Go', marketPrice: 250 },
        { capacity: '256 Go', marketPrice: 290 },
      ]},
      { id: 'pixel-6-pro', name: 'Pixel 6 Pro', storages: [
        { capacity: '128 Go', marketPrice: 220 },
        { capacity: '256 Go', marketPrice: 260 },
      ]},
      { id: 'pixel-6', name: 'Pixel 6', storages: [
        { capacity: '128 Go', marketPrice: 180 },
        { capacity: '256 Go', marketPrice: 210 },
      ]},
    ],
  },
  {
    id: 'autre',
    name: 'Autre modèle',
    models: [
      { id: 'oneplus-12', name: 'OnePlus 12', storages: [
        { capacity: '256 Go', marketPrice: 460 },
        { capacity: '512 Go', marketPrice: 530 },
      ]},
      { id: 'oneplus-11', name: 'OnePlus 11', storages: [
        { capacity: '128 Go', marketPrice: 320 },
        { capacity: '256 Go', marketPrice: 380 },
      ]},
      { id: 'xiaomi-14-ultra', name: 'Xiaomi 14 Ultra', storages: [
        { capacity: '256 Go', marketPrice: 520 },
        { capacity: '512 Go', marketPrice: 600 },
      ]},
      { id: 'xiaomi-14', name: 'Xiaomi 14', storages: [
        { capacity: '256 Go', marketPrice: 380 },
        { capacity: '512 Go', marketPrice: 450 },
      ]},
      { id: 'xiaomi-13', name: 'Xiaomi 13', storages: [
        { capacity: '128 Go', marketPrice: 270 },
        { capacity: '256 Go', marketPrice: 310 },
      ]},
      { id: 'oppo-find-x7', name: 'OPPO Find X7 Ultra', storages: [
        { capacity: '256 Go', marketPrice: 500 },
        { capacity: '512 Go', marketPrice: 580 },
      ]},
      { id: 'motorola-edge-40', name: 'Motorola Edge 40 Pro', storages: [
        { capacity: '256 Go', marketPrice: 320 },
      ]},
    ],
  },
];
