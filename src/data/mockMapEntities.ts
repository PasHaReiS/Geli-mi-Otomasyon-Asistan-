import { MapEntity } from '../types';

export const INITIAL_MAP_ENTITIES: MapEntity[] = [
  // Player base (Center)
  {
    id: 'base_me',
    name: 'Hapishane Karargahım (Warden Üssü)',
    tag: 'TURK',
    category: 'player',
    level: 25,
    x: 600,
    y: 600,
    status: 'Barış Kalkanı Aktif (05:42:18)',
    discoveredAt: '00:00:00'
  },
  // Targeted Enemy / Other Players
  {
    id: 'player_fatih',
    name: 'Fatih (Hedef Düşman Üssü)',
    tag: 'TURK',
    category: 'enemy',
    level: 25,
    x: 482,
    y: 618,
    status: 'Kalkansız - 4.2M Kaynak (Çelik & Benzin)',
    discoveredAt: '12:34:20'
  },
  {
    id: 'player_shadow',
    name: 'Shadow_Warden',
    tag: 'JAIL',
    category: 'enemy',
    level: 24,
    x: 740,
    y: 430,
    status: 'Garnizon: T4 Kalkan Taşıyıcılar',
    discoveredAt: '11:15:02'
  },
  {
    id: 'player_barbaros',
    name: 'Barbaros_Pasa',
    tag: 'TITAN',
    category: 'enemy',
    level: 22,
    x: 310,
    y: 850,
    status: 'Revirde Yaralı Var - %65 Nişancı',
    discoveredAt: '10:48:19'
  },
  {
    id: 'player_farm1',
    name: 'Celik_Farm_03',
    tag: 'FARM',
    category: 'enemy',
    level: 17,
    x: 530,
    y: 720,
    status: '3.2M Çelik Depoda',
    discoveredAt: '09:20:45'
  },
  {
    id: 'player_dragonslayer',
    name: 'DragonSlayer',
    tag: 'VIP',
    category: 'enemy',
    level: 25,
    x: 920,
    y: 210,
    status: '8h Barış Kalkanı Aktif',
    discoveredAt: '08:05:11'
  },
  // Resource Tiles (Odun, Yemek, Çelik, Benzin)
  {
    id: 'res_steel6',
    name: 'Seviye 6 Çelik Sahası',
    category: 'resource',
    level: 6,
    x: 380,
    y: 440,
    status: 'Boşta (1,200,000 Çelik)',
    discoveredAt: '12:01:10'
  },
  {
    id: 'res_wood6',
    name: 'Seviye 6 Odun Alanı',
    category: 'resource',
    level: 6,
    x: 820,
    y: 290,
    status: 'Boşta (1,500,000 Odun)',
    discoveredAt: '12:10:45'
  },
  {
    id: 'res_gas5',
    name: 'Seviye 5 Benzin İstasyonu',
    category: 'resource',
    level: 5,
    x: 690,
    y: 810,
    status: 'Boşta (900,000 Benzin)',
    discoveredAt: '11:45:00'
  },
  {
    id: 'res_food5',
    name: 'Seviye 5 Yemek Deposu (Çiftlik)',
    category: 'resource',
    level: 5,
    x: 410,
    y: 730,
    status: 'Boşta (1,000,000 Yemek)',
    discoveredAt: '11:12:30'
  },
  {
    id: 'res_gas4',
    name: 'Seviye 4 Benzin Rafinerisi',
    category: 'resource',
    level: 4,
    x: 210,
    y: 320,
    status: 'Nadir Kaynak (600,000 Benzin)',
    discoveredAt: '10:30:22'
  },
  // Monsters & Rallies (Lands of Jail Gorillas & Fugitives)
  {
    id: 'rally_gorilla_cyber',
    name: 'Cyber Gorilla (İttifak Rallisi)',
    category: 'rally',
    level: 5,
    x: 240,
    y: 790,
    status: 'Ralli Açık (03:45 kaldı - %100 Nişancı)',
    discoveredAt: '12:31:00'
  },
  {
    id: 'rally_gorilla_warlord',
    name: 'Warlord Gorilla (Boss Rallisi)',
    category: 'rally',
    level: 6,
    x: 880,
    y: 620,
    status: 'Ralli Açık (04:12 kaldı - Çift Sandık)',
    discoveredAt: '12:28:15'
  },
  {
    id: 'mob_primal_gorilla',
    name: 'Primal Gorilla (Lv 25 Boss)',
    category: 'monster',
    level: 25,
    x: 810,
    y: 730,
    status: 'Can %100 (50 AP - Tyron Önerilir)',
    discoveredAt: '11:58:00'
  },
  {
    id: 'mob_fugitives',
    name: 'Firari Çetesi / Kaçaklar (Lv 30)',
    category: 'monster',
    level: 30,
    x: 630,
    y: 180,
    status: 'Tehlikeli Kaçaklar (100 AP - İleri Teçhizat)',
    discoveredAt: '10:14:00'
  }
];
