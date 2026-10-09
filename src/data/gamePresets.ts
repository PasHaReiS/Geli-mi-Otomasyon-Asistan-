import { GamePreset } from '../types';

export const GAME_PRESETS: GamePreset[] = [
  {
    id: 'lands_of_jail_pro',
    name: 'Lands of Jail - 7/24 Tam Otomasyon (Ada Hakimiyeti & Farm & Goril)',
    gameTitle: 'Lands of Jail',
    descriptionTr: 'Sürgün Adası (Isle of the Banished) için eksiksiz profil: Odun, Yemek, Çelik ve Benzin maden taraması, Goril boss rallilerine katılım, kaçak/firari takibi, kalkan koruması ve hapishane reviri.',
    descriptionEn: 'Full Lands of Jail profile: Steel, Gas, Wood & Food gathering, Gorilla rallies, fugitive hunts, shield guard and infirmary.',
    activeModules: ['modules.gather', 'modules.monster', 'modules.rally', 'modules.heal', 'modules.shield_check', 'modules.train_troops', 'modules.daily_quests', 'modules.player_finder'],
    recommendedAdb: {
      gamePackage: 'com.justgame.jails',
      screenResolution: '1280x720',
      orientation: 'landscape'
    }
  },
  {
    id: 'lands_of_jail_farm',
    name: 'Lands of Jail - Süper Hızlı Kaynak Farmı (Çelik & Benzin Öncelikli)',
    gameTitle: 'Lands of Jail',
    descriptionTr: 'Hapishane karargahı (City Hall) ve Depo (Warehouse) yükseltmeleri için 4-5 kıta ile kesintisiz Çelik, Benzin ve Temel kaynak (Odun & Yemek) madenciliği.',
    descriptionEn: 'Aggressive resource farming focusing on Steel, Gas, Wood & Food for rapid City Hall progression.',
    activeModules: ['modules.gather', 'modules.heal', 'modules.shield_check'],
    recommendedAdb: {
      gamePackage: 'com.justgame.jails',
      screenResolution: '1280x720',
      orientation: 'landscape'
    }
  },
  {
    id: 'rok_farming',
    name: 'Rise of Kingdoms (RoK) - 7/24 Farm & Rally',
    gameTitle: 'Rise of Kingdoms',
    descriptionTr: 'Maksimum kaynak toplama (Maden Lv 5-7), kesintisiz Barbar Kalesi rallilerine katılım ve otomatik hastane yardımı.',
    descriptionEn: 'Max resource gathering (Tile Lv 5-7), continuous Barbarian Fort rallies and hospital care.',
    activeModules: ['modules.gather', 'modules.rally', 'modules.heal', 'modules.daily_quests'],
    recommendedAdb: {
      screenResolution: '1280x720',
      orientation: 'landscape'
    }
  },
  {
    id: 'wos_beast',
    name: 'Whiteout Survival (WOS) - Polar Beast & Gathering',
    gameTitle: 'Whiteout Survival',
    descriptionTr: 'Kutup Canavarı (Polar Beast) avı, fırın yakıt madeni toplama ve ittifak kutup ayı rallilerine 1 askerle katılım.',
    descriptionEn: 'Polar Beast hunting, furnace coal/meat gathering, and 1-troop Polar Terror rally joining.',
    activeModules: ['modules.monster', 'modules.rally', 'modules.gather', 'modules.daily_quests'],
    recommendedAdb: {
      screenResolution: '1280x720',
      orientation: 'landscape'
    }
  },
  {
    id: 'lords_mobile',
    name: 'Lords Mobile - Darknest & Monster Slaying',
    gameTitle: 'Lords Mobile',
    descriptionTr: 'Karanlık Yuva (Darknest) rallileri, canavar avlama zinciri, barış kalkanı gözetimi ve asker basımı.',
    descriptionEn: 'Darknest rallies, monster hunt energy burn, shield guard and troop training loop.',
    activeModules: ['modules.rally', 'modules.monster', 'modules.shield_check', 'modules.train_troops'],
    recommendedAdb: {
      screenResolution: '1280x720',
      orientation: 'landscape'
    }
  },
  {
    id: 'evony_boss',
    name: 'Evony: The King\'s Return - Boss Rallies & Relics',
    gameTitle: 'Evony TKR',
    descriptionTr: 'Ymir, Hydra ve Boss canavar rallilerine 1 t1 atlı ile katılma, harita kalıntı arama ve günlük stamina tüketimi.',
    descriptionEn: 'Join Ymir/Hydra boss rallies with 1 T1 cav, relic exploration, daily stamina burn.',
    activeModules: ['modules.rally', 'modules.monster', 'modules.gather'],
    recommendedAdb: {
      screenResolution: '1280x720',
      orientation: 'landscape'
    }
  }
];
