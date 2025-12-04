import genshinImg from '../asset/image/Genshin.png';
import honkaiImg from '../asset/image/HSR.png';
import zzzImg from '../asset/image/ZZZ.png';
import bgGenshin from '../asset/image/BG_Genshin.jpeg';
import bgHonkai from '../asset/image/BG_HSR.png';
import bgZzz from '../asset/image/BG_ZZZ.png';
import charGenshin from '../asset/image/DurinPicture.png';
import charHonkai from '../asset/image/DurinPicture.png';
import charZzz from '../asset/image/DurinPicture.png';

// Game constants with complete data
export const GAMES = [
  {
    id: 1,
    name: 'Genshin Impact',
    image: genshinImg,
    backgroundImage: bgGenshin,
    characterImage: charGenshin,
    characterName: 'Durin',
    characterRarity: 5,
    badge: 'POPULAR',
    badgeColor: 'bg-red-600',
    description: 'Explore a vast world filled with adventure and magic',
    servers: ['Asia', 'Europe', 'America'],
    packages: [
      { id: 1, amount: '30 Primogems', price: 'Rp. 12.000', bonus: null },
      { id: 2, amount: '60 Primogems', price: 'Rp. 24.000', bonus: null },
      { id: 3, amount: '300 Primogems', special: true, price: 'Rp. 73.000', bonus: '30 extra' },
      { id: 4, amount: '980 Primogems', special: true, price: 'Rp. 239.000', bonus: '110 extra' },
      { id: 5, amount: 'Battle Pass', price: 'Rp. 90.000', bonus: null },
      { id: 6, amount: 'Welkin Moon', price: 'Rp. 180.000', bonus: '300 total' },
    ],
  },
  {
    id: 2,
    name: 'Honkai Star Rail',
    image: honkaiImg,
    backgroundImage: bgHonkai,
    characterImage: charGenshin,
    characterName: 'Seele',
    characterRarity: 5,
    badge: 'NEW',
    badgeColor: 'bg-purple-600',
    description: 'Journey through the stars and save the universe',
    servers: ['Global', 'Asia', 'Bilibili'],
    packages: [
      { id: 1, amount: '20 Stellar Jade', price: 'Rp. 15.000', bonus: null },
      { id: 2, amount: '50 Stellar Jade', price: 'Rp. 45.000', bonus: null },
      { id: 3, amount: '300 Stellar Jade', special: true, price: 'Rp. 200.000', bonus: '30 extra' },
      { id: 4, amount: 'Welkin Moon', price: 'Rp. 65.000', bonus: null },
      { id: 5, amount: 'Battle Pass', price: 'Rp. 85.000', bonus: null },
    ],
  },
  {
    id: 3,
    name: 'Zenless Zone Zero',
    image: zzzImg,
    backgroundImage: bgZzz,
    characterImage: charGenshin,
    characterName: 'Ellen Joe',
    characterRarity: 5,
    badge: 'TRENDING',
    badgeColor: 'bg-yellow-600',
    description: 'Enter a mysterious world and uncover its secrets',
    servers: ['Global', 'China', 'Asia'],
    packages: [
      { id: 1, amount: '30 Polychrome', price: 'Rp. 20.000', bonus: null },
      { id: 2, amount: '100 Polychrome', price: 'Rp. 65.000', bonus: null },
      { id: 3, amount: '500 Polychrome', special: true, price: 'Rp. 300.000', bonus: '50 extra' },
      { id: 4, amount: 'Battle Pass', price: 'Rp. 80.000', bonus: null },
    ],
  },
];

// Payment methods
export const PAYMENT_METHODS = [
  { id: 1, name: 'Bank Transfer', icon: '🏦', available: true },
  { id: 2, name: 'E-Wallet', icon: '💳', available: true },
  { id: 3, name: 'Credit Card', icon: '💰', available: true },
  { id: 4, name: 'QRIS', icon: '📱', available: true },
];

// Navigation items
export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'shop', label: 'Shop', icon: '🛍️' },
  { id: 'transaction', label: 'Transactions', icon: '📋' },
  { id: 'account', label: 'Account', icon: '👤' },
];

// Admin nav items (only for admins)
export const ADMIN_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'games', label: 'Games', icon: '🎮' },
  { id: 'orders', label: 'Orders', icon: '📦' },
];

// Server configurations
export const SERVERS = {
  'Genshin Impact': ['Asia', 'Europe', 'America', 'TW/HK/MO'],
  'Honkai Star Rail': ['Global', 'Asia', 'Bilibili'],
  'Zenless Zone Zero': ['Global', 'China', 'Asia'],
};

// Currency symbol
export const CURRENCY = 'Rp.';

// App configuration
export const APP_CONFIG = {
  name: 'Game Recharge Store',
  version: '1.0.0',
  supportEmail: 'support@gamerecharge.com',
  phoneNumber: '+62-XXX-XXXX-XXXX',
}