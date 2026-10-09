import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Terminal, 
  Smartphone, 
  Layers, 
  ShieldAlert, 
  Sliders, 
  Download, 
  Play, 
  Copy, 
  Check, 
  ExternalLink, 
  ChevronRight, 
  AlertTriangle, 
  HelpCircle,
  Cpu,
  MonitorCheck,
  Monitor
} from 'lucide-react';

interface GuideSectionProps {
  lang: 'tr' | 'en';
  onGoToLive: () => void;
  onGoToCode: () => void;
  onDownloadZip: () => void;
  onOpenAdbSettings: () => void;
  onOpenPcGuide?: () => void;
}

export const GuideSection: React.FC<GuideSectionProps> = ({
  lang,
  onGoToLive,
  onGoToCode,
  onDownloadZip,
  onOpenAdbSettings,
  onOpenPcGuide
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  const toggleStepCompleted = (stepNum: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNum) ? prev.filter((s) => s !== stepNum) : [...prev, stepNum]
    );
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      num: 1,
      titleTr: '1. Adım: Görev Modüllerini ve Öncelikleri Belirleyin',
      titleEn: 'Step 1: Select & Prioritize Task Modules',
      badgeTr: 'Temel Yapılandırma',
      badgeEn: 'Basic Config',
      icon: <Layers className="w-4 h-4 text-emerald-400" />,
      contentTr: (
        <div className="space-y-3">
          <p className="text-slate-300 leading-relaxed">
            Otomasyon asistanı, paylaştığınız Python mimarisine uygun olarak dinamik bir döngüde çalışır.
            İlk olarak sol paneldeki <strong className="text-emerald-400 font-mono">AKTIF_GOREVLER</strong> listesinden
            oyunda çalıştırmak istediğiniz görevleri seçin:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
              <div className="font-semibold text-emerald-300 font-mono text-xs">modules.gather</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Boş kaynakları (Odun, Yemek, Çelik, Benzin vb.) haritada tarar, boşta kıta varsa otomatik yollar.
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
              <div className="font-semibold text-rose-300 font-mono text-xs">modules.monster</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Enerjinizi (Stamina/AP) kontrol eder, haritada barbar/yaratık bulup komutanla saldırır.
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
              <div className="font-semibold text-amber-300 font-mono text-xs">modules.rally</div>
              <div className="text-[11px] text-slate-400 mt-1">
                İttifak savaş listesini dinler; açılan Barbar Kalesi veya Boss rallilerine 1 askerle katılır.
              </div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-[11px] text-indigo-200">
            <strong>Önemli İpucu:</strong> Listedeki sıralama yürütme önceliğini belirler. Örneğin rallilerin kaçırılmaması için
            <code className="text-white font-mono ml-1">modules.rally</code> modülünü en üste taşıyabilirsiniz.
          </div>
        </div>
      ),
      contentEn: (
        <div className="space-y-3">
          <p className="text-slate-300 leading-relaxed">
            The assistant runs tasks dynamically in a modular Python loop. Start by choosing which tasks should be in your
            <strong className="text-emerald-400 font-mono"> AKTIF_GOREVLER</strong> list:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
              <div className="font-semibold text-emerald-300 font-mono text-xs">modules.gather</div>
              <div className="text-[11px] text-slate-400 mt-1">Scans map for resource tiles and dispatches idle marches.</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
              <div className="font-semibold text-rose-300 font-mono text-xs">modules.monster</div>
              <div className="text-[11px] text-slate-400 mt-1">Checks stamina and attacks monsters with your preferred team.</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
              <div className="font-semibold text-amber-300 font-mono text-xs">modules.rally</div>
              <div className="text-[11px] text-slate-400 mt-1">Listens to alliance war screen and auto-joins rallies with 1 troop.</div>
            </div>
          </div>
        </div>
      )
    },
    {
      num: 2,
      titleTr: '2. Adım: Web Simülatöründe Canlı Test Yapın',
      titleEn: 'Step 2: Test Live in the Web Simulator',
      badgeTr: 'Görsel Doğrulama',
      badgeEn: 'Visual Test',
      icon: <Play className="w-4 h-4 text-sky-400" />,
      contentTr: (
        <div className="space-y-3">
          <p className="text-slate-300 leading-relaxed">
            Botu bilgisayarınızda çalıştırmadan önce, sistemin mantığını doğrudan bu sayfadaki sanal emülatör üzerinde deneyebilirsiniz:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300 pl-1 text-[11px]">
            <li>
              Üst bardaki <strong className="text-emerald-400">Başlat</strong> butonuna basarak döngüyü çalıştırın.
            </li>
            <li>
              Sağdaki <strong>Sanal Ekran</strong> üzerinde modüllerin tıkladığı koordinatları (<span className="text-emerald-400 font-mono">dokun(x, y)</span> halkaları) ve aktif birlik ilerlemesini izleyin.
            </li>
            <li>
              Alttaki <strong>Python Terminalinde</strong> logların anlık akışını ve modüllerin hata ayıklama mesajlarını takip edin.
            </li>
            <li>
              <strong>Hız Ayarını (1x, 2x, 5x)</strong> değiştirerek döngünün tepki hızını test edin veya <strong>Adım</strong> butonuyla tek tek yürütün.
            </li>
          </ul>
          <div className="pt-1">
            <button
              onClick={onGoToLive}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Simülasyon Ekranına Dön ve Başlat</span>
            </button>
          </div>
        </div>
      ),
      contentEn: (
        <div className="space-y-3">
          <p className="text-slate-300 leading-relaxed">
            Before running on your local machine, you can verify the behavior directly inside the simulated web environment:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300 pl-1 text-[11px]">
            <li>Click <strong>Start</strong> on the header to launch the loop.</li>
            <li>Observe touch ripple points on the virtual canvas and track marching troops.</li>
            <li>Inspect real-time log records in the Python terminal console below.</li>
          </ul>
        </div>
      )
    },
    {
      num: 3,
      titleTr: '3. Adım: Android Emülatörünüzü (LDPlayer / BlueStacks) Hazırlayın',
      titleEn: 'Step 3: Setup Your Android Emulator',
      badgeTr: 'ADB & Cihaz Köprüsü',
      badgeEn: 'ADB Bridge',
      icon: <Smartphone className="w-4 h-4 text-amber-400" />,
      contentTr: (
        <div className="space-y-3">
          <p className="text-slate-300 leading-relaxed">
            Python botunun emülatörünüze tıklama ve görüntü alma komutları gönderebilmesi için ADB bağlantısı gereklidir:
          </p>
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="font-semibold text-slate-200 text-xs flex items-center justify-between">
                <span>LDPlayer 9 (En çok tavsiye edilen)</span>
                <span className="font-mono text-emerald-400 text-[11px]">Port: 5554 (127.0.0.1:5554)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                LDPlayer Ayarlar &gt; Diğer &gt; &quot;ADB Hata Ayıklama (Açık)&quot; seçeneğini aktif edin. Çözünürlüğü <strong>1280x720 (DPI 240)</strong> yapın.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="font-semibold text-slate-200 text-xs flex items-center justify-between">
                <span>BlueStacks 5</span>
                <span className="font-mono text-sky-400 text-[11px]">Port: 5555 (127.0.0.1:5555)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Ayarlar &gt; Gelişmiş &gt; &quot;Android Hata Ayıklama Köprüsü (ADB)&quot; anahtarını açın.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="font-semibold text-slate-200 text-xs flex items-center justify-between">
                <span>Nox Player</span>
                <span className="font-mono text-purple-400 text-[11px]">Port: 62001 (127.0.0.1:62001)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Sistem Ayarları &gt; Genel &gt; Root açık ve Çözünürlük 1280x720 olarak ayarlayın.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onOpenAdbSettings}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>ADB ve Anti-Ban Ayarlarını Aç</span>
            </button>
          </div>
        </div>
      ),
      contentEn: (
        <div className="space-y-3">
          <p className="text-slate-300 leading-relaxed">
            Enable ADB debugging in your emulator settings so the Python controller can take screenshots and inject touches:
          </p>
          <div className="space-y-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <strong>LDPlayer:</strong> Settings &gt; Others &gt; ADB Debugging: Open. Res: 1280x720.
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <strong>BlueStacks 5:</strong> Settings &gt; Advanced &gt; Android Debug Bridge (ADB): ON. Port: 5555.
            </div>
          </div>
        </div>
      )
    },
    {
      num: 4,
      titleTr: '4. Adım: Python Projesini İndirin ve Bilgisayarınıza Kurun',
      titleEn: 'Step 4: Download & Install on Your PC',
      badgeTr: 'Kurulum & Dosyalar',
      badgeEn: 'Installation',
      icon: <Download className="w-4 h-4 text-emerald-400" />,
      contentTr: (
        <div className="space-y-3">
          <p className="text-slate-300 leading-relaxed">
            Sayfanın sağ üstündeki <strong className="text-emerald-400">&quot;Python ZIP İndir&quot;</strong> butonuna tıklayın.
            İndirilen <code className="text-amber-300 font-mono">gelismis_otomasyon_bot.zip</code> dosyasını masaüstünüze bir klasöre çıkarın.
          </p>
          <div className="p-3 rounded-lg bg-black/60 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2">
            <div className="text-slate-400"># Windows için tek tıkla kurulum:</div>
            <div className="text-emerald-400 font-semibold">
              Klasörün içindeki <span className="underline">baslat.bat</span> dosyasına çift tıklayın!
            </div>
            <div className="text-slate-400 pt-1"># Veya komut satırında (CMD / PowerShell):</div>
            <div className="flex items-center justify-between bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800">
              <code>pip install -r requirements.txt</code>
              <button
                onClick={() => copyToClipboard('pip install -r requirements.txt', 1)}
                className="text-slate-400 hover:text-white"
                title="Kopyala"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onDownloadZip}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Python ZIP Paketini Şimdi İndir</span>
            </button>
            <button
              onClick={onGoToCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <span>Kodları Görüntüle</span>
            </button>
          </div>
        </div>
      ),
      contentEn: (
        <div className="space-y-3">
          <p className="text-slate-300 leading-relaxed">
            Click <strong>Export Python ZIP</strong> at the top right, extract the archive, and run:
          </p>
          <div className="p-3 rounded-lg bg-black/60 border border-slate-800 font-mono text-[11px] space-y-2">
            <div className="text-emerald-400">Double click <code>baslat.bat</code> on Windows!</div>
            <div className="flex items-center justify-between bg-slate-900 px-2.5 py-1.5 rounded">
              <code>pip install -r requirements.txt</code>
            </div>
          </div>
        </div>
      )
    },
    {
      num: 5,
      titleTr: '5. Adım: Botu Çalıştırma ve Anti-Ban Tavsiyeleri',
      titleEn: 'Step 5: Run Bot & Anti-Ban Safety Rules',
      badgeTr: 'Canlı Yürütme',
      badgeEn: 'Live Execution',
      icon: <ShieldAlert className="w-4 h-4 text-purple-400" />,
      contentTr: (
        <div className="space-y-3">
          <p className="text-slate-300 leading-relaxed">
            Botu başlattığınızda terminal ekranınızda şu akış başlayacaktır:
          </p>
          <div className="p-2.5 rounded-lg bg-black/70 border border-slate-800 font-mono text-[11px] text-emerald-400">
            [INFO] [AnaDongu]: Gelişmiş Otomasyon Asistanı Başlatıldı...<br/>
            [INFO] [AnaDongu]: ADB bağlantısı kuruluyor: 127.0.0.1:5554<br/>
            [+] Modül Yüklendi: modules.gather<br/>
            [+] Modül Yüklendi: modules.monster<br/>
            [+] Modül Yüklendi: modules.rally<br/>
            --- Döngü #1 Başlatılıyor ---
          </div>

          <div className="space-y-2 pt-1">
            <h5 className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Oyun Hesabınızı Korumak İçin 4 Altın Kural:</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <strong className="text-slate-200 block mb-0.5">1. Rastgele Sapma (Jitter):</strong>
                Varsayılan olarak bot her dokunmada ±6 piksel sapma uygular; asla aynı piksele iki kez tıklamaz.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <strong className="text-slate-200 block mb-0.5">2. Saatlik Dinlenme Molası:</strong>
                Günde 24 saat kesintisiz oynamak yerine saat başı 4-8 dakika dinlenme molası ayarlayın.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <strong className="text-slate-200 block mb-0.5">3. CPU Tasarrufu:</strong>
                Scriptinizdeki <code className="text-amber-300 font-mono">time.sleep(1)</code> pas geçişi işlemcinizi yormaz.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <strong className="text-slate-200 block mb-0.5">4. Acil Durumda Durdurma:</strong>
                Botu durdurmak istediğinizde terminal ekranında <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-200">Ctrl + C</kbd> tuşlarına basın.
              </div>
            </div>
          </div>
        </div>
      ),
      contentEn: (
        <div className="space-y-3">
          <p className="text-slate-300 leading-relaxed">
            When you run <code>python main.py</code>, the bot connects to ADB and begins the loop safely.
            Keep anti-ban jitter enabled and avoid running 24/7 without pauses. Stop anytime with Ctrl+C.
          </p>
        </div>
      )
    }
  ];

  // Frequently Asked Questions
  const faqs = [
    {
      qTr: 'Bu botu Lands of Jail (com.justgame.jails) oyununda nasıl kullanırım?',
      qEn: 'How do I use this bot for Lands of Jail (com.justgame.jails)?',
      aTr: '1) Üst bardaki "Profiller" menüsünden "Lands of Jail - 7/24 Tam Otomasyon" profilini uygulayın. 2) Emülatörünüzde (LDPlayer 9 önerilir) çözünürlüğü 1280x720 yapın ve ADB Hata Ayıklamayı açın. 3) Python ZIP paketini indirin ve baslat.bat dosyasına çift tıklayın. Bot, Lands of Jail oyununu (com.justgame.jails) otomatik başlatır, oyundan düşerse yeniden açar. 4) Odun, Yemek, Çelik, Benzin kaynaklarını toplar, Goril boss rallilerine katılır, firarileri avlar ve kale bulucu ile ada haritasındaki hedefleri tespit eder.',
      aEn: '1) Apply the Lands of Jail preset from the Presets menu. 2) Set emulator resolution to 1280x720 with ADB enabled. 3) Download the Python ZIP and double click baslat.bat. The bot auto-launches com.justgame.jails with crash guard. 4) It gathers Wood, Food, Steel, Gas, joins Gorilla rallies, hunts fugitives, and locates enemy warden castles.'
    },
    {
      qTr: 'Haritada Oyuncu / Kale Bulucu için kişi adı ve TAG nereye yazılacak?',
      qEn: 'Where do I enter the player name and TAG for the castle finder?',
      aTr: 'Kişi adı veya TAG üç farklı yerden yazılabilir: 1) Özel "Kale & TAG Bulucu" Modalı: Üst menü çubuğundaki "Kale / TAG Bulucu" butonuna veya simülatördeki "🎯 Kale & TAG Bul" butonuna tıklayarak açılan modal penceresinden kişi adı, ittifak TAG\'i ve koordinat girip doğrudan harita simülasyonuna aktarabilirsiniz. 2) Canlı Mini-Harita Radarında: "Mini-Harita" sekmesindeki "🏰 Oyuncu & Kale Bulucu" arama kutusuna yazıp [TURK], [WOLF], [TITAN], [FARM] butonlarıyla hızlıca filtreleyebilirsiniz. 3) Python Bot Modülünde: Sol menüdeki "Harita Oyuncu / Kale Bulucu (Player Finder)" modülünün yanındaki ⚙️ (Ayar) butonuna tıklayıp parametreye yazabilirsiniz.',
      aEn: 'You can enter the name or TAG in 3 ways: 1) Dedicated Target Finder Modal: Click "Castle Finder" in the top bar or "🎯 Find Target" on the emulator toolbar. Enter the name, TAG, coordinates and action to lock directly into simulation. 2) Mini-Map Radar: Type into the search input in the Mini-Map panel. 3) Task Module Settings: Click the gear icon on the Player Finder module.'
    },
    {
      qTr: 'Sanal Klavye ile oyun içine nasıl yazı yazılır ve komut gönderilir?',
      qEn: 'How to type text and send commands in-game using the Virtual Keyboard?',
      aTr: 'Sanal ADB Ekranının hemen altındaki "Sanal Klavye & Oyun İçi Metin Girişi" modülü veya üst bardaki "⌨️ Sanal Klavye" butonu kullanılır. 1) Metin Giriş Alanı: Fiziksel klavyenizle veya ekrandaki sanal QWERTY/Türkçe tuşlara tıklayarak mesajınızı yazın. 2) Kanal Seçimi: İttifak, Krallık, Koordinat veya Konsol kanalını seçin. 3) Gönder: "Gönder" butonuna bastığınızda `adb shell input text` komutu ile metin doğrudan oyuna aktarılır ve ekranda konuşma balonu belirir. Ayrıca "ENTER (Key 66)" tuşu ve tek tıkla gönderilebilen hızlı oyun makroları (Goril koordinatları, ralli çağrıları vb.) mevcuttur.',
      aEn: 'Use the Virtual Keyboard module under the ADB Screen or click "⌨️ Virtual Keyboard" in the header. 1) Type via physical keyboard or click virtual keys. 2) Choose channel: Alliance, Kingdom, Coords, or Console. 3) Click Send to execute `adb shell input text`. Also includes ENTER (Keyevent 66) and one-click game macros.'
    },
    {
      qTr: 'Bu bot ile oyun haritasında belirli bir oyuncuyu veya kaleyi bulabilir miyim?',
      qEn: 'Can I find a player or castle on the game map with this bot?',
      aTr: 'EVET! Oyun haritasında (Kingdom Map) bir oyuncuyu veya düşman kalesini bulmak için sisteme eklenen "modules.player_finder" (Harita Oyuncu / Kale Bulucu) modülünü kullanabilirsiniz. Bu modül haritayı spiral olarak tarar veya oyun içi koordinat arama kutusuna X:Y değerleri girerek kaleleri OCR ile okur ve bulduğunda koordinatını Telegram bildirimine gönderir. (Not: Bu özellik yalnızca oyun haritalarındaki sanal oyun kaleleri içindir; gerçek hayattaki insanları veya fiziksel GPS konumlarını bulmaz).'
    },
    {
      qTr: 'ADB Cihazı Bulunamadı veya "connected" Olmadı Hatası?',
      qEn: 'ADB Device not found error?',
      aTr: 'Emülatörünüzün açık olduğundan ve ayarlarından "ADB Debugging" seçeneğinin aktif olduğundan emin olun. CMD ekranında `adb connect 127.0.0.1:5554` komutunu elle çalıştırarak bağlantıyı test edebilirsiniz.'
    },
    {
      qTr: 'Bilgisayarım hiç yok, sadece tabletim/telefonum var. Lands of Jail\'i nasıl otomatik oynatırım?',
      qEn: 'I don\'t have a computer at all, only a tablet/phone. How do I automate Lands of Jail?',
      aTr: 'Bilgisayarınız yoksa indirilen Python (.py / .bat) dosyaları ve ADB eşleştirme koduyla uğraşmanıza HİÇ GEREK YOKTUR! En pratik ve çalışan 2 yöntem: 1) Google Play Store\'dan "Macrorify" (Görüntü ve Resim Tanımalı Bot) veya "Auto Clicker" uygulamasını tabletinize indirin. Sadece ekrandaki erişilebilirlik iznini verip Lands of Jail oyununu açın; tıklama noktalarını veya resim tanıma hedeflerini koyarak tek tıkla başlatın. Bilgisayara, koda ve kabloya sıfır ihtiyaç duyar. 2) İllaki Python botunu tabletten çalıştırmak isterseniz: F-Droid\'den Termux kurup tabletin Bölünmüş Ekran (Split Screen) modunda Termux ile Ayarlar\'ı yan yana açarak "adb pair 127.0.0.1:PORT" ile tableti kendi kendine eşleştirebilirsiniz.'
    },
    {
      qTr: 'Bu botu ve oyunu bir VPS (Sanal Sunucu) üzerine kurup 7/24 çalıştırabilir miyim?',
      qEn: 'Can I install this bot and game on a VPS to run 24/7?',
      aTr: 'KESİNLİKLE EVET! Hatta bilgisayarı olmayan veya tabletinin açık kalmasını istemeyen oyuncular için en profesyonel yöntem budur. Windows Server yüklü bir VPS kiralayıp tabletinizden "Microsoft Remote Desktop (RDP)" ile bağlanabilirsiniz. VPS içine LDPlayer emülatörünü kurup oyunu açtıktan sonra bu siteden indirdiğiniz Python botunu "baslat.bat" ile çalıştırırsınız. Bot sunucuda çalışırken tabletinizi kapatıp uyuyabilirsiniz; bulut sunucu 7/24 elektrik veya internet kesintisi olmadan Lands of Jail kasmaya devam eder. Alternatif olarak Redfinger veya LDCloud gibi doğrudan hazır Cloud Phone (Bulut Telefon) servislerini de kullanabilirsiniz.'
    },
    {
      qTr: 'Bu sistemi mobil telefonda ve tablette nasıl çalıştırabilirim?',
      qEn: 'How can I run this system on mobile and tablet?',
      aTr: '3 farklı yöntemle çalıştırabilirsiniz: 1) Kablosuz ADB (Önerilen): Telefon/tablette "Geliştirici Seçenekleri > Kablosuz Hata Ayıklama (Wireless ADB)" açın. Bilgisayardaki bot ayarlarından telefonun yerel IP adresini (ör. 192.168.1.50:5555) girin; bot PC üzerinden telefonunuzdaki gerçek oyunu yönetsin. 2) Termux ile Doğrudan Telefonda: Android cihaza Termux kurup python ve adb paketlerini yükleyerek harici bilgisayar olmadan doğrudan telefonda çalıştırabilirsiniz. 3) Uzak Masaüstü / Web Kontrol: PC veya VPS sunucunuzda emülatör çalışırken, telefon veya tabletinizin tarayıcısından bu web paneline bağlanıp veya AnyDesk/Chrome Remote ile uzaktan 7/24 yönetebilirsiniz.'
    },
    {
      qTr: 'Bu bot oyun hesabımda ban (yasaklanma) riskine yol açar mı?',
      qEn: 'Does this bot cause a ban risk on my game account?',
      aTr: 'Bot bellek enjeksiyonu (RAM hooking), modlu APK veya sunucu paket hilesi yapmaz; harici ADB ile yalnızca ekran resmi alıp dokunma simülasyonu uygular. Tespit edilmemek için botta yerleşik "Rastgele Piksel Sapması (±6px Jitter)", "Değişken İnsansı Gecikmeler", "Bézier Eğrisi Kaydırmaları" ve "Saat Başı Dinlenme Molası" bulunur. 24 saat aralıksız açık bırakmamak ve molaları kapatmamak kaydıyla risk minimum düzeydedir.'
    },
    {
      qTr: 'Kendi Özel Görev Modülümü Nasıl Yazarım?',
      qEn: 'How to write a custom task module?',
      aTr: 'Sol paneldeki "+ Yeni Modül" butonuna tıklayın. Örneğin `modules.sandik` adını verin. `calistir()` fonksiyonu içinde `adb.dokun_sablon("sandik.png")` çağrısı yaparak kendi oyun mekaniklerinizi entegre edin.'
    },
    {
      qTr: 'Şablon Resimlerini (PNG) Nereden Bulacağım?',
      qEn: 'Where do template matching PNG images come from?',
      aTr: 'Emülatörünüzden oyunun ekran görüntüsünü alıp "Saldır", "Topla", "Katıl" gibi butonları kırparak `modules/templates/` klasörüne aynı isimle kaydedebilirsiniz.'
    }
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-100 tracking-tight">
                {lang === 'tr' ? 'Nasıl Kullanılır? Adım Adım Kurulum ve Kullanım Rehberi' : 'How to Use: Step-by-Step Guide'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'tr'
                  ? 'Modül seçiminden yerel emülatör kurulumuna kadar tüm aşamalar'
                  : 'Everything from task configuration to local emulator setup'}
              </p>
            </div>
          </div>

          {/* Quick buttons & checklist tracker */}
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenPcGuide && (
              <button
                onClick={onOpenPcGuide}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 transition-colors shadow-sm cursor-pointer"
              >
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'tr' ? '💻 Görsel PC Kurulum Sihirbazı' : '💻 Visual PC Setup Wizard'}</span>
              </button>
            )}
            <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-slate-400">{lang === 'tr' ? 'Tamamlanan Adımlar:' : 'Completed:'}</span>
              <span className="text-emerald-400 font-bold">{completedSteps.length} / {steps.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Step navigation on left, step detail on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        {/* Left Step Navigator (List of 5 steps) */}
        <div className="lg:col-span-4 p-3 sm:p-4 overflow-y-auto space-y-2 bg-slate-950/50">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2">
            {lang === 'tr' ? 'Kurulum Adımları' : 'Setup Steps'}
          </div>

          {steps.map((step) => {
            const isActive = activeStep === step.num;
            const isCompleted = completedSteps.includes(step.num);

            return (
              <div
                key={step.num}
                onClick={() => setActiveStep(step.num)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isActive
                    ? 'bg-slate-900 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStepCompleted(step.num);
                      }}
                      className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors"
                      title={isCompleted ? 'Tamamlandı işaretini kaldır' : 'Tamamlandı olarak işaretle'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600" />
                      )}
                    </button>
                    <div>
                      <div className={`text-xs font-semibold ${isActive ? 'text-slate-100' : 'text-slate-300'}`}>
                        {lang === 'tr' ? step.titleTr : step.titleEn}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {lang === 'tr' ? step.badgeTr : step.badgeEn}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 mt-0.5 transition-transform ${isActive ? 'text-emerald-400 rotate-90 lg:rotate-0' : 'text-slate-600'}`} />
                </div>
              </div>
            );
          })}

          {/* Quick FAQ summary box */}
          <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span>{lang === 'tr' ? 'Sıkça Sorulan Sorular' : 'FAQ'}</span>
            </div>
            <div className="space-y-2 pt-1">
              {faqs.map((faq, idx) => (
                <div key={idx} className="text-[11px] text-slate-400">
                  <strong className="text-slate-200 block">{lang === 'tr' ? faq.qTr : faq.qEn}</strong>
                  <p className="mt-0.5 text-slate-400 leading-normal">{faq.aTr}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Step Content Viewer */}
        <div className="lg:col-span-8 p-4 sm:p-6 overflow-y-auto bg-slate-900/40 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Step Header */}
            {steps.find((s) => s.num === activeStep) && (() => {
              const current = steps.find((s) => s.num === activeStep)!;
              const isCompleted = completedSteps.includes(current.num);

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                        {current.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-100 text-sm sm:text-base">
                          {lang === 'tr' ? current.titleTr : current.titleEn}
                        </h3>
                        <span className="text-[11px] text-slate-400">
                          {lang === 'tr' ? current.badgeTr : current.badgeEn}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleStepCompleted(current.num)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        isCompleted
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5" />}
                      <span>{isCompleted ? (lang === 'tr' ? 'Tamamlandı' : 'Completed') : (lang === 'tr' ? 'Tamamla' : 'Mark Done')}</span>
                    </button>
                  </div>

                  {/* Step Body */}
                  <div className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'tr' ? current.contentTr : current.contentEn}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Step Navigation Buttons (Prev / Next) */}
          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              &larr; {lang === 'tr' ? 'Önceki Adım' : 'Previous Step'}
            </button>

            <span className="text-[11px] font-mono text-slate-500">
              {activeStep} / {steps.length}
            </span>

            <button
              onClick={() => setActiveStep((prev) => Math.min(steps.length, prev + 1))}
              disabled={activeStep === steps.length}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 hover:text-emerald-300 disabled:opacity-30 transition-colors"
            >
              {lang === 'tr' ? 'Sonraki Adım' : 'Next Step'} &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
