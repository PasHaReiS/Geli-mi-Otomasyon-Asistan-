import React, { useState } from 'react';
import { 
  X, 
  Monitor, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  Play, 
  Terminal, 
  Sliders, 
  ExternalLink, 
  AlertTriangle, 
  Zap, 
  Cpu, 
  ChevronRight, 
  Smartphone,
  ShieldCheck,
  RefreshCw,
  FolderArchive,
  ArrowRight
} from 'lucide-react';

interface PcSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'tr' | 'en';
  onDownloadZip?: () => void;
  onOpenTabletGuide?: () => void;
}

export const PcSetupModal: React.FC<PcSetupModalProps> = ({
  isOpen,
  onClose,
  lang,
  onDownloadZip,
  onOpenTabletGuide
}) => {
  const [activeTab, setActiveTab] = useState<'ldplayer' | 'bluestacks' | 'steps' | 'troubleshoot'>('ldplayer');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    python: false,
    emulator: false,
    adb: false,
    game: false,
    zip: false,
    run: false
  });

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base sm:text-lg">
                  {lang === 'tr' ? '💻 Windows PC / Bilgisayar Kurulum Rehberi' : '💻 Windows PC / Computer Setup Guide'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono hidden sm:inline">
                  5 Dakika
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'tr' 
                  ? 'Python botunu LDPlayer veya BlueStacks ile sorunsuz çalıştırma adımları' 
                  : 'Quick steps to run the Python bot with LDPlayer or BlueStacks seamlessly'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={lang === 'tr' ? 'Kapat' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-3 pt-2 gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('ldplayer')}
            className={`px-3 py-2 font-semibold rounded-t-lg transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ldplayer'
                ? 'border-emerald-400 text-emerald-300 bg-slate-900/80'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <span>🟡 LDPlayer 9 (Önerilen)</span>
          </button>
          <button
            onClick={() => setActiveTab('bluestacks')}
            className={`px-3 py-2 font-semibold rounded-t-lg transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'bluestacks'
                ? 'border-sky-400 text-sky-300 bg-slate-900/80'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <span>🟦 BlueStacks 5</span>
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-3 py-2 font-semibold rounded-t-lg transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'steps'
                ? 'border-amber-400 text-amber-300 bg-slate-900/80'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <span>⚡ Adım Adım Sihirbaz</span>
          </button>
          <button
            onClick={() => setActiveTab('troubleshoot')}
            className={`px-3 py-2 font-semibold rounded-t-lg transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'troubleshoot'
                ? 'border-rose-400 text-rose-300 bg-slate-900/80'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <span>❓ Sık Hatalar & Çözüm</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 text-slate-300 text-xs sm:text-sm space-y-4">
          
          {/* TAB 1: LDPlayer 9 (EN ÖNERİLEN) */}
          {activeTab === 'ldplayer' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-emerald-300 font-semibold mb-1">
                    {lang === 'tr' ? 'Neden LDPlayer 9 Tercih Edilmeli?' : 'Why LDPlayer 9 is Recommended?'}
                  </strong>
                  <span>
                    {lang === 'tr'
                      ? 'LDPlayer, düşük RAM tüketimi ve yerleşik ADB kararlılığı nedeniyle mobil strateji oyunları botları için en stabil çalışan emülatördür. Tek tıkla otomatik bağlanır.'
                      : 'LDPlayer uses less RAM and provides stable built-in ADB connections on port 5554. It works out of the box with zero network pairing issues.'}
                  </span>
                </div>
              </div>

              {/* 4 Simple Steps for LDPlayer */}
              <div className="space-y-2.5">
                {/* 1. Python */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 inline-flex items-center justify-center font-bold text-xs">1</span>
                    <h4 className="font-semibold text-slate-100 text-xs sm:text-sm">
                      {lang === 'tr' ? 'Python\'ı Kurun (Add to PATH Kutucuğunu Seçin!)' : 'Install Python (Check Add to PATH!)'}
                    </h4>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed ml-7">
                    {lang === 'tr' ? (
                      <>
                        Bilgisayarınızda Python yoksa <a href="https://www.python.org/downloads/" target="_blank" rel="noreferrer" className="text-sky-400 underline font-semibold">python.org</a> üzerinden en son sürümü indirin. Kurulum başlarken alttaki <strong className="text-amber-300">"Add python.exe to PATH"</strong> kutucuğunu MUTLAKA işaretleyin.
                      </>
                    ) : (
                      'Download Python 3.10+ from python.org. Make sure to tick the checkbox "Add python.exe to PATH" during installation.'
                    )}
                  </p>
                </div>

                {/* 2. LDPlayer Settings */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 inline-flex items-center justify-center font-bold text-xs">2</span>
                    <h4 className="font-semibold text-slate-100 text-xs sm:text-sm">
                      {lang === 'tr' ? 'LDPlayer 9 Ayarları (Çözünürlük & ADB)' : 'LDPlayer 9 Configuration'}
                    </h4>
                  </div>
                  <div className="text-slate-300 text-xs space-y-1.5 ml-7 mt-1.5">
                    <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <Sliders className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <strong>Çözünürlük:</strong> LDPlayer Ayarlar &gt; Gelişmiş &gt; <span className="text-amber-300 font-mono">Tablet 1280x720 (DPI: 240)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <strong>ADB Hata Ayıklama:</strong> LDPlayer Ayarlar &gt; Diğer &gt; <span className="text-emerald-300 font-mono">ADB Hata Ayıklama: Açık (Yerel Bağlantı)</span>
                      </div>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      * Ayarları kaydedip LDPlayer'ı bir kez yeniden başlatın. Lands of Jail (com.justgame.jails) oyununu Play Store'dan kurup açın.
                    </div>
                  </div>
                </div>

                {/* 3. ZIP Download & Extract */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 inline-flex items-center justify-center font-bold text-xs">3</span>
                    <h4 className="font-semibold text-slate-100 text-xs sm:text-sm">
                      {lang === 'tr' ? 'Bot ZIP Dosyasını İndirin ve Çıkarın' : 'Download and Extract Bot ZIP'}
                    </h4>
                  </div>
                  <p className="text-slate-400 text-xs ml-7">
                    {lang === 'tr' 
                      ? 'Bu sayfadaki "Python ZIP İndir" butonuna tıklayın. İndirilen "gelismis_otomasyon_bot.zip" dosyasına sağ tıklayıp "Klasöre Çıkar" deyin.' 
                      : 'Click "Export Python ZIP" and extract the archive to a folder on your desktop.'}
                  </p>
                </div>

                {/* 4. Single Click Run */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/40 bg-emerald-950/15">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 inline-flex items-center justify-center font-bold text-xs">4</span>
                    <h4 className="font-bold text-emerald-300 text-xs sm:text-sm">
                      {lang === 'tr' ? 'baslat.bat Dosyasına Çift Tıklayın!' : 'Double-click baslat.bat!'}
                    </h4>
                  </div>
                  <p className="text-slate-300 text-xs ml-7 leading-relaxed">
                    {lang === 'tr' ? (
                      <>
                        Klasör içindeki <strong className="text-white font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">baslat.bat</strong> dosyasına çift tıklayın! Bot otomatik olarak eksik paketleri yükler, LDPlayer'a (<span className="text-emerald-400 font-mono">127.0.0.1:5554</span>) bağlanır ve oyunu yönetmeye başlar.
                      </>
                    ) : (
                      'Double-click baslat.bat in the extracted folder. It installs required packages and connects to LDPlayer automatically.'
                    )}
                  </p>
                </div>
              </div>

              {/* Quick action buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {onDownloadZip && (
                  <button
                    onClick={onDownloadZip}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === 'tr' ? 'Python ZIP İndir' : 'Export Python ZIP'}</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('troubleshoot')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'tr' ? 'Bağlantı Sorunu Mu Yaşıyorsunuz?' : 'Connection Trouble?'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: BlueStacks 5 */}
          {activeTab === 'bluestacks' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-200 text-xs flex items-start gap-3">
                <Monitor className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sky-300 font-semibold mb-1">
                    {lang === 'tr' ? 'BlueStacks 5 Kullanıcıları İçin ADB Ayarı' : 'BlueStacks 5 Configuration'}
                  </strong>
                  <span>
                    {lang === 'tr'
                      ? 'BlueStacks 5 kullanıyorsanız varsayılan ADB portu 5555\'tir. Tek yapmanız gereken BlueStacks ayarlarından Android Hata Ayıklama (ADB) anahtarını açmaktır.'
                      : 'BlueStacks 5 connects via port 5555. Turn on the ADB toggle under Settings > Advanced.'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <h4 className="font-semibold text-slate-100 text-xs sm:text-sm">
                    {lang === 'tr' ? '1. BlueStacks 5 Ayarlarını Açın:' : '1. Open BlueStacks 5 Settings:'}
                  </h4>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pl-1">
                    <li>Sağ taraftaki Çark (Ayarlar) simgesine tıklayın.</li>
                    <li><strong>Görüntü (Display):</strong> Çözünürlüğü <span className="text-amber-300 font-mono">1280x720</span> ve Piksel Yoğunluğunu <span className="text-slate-200 font-mono">240 DPI</span> yapın.</li>
                    <li><strong>Gelişmiş (Advanced):</strong> Sayfayı aşağı kaydırın, <span className="text-sky-300 font-mono font-semibold">"Android Hata Ayıklama Köprüsü (ADB)"</span> anahtarını <strong>AÇIK</strong> konuma getirin.</li>
                    <li>Değişiklikleri kaydedip BlueStacks'i yeniden başlatın.</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <h4 className="font-semibold text-slate-100 text-xs sm:text-sm">
                    {lang === 'tr' ? '2. config.json veya Doğrudan Bağlantı:' : '2. Port Configuration:'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    İndirdiğiniz klasördeki <code className="text-amber-300 font-mono">config.json</code> dosyasını açıp portu <strong>5555</strong> yapın veya CMD ekranında manuel test için şu komutu verin:
                  </p>
                  <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 font-mono text-xs text-slate-200">
                    <code>adb connect 127.0.0.1:5555</code>
                    <button
                      onClick={() => copyToClipboard('adb connect 127.0.0.1:5555', 'bs_adb')}
                      className="text-slate-400 hover:text-white cursor-pointer ml-2"
                      title="Kopyala"
                    >
                      {copiedKey === 'bs_adb' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <h4 className="font-semibold text-slate-100 text-xs sm:text-sm mb-1">
                    {lang === 'tr' ? '3. Botu Başlatma:' : '3. Launching the Bot:'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Oyun açıldıktan sonra klasördeki <code className="text-emerald-300 font-mono">baslat.bat</code> dosyasına çift tıklayarak botu çalıştırabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INTERACTIVE CHECKLIST WIZARD */}
          {activeTab === 'steps' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">
                    {lang === 'tr' ? 'Kurulum Tamamlanma Durumu:' : 'Setup Progress:'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {completedCount} / 6 {lang === 'tr' ? 'adım tamamlandı' : 'steps completed'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400">
                  <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-full transition-all duration-300"
                      style={{ width: `${(completedCount / 6) * 100}%` }}
                    />
                  </div>
                  <span>{Math.round((completedCount / 6) * 100)}%</span>
                </div>
              </div>

              {/* Checklist items */}
              <div className="space-y-2">
                {[
                  {
                    key: 'python',
                    titleTr: '1. Python 3.10+ Kuruldu (Add to PATH seçilerek)',
                    titleEn: '1. Python 3.10+ Installed (with Add to PATH checked)',
                    descTr: 'CMD\'de "python --version" komutu çalıştığında Python sürümü görünüyor.'
                  },
                  {
                    key: 'emulator',
                    titleTr: '2. LDPlayer 9 Kuruldu & Çözünürlük 1280x720 Yapıldı',
                    titleEn: '2. LDPlayer 9 Installed & Resolution set to 1280x720',
                    descTr: 'Ayarlar > Gelişmiş > Tablet 1280x720 (240 DPI) seçildi ve kaydedildi.'
                  },
                  {
                    key: 'adb',
                    titleTr: '3. Emülatörde ADB Hata Ayıklama Açıldı',
                    titleEn: '3. ADB Debugging Enabled in Emulator',
                    descTr: 'LDPlayer Ayarlar > Diğer > ADB Hata Ayıklama "Açık (Yerel Bağlantı)" yapıldı.'
                  },
                  {
                    key: 'game',
                    titleTr: '4. Lands of Jail (com.justgame.jails) Açıldı',
                    titleEn: '4. Lands of Jail Opened in Emulator',
                    descTr: 'Oyun emülatörde açık ve ana üs veya krallık haritası ekranında bekliyor.'
                  },
                  {
                    key: 'zip',
                    titleTr: '5. Python ZIP İndirildi ve Klasöre Çıkarıldı',
                    titleEn: '5. Python ZIP Downloaded & Extracted',
                    descTr: 'Masaüstünde çıkarılmış klasörün içinde main.py ve baslat.bat dosyaları mevcut.'
                  },
                  {
                    key: 'run',
                    titleTr: '6. baslat.bat Çalıştırıldı ve Bot Bağlandı',
                    titleEn: '6. baslat.bat Executed & Bot Connected',
                    descTr: 'Siyah terminal penceresinde "[+] Modül Yüklendi" ve "[INFO] Döngü Başlatılıyor" yazısı görüldü.'
                  }
                ].map((item) => (
                  <div
                    key={item.key}
                    onClick={() => toggleCheck(item.key)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      checklist[item.key]
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-100'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                      checklist[item.key]
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-600 bg-slate-900'
                    }`}>
                      {checklist[item.key] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-xs sm:text-sm">
                        {lang === 'tr' ? item.titleTr : item.titleEn}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.descTr}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {completedCount === 6 && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-400 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    {lang === 'tr'
                      ? 'Tebrikler! Tüm adımları eksiksiz tamamladınız. Botunuz şu anda emülatörünüzde 7/24 otomatik kaynak topluyor ve savaşıyor.'
                      : 'Congratulations! All steps are complete. Your bot is now automating 24/7 on your PC.'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TROUBLESHOOTING (SIK HATALAR & ÇÖZÜMLER) */}
          {activeTab === 'troubleshoot' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>1. 'python' komutu tanınmıyor (is not recognized) hatası</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
                  <strong>Çözüm:</strong> Python kurulurken "Add python.exe to PATH" seçilmemiştir. Python kurulum dosyasını tekrar açıp <strong>Modify</strong> (veya kaldırıp baştan kurarken) en alttaki PATH kutucuğunu işaretleyin ve bilgisayarınızı bir kez yeniden başlatın.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>2. 'adb: device not found' veya 'cannot connect' hatası</span>
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed pl-6 space-y-1">
                  <p><strong>Çözüm:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>LDPlayer'ın tamamen açıldığından emin olun.</li>
                    <li>LDPlayer Ayarlar &gt; Diğer &gt; ADB Hata Ayıklama kapalıysa <strong>"Açık"</strong> yapıp emülatörü yeniden başlatın.</li>
                    <li>CMD komut satırını açıp şu komutla manuel bağlayın:</li>
                  </ul>
                  <div className="flex items-center justify-between bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 font-mono text-[11px] text-slate-200 mt-1">
                    <code>adb connect 127.0.0.1:5554</code>
                    <button
                      onClick={() => copyToClipboard('adb connect 127.0.0.1:5554', 'adb_ld')}
                      className="text-slate-400 hover:text-white cursor-pointer ml-2"
                    >
                      {copiedKey === 'adb_ld' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-sky-300 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>3. Tıklamalar yanlış veya boş yerlere basıyor</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
                  <strong>Çözüm:</strong> Emülatör çözünürlüğünüz tam olarak <strong>1280x720</strong> (Yatay / Tablet) olmalıdır. Eğer dikey modda veya 1920x1080 ise botun ekran tarayıcısı butonları ıskalayabilir. LDPlayer Ayarlar &gt; Gelişmiş &gt; Çözünürlük: 1280x720 (240 DPI) seçin.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>4. Birden fazla LDPlayer penceresi (Çoklu Oturum / Multi-Instance)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
                  <strong>Çözüm:</strong> LDPlayer'da her yeni açılan pencerenin portu 2 artar. Örneğin 1. pencere portu <code className="text-purple-300 font-mono">5554</code>, 2. pencere portu <code className="text-purple-300 font-mono">5556</code>, 3. pencere ise <code className="text-purple-300 font-mono">5558</code> olur. Bot klasöründeki <code className="text-amber-300 font-mono">config.json</code> dosyasındaki port numarasını buna göre güncelleyebilirsiniz.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {onOpenTabletGuide && (
            <button
              onClick={onOpenTabletGuide}
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{lang === 'tr' ? 'Bilgisayarım Yok (Tablet Rehberi)' : 'No PC Guide (Tablet)'}</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {onDownloadZip && (
              <button
                onClick={onDownloadZip}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'Python ZIP İndir' : 'Download ZIP'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors cursor-pointer"
            >
              {lang === 'tr' ? 'Anladım / Kapat' : 'Got it / Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
