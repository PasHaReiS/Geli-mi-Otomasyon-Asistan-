import { TaskModule } from '../types';

export const INITIAL_MODULES: TaskModule[] = [
  {
    id: 'modules.gather',
    nameTr: 'Kaynak Toplama (Gather)',
    nameEn: 'Resource Gathering',
    category: 'gathering',
    descriptionTr: 'Haritadaki boş kaynak alanlarını (Odun, Yemek, Çelik, Benzin) tarar, kıtaları otomatik gönderir ve dolunca geri çağırır.',
    descriptionEn: 'Scans map for resource tiles (Wood, Food, Steel, Gas), dispatches marches and recalls them.',
    enabled: true,
    intervalSec: 4,
    runCount: 0,
    successCount: 0,
    errorCount: 0,
    cooldownRemaining: 0,
    params: [
      {
        id: 'resource_types',
        nameTr: 'Öncelikli Kaynak Türleri',
        nameEn: 'Priority Resource Types',
        type: 'select',
        value: 'steel_gas',
        options: [
          { labelTr: 'Çelik & Benzin (Dengeli / İleri Seviye)', labelEn: 'Steel & Gas (Balanced / High Tier)', value: 'steel_gas' },
          { labelTr: 'Tüm Kaynaklar (Odun, Yemek, Çelik, Benzin)', labelEn: 'All Resources (Wood, Food, Steel, Gas)', value: 'all' },
          { labelTr: 'Sadece Temel Kaynaklar (Odun & Yemek)', labelEn: 'Basic Resources (Wood & Food)', value: 'wood_food' },
          { labelTr: 'Sadece Benzin / Yakıt İstasyonları', labelEn: 'Gas / Fuel Stations Only', value: 'gas_only' }
        ],
        descriptionTr: 'Botun haritada arayacağı öncelikli kaynak türleri.'
      },
      {
        id: 'min_tile_level',
        nameTr: 'Minimum Maden Seviyesi',
        nameEn: 'Min Tile Level',
        type: 'number',
        value: 5,
        min: 1,
        max: 8,
        step: 1,
        unit: 'Lv',
        descriptionTr: 'Düşük seviyeli madenlere kıta harcamaz.'
      },
      {
        id: 'max_marches',
        nameTr: 'Kullanılacak Kıta Sayısı',
        nameEn: 'Max Gathering Marches',
        type: 'range',
        value: 4,
        min: 1,
        max: 6,
        step: 1,
        unit: 'Kıta',
        descriptionTr: 'Toplama için ayrılacak maksimum aktif birlik sayısı.'
      },
      {
        id: 'alliance_territory_only',
        nameTr: 'Sadece İttifak Bölgesinde Topla (+%25 Hız)',
        nameEn: 'Alliance Territory Only (+25% Speed)',
        type: 'boolean',
        value: true,
        descriptionTr: 'Saldırı riskini azaltmak ve ittifak toplama bonusunu almak için kısıtlar.'
      }
    ],
    pythonCodeSnippet: `# modules/gather.py
import time
import logging
from adb_controller import adb

logger = logging.getLogger("modules.gather")

def calistir():
    """
    Kaynak Toplama Modülü:
    1. Boş kıta var mı kontrol eder.
    2. Haritada belirlenen seviyedeki madeni arar.
    3. Uygun madene tıklayıp 'Topla' butonuna basar ve kıtayı yollar.
    """
    logger.info("Kaynak toplama modülü çalıştırılıyor...")
    
    # 1. Boş kıta kontrolü
    bos_kita_sayisi = adb.bos_kitalari_say()
    if bos_kita_sayisi <= 0:
        logger.info("Tüm kıtalar dolu, toplama bekleniyor.")
        return False
        
    logger.info(f"{bos_kita_sayisi} adet boş kıta tespit edildi. Maden aranıyor...")
    
    # 2. Kaynak arama (Odun, Yemek, Çelik, Benzin)
    kaynak_konumu = adb.haritada_kaynak_bul(seviye=5, tur="celik")
    if not kaynak_konumu:
        logger.warning("Uygun kaynak alanı (Çelik/Benzin) bulunamadı, harita kaydırılıyor...")
        adb.haritayi_kaydir(yon="sag", piksel=300)
        return False
        
    # 3. Kıtayı yola çıkar
    adb.dokun(kaynak_konumu[0], kaynak_konumu[1])
    time.sleep(1)
    adb.dokun_sablon("btn_topla.png")
    time.sleep(1)
    adb.dokun_sablon("btn_yuru.png")
    
    logger.info(f"Kıta madene başarıyla gönderildi: {maden_konumu}")
    return True
`
  },
  {
    id: 'modules.monster',
    nameTr: 'Goril & Firari Avı (Monster / Gorilla Hunt)',
    nameEn: 'Gorilla & Fugitive Hunt',
    category: 'combat',
    descriptionTr: 'Enerji (Stamina/AP) yeterliyse haritada Cyber/Primal Gorilleri ve Kaçak Firarileri tarar, kahramanları (Tyron, Phoenix, Inata) seçip otomatik saldırır.',
    descriptionEn: 'Searches for Cyber/Primal Gorillas and Fugitives on the Isle of the Banished, dispatches heroes and attacks.',
    enabled: true,
    intervalSec: 5,
    runCount: 0,
    successCount: 0,
    errorCount: 0,
    cooldownRemaining: 0,
    params: [
      {
        id: 'monster_level',
        nameTr: 'Hedef Goril / Yaratık Seviyesi',
        nameEn: 'Target Gorilla / Monster Level',
        type: 'number',
        value: 25,
        min: 1,
        max: 40,
        step: 1,
        unit: 'Lv',
        descriptionTr: 'Saldırılacak Goril Boss veya Firari hedef seviyesi.'
      },
      {
        id: 'min_stamina',
        nameTr: 'Minimum Enerji Sınırı',
        nameEn: 'Min Stamina Threshold',
        type: 'range',
        value: 50,
        min: 10,
        max: 100,
        step: 5,
        unit: 'AP',
        descriptionTr: 'Enerji bu değerin altına düşerse Goril avını durdurur.'
      },
      {
        id: 'auto_use_potions',
        nameTr: 'Otomatik Enerji İksiri Kullan',
        nameEn: 'Auto Use AP Potions',
        type: 'boolean',
        value: false,
        descriptionTr: 'Enerji bittiğinde çantadaki 50/100 AP iksirlerini harcar.'
      },
      {
        id: 'commander_preset',
        nameTr: 'Kahraman / Birlik Tercihi',
        nameEn: 'Hero / Troop Setup',
        type: 'select',
        value: 'preset_1',
        options: [
          { labelTr: '1. Takım (Tyron & Phoenix - Yüksek Hasar)', labelEn: 'Team 1 (Tyron & Phoenix - High DPS)', value: 'preset_1' },
          { labelTr: '2. Takım (Inata - Dayanıklılık & Can)', labelEn: 'Team 2 (Inata - High HP & Sustain)', value: 'preset_2' },
          { labelTr: 'Son Kullanılan Kahraman Takımı (Varsayılan)', labelEn: 'Last Used Hero Team (Default)', value: 'last_used' }
        ]
      }
    ],
    pythonCodeSnippet: `# modules/monster.py
import time
import logging
from adb_controller import adb

logger = logging.getLogger("modules.monster")

def calistir():
    """
    Lands of Jail - Goril & Firari Avı Modülü:
    1. Stamina (AP) yeterli mi kontrol eder.
    2. Haritada Cyber/Primal Gorilla veya Firari arar.
    3. Kahraman takımıyla (Tyron/Phoenix) saldırı başlatır.
    """
    logger.info("Goril ve firari avı modülü kontrol ediliyor...")
    
    # 1. Enerji Kontrolü
    mevcut_enerji = adb.ocr_enerji_oku()
    if mevcut_enerji < 50:
        logger.info(f"Yetersiz enerji ({mevcut_enerji} AP < 50 AP). Goril avı pas geçildi.")
        return False
        
    # 2. Haritada Arama butonu ve Goril seçimi
    adb.dokun_sablon("btn_arama.png")
    time.sleep(0.8)
    adb.dokun_sablon("sekme_goril.png")
    adb.seviye_ayarla(seviye=25)
    adb.dokun_sablon("btn_ara.png")
    time.sleep(1.5)
    
    # 3. Hedefe saldır
    if adb.sablon_mevcut_mu("btn_saldir.png"):
        adb.dokun_sablon("btn_saldir.png")
        time.sleep(0.8)
        adb.dokun_sablon("btn_yeni_birlik.png")
        time.sleep(0.8)
        adb.dokun_sablon("btn_yuru.png")
        logger.info("Cyber Goril'e saldırı başarıyla başlatıldı!")
        return True
        
    logger.warning("Hedef goril bulunamadı veya mesafe çok uzak.")
    return False
`
  },
  {
    id: 'modules.rally',
    nameTr: 'İttifak Rallisi Katılımı (Goril & Boss Rallisi)',
    nameEn: 'Auto Rally Joiner (Gorillas & Forts)',
    category: 'alliance',
    descriptionTr: 'İttifak üyelerinin açtığı Goril Boss (Cyber, Armed, Warlord Gorilla) veya düşman baskın rallilerini algılar, 1 asker veya nişancı birliği ile katılır.',
    descriptionEn: 'Detects alliance rallies (Cyber Gorillas, Warlord Gorillas) and joins with 1-troop or shooter formations.',
    enabled: true,
    intervalSec: 3,
    runCount: 0,
    successCount: 0,
    errorCount: 0,
    cooldownRemaining: 0,
    params: [
      {
        id: 'rally_duration_filter',
        nameTr: 'Kabul Edilen Ralli Süreleri',
        nameEn: 'Accepted Rally Duration',
        type: 'select',
        value: '5m_10m',
        options: [
          { labelTr: 'Sadece 5 dk & 10 dk Ralliler (Önerilen)', labelEn: '5 min & 10 min only (Recommended)', value: '5m_10m' },
          { labelTr: 'Tüm Ralliler (5dk, 10dk, 30dk, 60dk)', labelEn: 'All Rallies (5m, 10m, 30m, 60m)', value: 'all' },
          { labelTr: 'Sadece 5 dakikalık hızlı ralliler', labelEn: '5 min quick rallies only', value: '5m' }
        ]
      },
      {
        id: 'troop_mode',
        nameTr: 'Kıta Asker Miktarı & Formasyon',
        nameEn: 'Troop Dispatch Mode',
        type: 'select',
        value: 'single_troop',
        options: [
          { labelTr: '1 Asker Gönder (Sıfır kayıp, tam sandık & çip)', labelEn: 'Send 1 Troop (Zero loss, full rewards)', value: 'single_troop' },
          { labelTr: 'Nişancı Birliği (%65 Nişancı, %35 Bombacı - Boss Hasarı)', labelEn: 'Shooter Focus (65% Shooter, 35% Bomber)', value: 'shooters_heavy' },
          { labelTr: 'Dengeli Tam Kıta (%20 Kalkan, %30 Bombacı, %50 Nişancı)', labelEn: 'Balanced Full March (20% Shield, 30% Bomb, 50% Shoot)', value: 'full_march' }
        ],
        descriptionTr: '1 asker modu sıfır kayıpla tam ralli sandığı ve etkinlik puanı kazandırır.'
      },
      {
        id: 'max_concurrent_rallies',
        nameTr: 'Aynı Anda Katılınacak Max Ralli',
        nameEn: 'Max Concurrent Rallies',
        type: 'range',
        value: 2,
        min: 1,
        max: 4,
        step: 1,
        unit: 'Ralli'
      },
      {
        id: 'min_fort_level',
        nameTr: 'Minimum Goril / Boss Seviyesi',
        nameEn: 'Min Gorilla / Boss Level',
        type: 'number',
        value: 4,
        min: 1,
        max: 10,
        step: 1,
        unit: 'Lv'
      }
    ],
    pythonCodeSnippet: `# modules/rally.py
import time
import logging
from adb_controller import adb

logger = logging.getLogger("modules.rally")

def calistir():
    """
    İttifak Rallisi Katılım Modülü:
    1. İttifak savaş ekranını açar.
    2. Aktif barbar kalesi veya canavar rallilerini tarar.
    3. Katıl butonuna basar, 1 asker ayarlar ve kıtayı gönderir.
    """
    logger.info("İttifak rallileri taranıyor...")
    
    # 1. İttifak Savaş Menüsü
    adb.dokun_sablon("btn_ittifak.png")
    time.sleep(0.7)
    adb.dokun_sablon("btn_savaslar.png")
    time.sleep(1.0)
    
    # 2. Katılabilir ralli tespiti
    ralliler = adb.sablon_tumunu_bul("btn_katil.png")
    if not ralliler:
        logger.info("Şu anda katılabilecek açık ralli bulunamadı.")
        adb.geri_tusuna_bas()
        return False
        
    logger.info(f"{len(ralliler)} adet aktif ralli bulundu. İlkine katılınıyor...")
    ilk_ralli = ralliler[0]
    adb.dokun(ilk_ralli[0], ilk_ralli[1])
    time.sleep(1.0)
    
    # 3. 1 Asker modu
    adb.dokun_sablon("btn_asker_sifirla.png")
    adb.dokun_sablon("input_asker_sayisi.png")
    adb.yazi_yaz("1")
    time.sleep(0.5)
    adb.dokun_sablon("btn_ralliye_katil.png")
    
    logger.info("Ralliye 1 asker ile başarıyla katıldı!")
    adb.geri_tusuna_bas()
    return True
`
  },
  {
    id: 'modules.heal',
    nameTr: 'Hapishane Reviri & Tedavi (Infirmary Auto-Heal)',
    nameEn: 'Infirmary Auto-Heal',
    category: 'security',
    descriptionTr: 'Hapishane revirinde (Infirmary) yaralı askerleri tespit eder. İttifak yardımını maksimize etmek için küçük partiler halinde iyileştirir.',
    descriptionEn: 'Heals wounded troops and guards in the prison infirmary in batches to maximize alliance help clicks.',
    enabled: false,
    intervalSec: 15,
    runCount: 0,
    successCount: 0,
    errorCount: 0,
    cooldownRemaining: 0,
    params: [
      {
        id: 'heal_batch_size',
        nameTr: 'Parti Başına İyileştirme Sayısı',
        nameEn: 'Batch Heal Size',
        type: 'number',
        value: 1000,
        min: 200,
        max: 5000,
        step: 200,
        unit: 'Asker',
        descriptionTr: 'Küçük partiler ittifak yardımı sayesinde anında sıfır maliyetle iyileşir.'
      },
      {
        id: 'auto_alliance_help',
        nameTr: 'İttifak Yardım Butonuna Otomatik Tıkla',
        nameEn: 'Auto Click Alliance Help',
        type: 'boolean',
        value: true
      }
    ],
    pythonCodeSnippet: `# modules/heal.py
import time
import logging
from adb_controller import adb

logger = logging.getLogger("modules.heal")

def calistir():
    """Hapishane revirini kontrol eder ve parti parti iyileştirir."""
    logger.info("Revir yaralı durumu taranıyor...")
    if adb.sablon_mevcut_mu("icon_yarali_asker.png"):
        adb.dokun_sablon("icon_yarali_asker.png")
        time.sleep(1)
        adb.dokun_sablon("btn_iyilestir.png")
        logger.info("Yaralı birlikler tedavi edildi ve ittifak yardımı istendi.")
        return True
    return False
`
  },
  {
    id: 'modules.shield_check',
    nameTr: 'Barış Kalkanı Nöbetçisi (Peace Shield Guard)',
    nameEn: 'Peace Shield Guard',
    category: 'security',
    descriptionTr: 'Hapishane üssünün barış kalkanını sürekli izler. Kalkanın bitmesine 15 dakika kala otomatik 8 saatlik veya 24 saatlik kalkan yeniler.',
    descriptionEn: 'Monitors peace shield over prison HQ. Pops new 8h/24h shield before expiry.',
    enabled: false,
    intervalSec: 30,
    runCount: 0,
    successCount: 0,
    errorCount: 0,
    cooldownRemaining: 0,
    params: [
      {
        id: 'shield_type',
        nameTr: 'Yenilenecek Kalkan Türü',
        nameEn: 'Shield Type',
        type: 'select',
        value: '8h',
        options: [
          { labelTr: '8 Saatlik Barış Kalkanı', labelEn: '8-Hour Peace Shield', value: '8h' },
          { labelTr: '24 Saatlik Barış Kalkanı', labelEn: '24-Hour Peace Shield', value: '24h' }
        ]
      },
      {
        id: 'alert_telegram',
        nameTr: 'Kalkan Düşerse Telegram/Discord Uyarısı Gönder',
        nameEn: 'Send Telegram/Discord Alert If Shield Drops',
        type: 'boolean',
        value: true
      }
    ],
    pythonCodeSnippet: `# modules/shield_check.py
import time
import logging
from adb_controller import adb

logger = logging.getLogger("modules.shield_check")

def calistir():
    """Barış kalkanını kontrol eder, yoksa açar."""
    kalkan_aktif = adb.kalkan_durumu_kontrol_et()
    if not kalkan_aktif:
        logger.critical("DİKKAT: Barış kalkanı pasif! Otomatik kalkan basılıyor...")
        adb.kalkan_kullan(sure="8h")
        return True
    return False
`
  },
  {
    id: 'modules.train_troops',
    nameTr: 'Birlik Eğitimi (Kalkan, Bombacı, Nişancı)',
    nameEn: 'Troop Training (Shield, Bomber, Shooter)',
    category: 'economy',
    descriptionTr: 'Eğitim kamplarını (Training Camps) dolaşır; Kalkan Taşıyıcılar (Shieldbearers), Bombacılar (Bombers) ve Nişancılar (Shooters) için otomatik yeni eğitim başlatır.',
    descriptionEn: 'Checks Training Camps and queues Shieldbearers (Tanks), Bombers (AoE), and Shooters (DPS).',
    enabled: false,
    intervalSec: 60,
    runCount: 0,
    successCount: 0,
    errorCount: 0,
    cooldownRemaining: 0,
    params: [
      {
        id: 'train_tier',
        nameTr: 'Öncelikli Birlik Türü & Seviyesi',
        nameEn: 'Priority Troop Type & Tier',
        type: 'select',
        value: 'shooters',
        options: [
          { labelTr: 'Nişancılar (Shooters - Goril & Boss DPS)', labelEn: 'Shooters (Gorilla & Boss DPS)', value: 'shooters' },
          { labelTr: 'Kalkan Taşıyıcılar (Shieldbearers - Ön Hat Tank)', labelEn: 'Shieldbearers (Frontline Tanks)', value: 'shieldbearers' },
          { labelTr: 'Bombacılar (Bombers - Alan Hasarı & Baskın)', labelEn: 'Bombers (AoE Damage & Raids)', value: 'bombers' },
          { labelTr: 'En Yüksek Seviye (Tier 4 / Tier 5 Dengeli)', labelEn: 'Highest Tier (T4 / T5 Balanced)', value: 'highest' }
        ]
      }
    ],
    pythonCodeSnippet: `# modules/train_troops.py
import time
import logging
from adb_controller import adb

logger = logging.getLogger("modules.train_troops")

def calistir():
    logger.info("Eğitim kampları taranıyor (Kalkan, Bombacı, Nişancı)...")
    if adb.sablon_mevcut_mu("icon_egitim_bosta.png"):
        adb.dokun_sablon("icon_egitim_bosta.png")
        time.sleep(0.5)
        adb.dokun_sablon("btn_egit.png")
        logger.info("Yeni birlik eğitimi başarıyla başlatıldı.")
        return True
    return False
`
  },
  {
    id: 'modules.daily_quests',
    nameTr: 'Günlük Görevler & Mahkum Düzeni (Daily & Prison Care)',
    nameEn: 'Daily Quests & Prison Management',
    category: 'economy',
    descriptionTr: 'Hapishane mutluluğunu korur (Yemekhane, Çamaşırhane, Duşlar), fabrika üretimini toplar, İleri İkmal Kartlarını talep eder ve ittifak teknolojisine bağış yapar.',
    descriptionEn: 'Maintains prisoner happiness (Cafeteria, Laundry, Showers), collects factory goods, claims Supply Cards and donates to alliance.',
    enabled: false,
    intervalSec: 120,
    runCount: 0,
    successCount: 0,
    errorCount: 0,
    cooldownRemaining: 0,
    params: [
      {
        id: 'alliance_tech_donate',
        nameTr: 'İttifak Teknolojisine Otomatik Bağış',
        nameEn: 'Auto Donate Alliance Tech',
        type: 'boolean',
        value: true
      },
      {
        id: 'vip_chest_claim',
        nameTr: 'Günlük İkmal Kartları & Sandık Al',
        nameEn: 'Claim Daily Supply Cards & Chest',
        type: 'boolean',
        value: true
      }
    ],
    pythonCodeSnippet: `# modules/daily_quests.py
import time
import logging
from adb_controller import adb

logger = logging.getLogger("modules.daily_quests")

def calistir():
    logger.info("Günlük ikmal kartları ve hapishane düzeni kontrol ediliyor...")
    adb.dokun_sablon("btn_ikmal.png")
    time.sleep(0.8)
    adb.dokun_sablon("btn_sandik_al.png")
    adb.geri_tusuna_bas()
    logger.info("Günlük ödüller ve ikmal sandığı toplandı.")
    return True
`
  },
  {
    id: 'modules.player_finder',
    nameTr: 'Harita Oyuncu / Kale Bulucu (Player Finder)',
    nameEn: 'Map Player & Castle Finder',
    category: 'combat',
    descriptionTr: 'Oyun haritasında belirli bir oyuncuyu, düşman kalesini veya ittifak etiketini koordinat taraması ve OCR ile otomatik bulur.',
    descriptionEn: 'Searches the game map for specific players, enemy castles or alliance tags via coordinate scan & OCR.',
    enabled: false,
    intervalSec: 10,
    runCount: 0,
    successCount: 0,
    errorCount: 0,
    cooldownRemaining: 0,
    params: [
      {
        id: 'target_player_tag',
        nameTr: 'Hedef Oyuncu Adı (Öncelikli - TAG Zorunlu Değildir)',
        nameEn: 'Target Player Name (Primary - TAG Optional)',
        type: 'text',
        value: 'Fatih',
        descriptionTr: 'Aranacak oyuncunun adı (örn: Fatih, Barbaros). TAG yazmak zorunlu değildir, oyuncu ismiyle doğrudan ve çok daha hızlı bulunur.'
      },
      {
        id: 'search_strategy',
        nameTr: 'Arama Yöntemi',
        nameEn: 'Search Strategy',
        type: 'select',
        value: 'coord_box',
        options: [
          { labelTr: 'Oyun İçi Koordinat Arama Kutusu (X, Y Girerek Git)', labelEn: 'In-Game Coordinate Search Box (Direct Jump)', value: 'coord_box' },
          { labelTr: 'Spiral Alan Taraması (Haritayı Kaydırarak Tara)', labelEn: 'Spiral Grid Scan (Map Swipe & OCR)', value: 'spiral_scan' },
          { labelTr: 'İttifak / Liderlik Sıralamasından Profile Git', labelEn: 'Leaderboard Ranking Profile Jump', value: 'rankings' }
        ],
        descriptionTr: 'Oyuncuyu oyun haritasında bulmak için kullanılacak mekanizma.'
      },
      {
        id: 'action_on_found',
        nameTr: 'Oyuncu Bulununca Yapılacak İşlem',
        nameEn: 'Action When Found',
        type: 'select',
        value: 'notify_and_bookmark',
        options: [
          { labelTr: 'Koordinatı Kaydet & Telegram Bildirimi At', labelEn: 'Save Coordinates & Send Telegram Alert', value: 'notify_and_bookmark' },
          { labelTr: 'Otomatik Gözcü / Keşif Gönder (Scout)', labelEn: 'Auto Dispatch Scout', value: 'send_scout' },
          { labelTr: 'Oyun İçi Yer İmlerine (Bookmark) Ekle', labelEn: 'Add to In-Game Bookmarks', value: 'bookmark' }
        ]
      }
    ],
    pythonCodeSnippet: `# modules/player_finder.py
import time
import logging
from adb_controller import adb

logger = logging.getLogger("modules.player_finder")

def calistir():
    """
    Oyun Haritasında Oyuncu / Kale Bulucu:
    1. Belirlenen koordinat aralığını veya arama kutusunu açar.
    2. OCR ile haritadaki kaleleri tarar (İsim & İttifak TAG'i).
    3. Hedef oyuncu bulunduğunda koordinatını (X, Y) kaydeder ve bildirir.
    """
    hedef_oyuncu = "[TURK] Fatih"
    logger.info(f"Oyun haritasında hedef oyuncu taranıyor: {hedef_oyuncu}")
    
    # 1. Koordinat Arama Menüsünü Aç
    adb.dokun_sablon("btn_koordinat_ara.png")
    time.sleep(0.8)
    
    # 2. Koordinatları gir (Örnek: X=482, Y=618)
    adb.dokun_sablon("input_koordinat_x.png")
    adb.yazi_yaz("482")
    adb.dokun_sablon("input_koordinat_y.png")
    adb.yazi_yaz("618")
    adb.dokun_sablon("btn_git.png")
    time.sleep(1.5)
    
    # 3. Ekrandaki kalenin üstündeki ismi OCR ile oku
    ekrandaki_isimler = adb.ekran_ocr_metinleri_oku()
    for isim, coords in ekrandaki_isimler:
        if "fatih" in isim.lower() or "turk" in isim.lower():
            logger.info(f"HEDEF BULUNDU! Oyuncu: {isim} - Koordinat: (X: 482, Y: 618)")
            adb.dokun(coords[0], coords[1])
            adb.dokun_sablon("btn_isaretle.png")
            return True
            
    logger.info("Bu bölgede hedef oyuncu bulunamadı, spiral tarama sürdürülüyor...")
    return False
`
  }
];

export const DEFAULT_ADB_CONFIG = {
  deviceType: 'ldplayer' as const,
  host: '127.0.0.1',
  port: 5554,
  serial: 'emulator-5554',
  screenResolution: '1280x720' as const,
  orientation: 'landscape' as const,
  gamePackage: 'com.justgame.jails',
  autoRestartOnCrash: true,
  antiBan: {
    enabled: true,
    clickJitterPx: 6,
    bezierCurveSwipe: true,
    randomDelayFactor: 1.15,
    hourlyBreakMinutes: 4
  },
  telegramNotifications: {
    enabled: false,
    botToken: '',
    chatId: '',
    alertOnCaptcha: true,
    alertOnAttack: true,
    alertOnShieldLow: true
  }
};
