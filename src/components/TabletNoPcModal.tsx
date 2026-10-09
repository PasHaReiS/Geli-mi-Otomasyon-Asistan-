import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Tablet, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  Play, 
  ShieldCheck, 
  HelpCircle,
  Layers,
  ArrowRight,
  Server,
  Cloud,
  Monitor,
  ShieldAlert,
  Terminal,
  Key,
  Cpu
} from 'lucide-react';

interface TabletNoPcModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'tr' | 'en';
  onOpenPcGuide?: () => void;
}

export const TabletNoPcModal: React.FC<TabletNoPcModalProps> = ({ isOpen, onClose, lang, onOpenPcGuide }) => {
  const [activeTab, setActiveTab] = useState<'easy' | 'vps' | 'simulator' | 'termux'>('easy');
  const [vpsOs, setVpsOs] = useState<'windows' | 'linux' | 'cloudphone'>('windows');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Tablet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base sm:text-lg">
                  {lang === 'tr' ? '📱 Bilgisayarım Yok, Tabletim Var! Ne Yapmalıyım?' : '📱 I Don\'t Have a PC, Only a Tablet!'}
                </h3>
              </div>
              <p className="text-xs text-amber-300/90 mt-0.5">
                {lang === 'tr' 
                  ? 'Bilgisayarsız doğrudan tabletinizde Lands of Jail otomasyonu için kesin çözümler' 
                  : 'Zero-PC solutions for Lands of Jail on Android tablet/phone'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clear Alert explaining the confusion */}
        <div className="px-4 sm:px-6 pt-4 pb-1">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-amber-300">
                {lang === 'tr' ? 'Kafa Karışıklığını Hemen Giderelim:' : 'Let\'s Clarify Right Away:'}
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                {lang === 'tr'
                  ? 'İndirdiğiniz Python ZIP paketindeki ".bat" ve ".py" dosyaları Windows/Mac BİLGİSAYARLAR içindir. Ayrıca ADB kablosuz eşleştirme kodu da bir bilgisayarın tabletinize bağlanması için kullanılır. Bilgisayarınız YOKSA bu eşleştirmeyle boşuna uğraşmanıza gerek yoktur!'
                  : 'The downloaded ".bat" and ".py" files are made for PC. Wireless ADB pairing is normally for a PC connecting to your tablet. Without a PC, you do NOT need that pairing code!'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 pt-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('easy')}
              className={`py-2 px-2 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
                activeTab === 'easy'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{lang === 'tr' ? '1. Play Store' : '1. Play Store'}</span>
            </button>

            <button
              onClick={() => setActiveTab('vps')}
              className={`py-2 px-2 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
                activeTab === 'vps'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{lang === 'tr' ? '2. VPS (7/24 Bulut)' : '2. VPS (24/7 Cloud)'}</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`py-2 px-2 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
                activeTab === 'simulator'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate">{lang === 'tr' ? '3. Simülatör' : '3. Simulator'}</span>
            </button>

            <button
              onClick={() => setActiveTab('termux')}
              className={`py-2 px-2 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
                activeTab === 'termux'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate">{lang === 'tr' ? '4. Termux' : '4. Termux'}</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'easy' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{lang === 'tr' ? 'En Kolay ve Hızlı Yol: Play Store Otomasyon Uygulamaları' : 'Easiest Path: Play Store Automation Apps'}</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  {lang === 'tr'
                    ? 'Bilgisayara hiç dokunmadan, doğrudan tabletinize indireceğiniz bu resmi uygulamalar Lands of Jail oyununu otomatik oynatabilir. Kod yazmak veya eşleştirmek gerekmez!'
                    : 'Download these official Android apps directly from Google Play. They run Lands of Jail automatically without any computer or pairing codes!'}
                </p>
              </div>

              {/* App 1: Macrorify */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {lang === 'tr' ? 'EN ÇOK TAVSİYE EDİLEN' : 'HIGHLY RECOMMENDED'}
                      </span>
                      <h4 className="font-bold text-slate-100 text-sm">Macrorify - Image Auto Clicker</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {lang === 'tr'
                        ? 'Tıpkı bu Python botu gibi ekrandaki resimleri tanır (Goril boss, odun, ralli, saldırı butonları). Resim eşleme ile çalışır.'
                        : 'Image recognition macro app like our Python bot. Detects bosses, rallies, resources visually.'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 space-y-2 text-[11px] text-slate-300">
                  <div className="font-semibold text-slate-200">
                    {lang === 'tr' ? 'Tabletinize Nasıl Kurulur? (3 Adım):' : 'How to Setup (3 Steps):'}
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                    <li>Tabletinizde <strong>Google Play Store</strong>&apos;u açıp <strong>&quot;Macrorify&quot;</strong> aratın ve indirin.</li>
                    <li>Uygulamayı açıp ekranda istediği <strong>&quot;Erişilebilirlik (Accessibility)&quot;</strong> iznini aktif edin. (PC gerekmez).</li>
                    <li>Lands of Jail oyununu açın; ekranda beliren Macrorify panelinden tıklama döngülerinizi oluşturup başlatın!</li>
                  </ol>
                </div>
              </div>

              {/* App 2: Auto Clicker */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-slate-100 text-sm">Auto Clicker (Otomatik Tıklayıcı)</h4>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">QuickTouch / GC</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {lang === 'tr'
                    ? 'Eğer sadece kaynak toplamak, bina yükseltmek veya belirli butonlara sürekli basmak istiyorsanız en basit yoldur.'
                    : 'The simplest way to repeat button taps, collect resources, and keep the game active.'}
                </p>
                <div className="text-[11px] text-slate-300 space-y-1 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <div>1. Play Store&apos;dan <strong>&quot;Auto Clicker - Otomatik Tıklayıcı&quot;</strong> indirin.</div>
                  <div>2. Lands of Jail&apos;e girip ekranın üzerine 1, 2, 3 numaralı tıklama hedeflerini koyun.</div>
                  <div>3. <strong>Oynat</strong> butonuna basın; siz uyurken tabletiniz kendiliğinden tıklamaya devam eder!</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vps' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Security Alert Banner */}
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs space-y-2">
                <div className="font-bold flex items-center gap-2 text-rose-300 text-sm">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{lang === 'tr' ? 'ÖNEMLİ GÜVENLİK UYARISI: Sunucu Bilgilerinizi / Şifrenizi ASLA Paylaşmayın!' : 'CRITICAL SECURITY NOTICE: Never Share Your Server Credentials!'}</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  {lang === 'tr'
                    ? 'Sunucu IP adresi, root şifresi ve port bilgilerinizi yapay zekalar dahil hiçbir yere yazmayınız. Bir yapay zeka dış sunuculara doğrudan bağlanamaz; ancak bilgilerinizi paylaşmanıza hiç gerek kalmadan 2 dakikada kendinizin kurabileceği hazır adımları ve kopyalanabilir komutları aşağıda hazırladık!'
                    : 'Never post your VPS IP, root passwords, or SSH keys anywhere. AI agents cannot and should not connect directly to external servers. Instead, use the ready 1-click commands and steps below to easily set it up yourself in 2 minutes!'}
                </p>
              </div>

              {/* VPS OS Selector */}
              <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setVpsOs('windows')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                    vpsOs === 'windows'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>{lang === 'tr' ? '🪟 Windows VPS (RDP - Önerilen)' : 'Windows VPS (RDP)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVpsOs('linux')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                    vpsOs === 'linux'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{lang === 'tr' ? '🐧 Linux / Ubuntu VPS (SSH)' : 'Linux VPS (SSH)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVpsOs('cloudphone')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                    vpsOs === 'cloudphone'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{lang === 'tr' ? '📱 Bulut Telefon (Sıfır Ayar)' : 'Cloud Phone'}</span>
                </button>
              </div>

              {/* WINDOWS VPS */}
              {vpsOs === 'windows' && (
                <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-500/30 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {lang === 'tr' ? 'EN KOLAY VE GÖRSEL YÖNTEM' : 'EASIEST & VISUAL'}
                        </span>
                        <h4 className="font-bold text-slate-100 text-sm">
                          {lang === 'tr' ? 'Windows VPS + LDPlayer (Uzak Masaüstü)' : 'Windows VPS + LDPlayer'}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {lang === 'tr'
                          ? 'Tabletinize Google Play\'den ücretsiz Microsoft Remote Desktop indirip bilgisayar ekranına bağlanırsınız.'
                          : 'Connect to your Windows VPS from your tablet using the free Microsoft Remote Desktop app.'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 space-y-2.5 text-[11px] text-slate-300">
                    <div className="font-semibold text-slate-200">
                      {lang === 'tr' ? 'Kurulum Adımları (Tabletinizden 3 Dakika):' : 'Setup Steps (3 Mins from Tablet):'}
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
                      <li>
                        Google Play Store&apos;dan <strong>&quot;Microsoft Remote Desktop (RD Client)&quot;</strong> uygulamasını tabletinize indirin.
                      </li>
                      <li>
                        Uygulamayı açıp <strong>&quot;+&quot;</strong> butonuna basın, VPS sağlayıcınızın verdiği <strong>IP adresi, kullanıcı adı (Administrator) ve şifrenizi</strong> yazın.
                      </li>
                      <li>
                        Bağlan butonuna basın; tabletinizde devasa bir Windows masaüstü açılacaktır!
                      </li>
                      <li>
                        Masaüstündeki Chrome&apos;dan <strong>LDPlayer 9</strong> indirip kurun ve içine <strong>Lands of Jail</strong>&apos;i yükleyin.
                      </li>
                      <li>
                        Bu web sitesini VPS içinden açıp sağ üstteki <strong>&quot;Python ZIP İndir&quot;</strong> butonuna basın, klasördeki <strong>install.bat</strong> (veya <strong>baslat.bat</strong>) dosyasını çift tıklayın!
                      </li>
                    </ol>

                    {/* Windows Install Script (install.bat) */}
                    <div className="mt-3 p-3 rounded-lg bg-slate-950/80 border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-amber-300 flex items-center gap-1.5 text-[11px]">
                          <Monitor className="w-3.5 h-3.5 text-amber-400" />
                          <span>Windows & Windows VPS Otomatik Kurulum Dosyası (install.bat)</span>
                        </div>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-semibold">
                          {lang === 'tr' ? 'Tek Tıkla Çalıştır' : '1-Click Run'}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[10px]">
                        {lang === 'tr'
                          ? 'İndirdiğiniz ZIP paketinde bu dosya hazırdır. Çift tıkladığınızda pip günceller, paketleri yükler, IP/Port sorup config.json dosyasını yazar ve botu açar:'
                          : 'Included in the downloaded ZIP. Double-click to auto-install dependencies, configure IP/Port and launch:'}
                      </p>
                      <div className="relative bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-[10px] text-amber-300 overflow-x-auto max-h-44">
                        <pre className="whitespace-pre">{`@echo off
chcp 65001 >nul
echo ==========================================
echo  Titanxis / Otomasyon Botu Kurulumu
echo ==========================================

python -m pip install --upgrade pip
if exist requirements.txt (
    python -m pip install -r requirements.txt
) else (
    python -m pip install requests Pillow adbutils
)

echo.
set /p user_ip="Cihaz IP adresini girin [Varsayilan: 192.168.1.8]: "
if "%user_ip%"=="" set user_ip=192.168.1.8

set /p user_port="ADB Port numarasini girin [Varsayilan: 41209]: "
if "%user_port%"=="" set user_port=41209

(
echo {
echo   "active_modules": ["modules.gather", "modules.monster", "modules.rally"],
echo   "adb_settings": {
echo     "deviceType": "ldplayer",
echo     "host": "%user_ip%",
echo     "port": %user_port%,
echo     "serial": "%user_ip%:%user_port%"
echo   },
echo   "screenResolution": "1280x720",
echo   "orientation": "landscape",
echo   "gamePackage": "com.justgame.jails",
echo   "autoRestartOnCrash": true,
echo   "antiBan": { "enabled": true, "clickJitterPx": 6, "bezierCurveSwipe": true, "randomDelayFactor": 1.15, "hourlyBreakMinutes": 4 },
echo   "telegramNotifications": { "enabled": false, "botToken": "", "chatid": "", "alertOnCaptcha": true, "alertOnAttack": true, "alertOnShieldLow": true }
echo }
) > config.json

echo.
echo Kurulum tamamlandı! Bot şimdi otomatik başlatılıyor...
python main.py
pause`}</pre>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(`@echo off
chcp 65001 >nul
echo ==========================================
echo  Titanxis / Otomasyon Botu Kurulumu
echo ==========================================

python -m pip install --upgrade pip
if exist requirements.txt (
    python -m pip install -r requirements.txt
) else (
    python -m pip install requests Pillow adbutils
)

echo.
set /p user_ip="Cihaz IP adresini girin [Varsayilan: 192.168.1.8]: "
if "%user_ip%"=="" set user_ip=192.168.1.8

set /p user_port="ADB Port numarasini girin [Varsayilan: 41209]: "
if "%user_port%"=="" set user_port=41209

(
echo {
echo   "active_modules": ["modules.gather", "modules.monster", "modules.rally"],
echo   "adb_settings": {
echo     "deviceType": "ldplayer",
echo     "host": "%user_ip%",
echo     "port": %user_port%,
echo     "serial": "%user_ip%:%user_port%"
echo   },
echo   "screenResolution": "1280x720",
echo   "orientation": "landscape",
echo   "gamePackage": "com.justgame.jails",
echo   "autoRestartOnCrash": true,
echo   "antiBan": { "enabled": true, "clickJitterPx": 6, "bezierCurveSwipe": true, "randomDelayFactor": 1.15, "hourlyBreakMinutes": 4 },
echo   "telegramNotifications": { "enabled": false, "botToken": "", "chatid": "", "alertOnCaptcha": true, "alertOnAttack": true, "alertOnShieldLow": true }
echo }
) > config.json

echo.
echo Kurulum tamamlandı! Bot şimdi otomatik başlatılıyor...
python main.py
pause`, 'win-install-script')}
                          className="absolute top-2 right-2 px-2.5 py-1 bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 rounded flex items-center gap-1 text-[10px] transition-all"
                        >
                          {copiedCode === 'win-install-script' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Kopyalandı!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Kopyala</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 p-2.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>
                        {lang === 'tr'
                          ? 'Bot çalıştıktan sonra tabletinizdeki Remote Desktop uygulamasını tamamen kapatabilirsiniz! Sunucu 7/24 elektrik kesintisi olmadan oyunu oynamaya devam eder.'
                          : 'Once started, close Remote Desktop on your tablet. The VPS continues running 24/7 in the cloud!'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* LINUX VPS */}
              {vpsOs === 'linux' && (
                <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {lang === 'tr' ? 'GELİŞMİŞ & DÜŞÜK MALİYET' : 'ADVANCED & LOW COST'}
                        </span>
                        <h4 className="font-bold text-slate-100 text-sm">
                          {lang === 'tr' ? 'Linux (Ubuntu / Debian) SSH ile Kurulum' : 'Linux (Ubuntu/Debian) SSH Setup'}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {lang === 'tr'
                          ? 'Tabletinize Google Play\'den "JuiceSSH" veya "Termux" indirerek sunucunuza bağlanıp aşağıdaki hazır komutları tek tıkla yapıştırın.'
                          : 'Connect to your Linux server via JuiceSSH/Termux and paste the 1-click commands below.'}
                      </p>
                    </div>
                  </div>

                  {/* Step 1: Connect */}
                  <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 space-y-2 text-[11px] text-slate-300">
                    <div className="font-semibold text-emerald-400">1. Adım: Tabletten SSH ile Sunucuya Bağlanın</div>
                    <p className="text-slate-400">
                      Play Store&apos;dan <strong>JuiceSSH</strong> indirin. &quot;Connections -&gt; +&quot; diyerek sunucu IP&apos;nizi ve root şifrenizi girip terminale bağlanın.
                    </p>
                  </div>

                  {/* Step 2: Auto Install Script (Titanxis) */}
                  <div className="bg-slate-900/90 rounded-lg p-3 border border-emerald-500/30 space-y-2.5 text-[11px] text-slate-300">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        <span>2. Adım: Titanxis Otomatik Kurulum Betiği (install.sh)</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-semibold">
                        {lang === 'tr' ? 'Önerilen' : 'Recommended'}
                      </span>
                    </div>
                    <p className="text-slate-400">
                      {lang === 'tr'
                        ? 'Sunucu terminalinize aşağıdaki betiği yapıştırıp Enter\'a basın. Tüm bağımlılıkları yükler, config.json oluşturur ve botu başlatır:'
                        : 'Paste this script directly into your server terminal to auto-install dependencies and run the bot:'}
                    </p>
                    <div className="relative bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-[10px] text-amber-300 overflow-x-auto max-h-48">
                      <pre className="whitespace-pre">{`cat << 'EOF' > install.sh
#!/bin/bash
echo "=========================================="
echo " Titanxis / Otomasyon Botu Kurulumu"
echo "=========================================="

pip install --upgrade pip
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    pip install requests Pillow adbutils
fi

echo ""
read -p "Cihaz IP adresini girin [Varsayılan: 192.168.1.8]: " user_ip
read -p "ADB Port numarasını girin [Varsayılan: 41209]: " user_port

user_ip=\${user_ip:-"192.168.1.8"}
user_port=\${user_port:-"41209"}

cat << EOF > config.json
{
  "active_modules": ["modules.gather", "modules.monster", "modules.rally"],
  "adb_settings": {
    "deviceType": "ldplayer",
    "host": "$user_ip",
    "port": $user_port,
    "serial": "$user_ip:$user_port"
  },
  "screenResolution": "1280x720",
  "orientation": "landscape",
  "gamePackage": "com.justgame.jails",
  "autoRestartOnCrash": true,
  "antiBan": { "enabled": true, "clickJitterPx": 6, "bezierCurveSwipe": true, "randomDelayFactor": 1.15, "hourlyBreakMinutes": 4 },
  "telegramNotifications": { "enabled": false, "botToken": "", "chatid": "", "alertOnCaptcha": true, "alertOnAttack": true, "alertOnShieldLow": true }
}
EOF

echo ""
echo "Kurulum tamamlandı! Bot şimdi otomatik başlatılıyor..."
python3 main.py
EOF
chmod +x install.sh
./install.sh`}</pre>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(`cat << 'EOF' > install.sh
#!/bin/bash
echo "=========================================="
echo " Titanxis / Otomasyon Botu Kurulumu"
echo "=========================================="

pip install --upgrade pip
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    pip install requests Pillow adbutils
fi

echo ""
read -p "Cihaz IP adresini girin [Varsayılan: 192.168.1.8]: " user_ip
read -p "ADB Port numarasını girin [Varsayılan: 41209]: " user_port

user_ip=\${user_ip:-"192.168.1.8"}
user_port=\${user_port:-"41209"}

cat << EOF > config.json
{
  "active_modules": ["modules.gather", "modules.monster", "modules.rally"],
  "adb_settings": {
    "deviceType": "ldplayer",
    "host": "$user_ip",
    "port": $user_port,
    "serial": "$user_ip:$user_port"
  },
  "screenResolution": "1280x720",
  "orientation": "landscape",
  "gamePackage": "com.justgame.jails",
  "autoRestartOnCrash": true,
  "antiBan": { "enabled": true, "clickJitterPx": 6, "bezierCurveSwipe": true, "randomDelayFactor": 1.15, "hourlyBreakMinutes": 4 },
  "telegramNotifications": { "enabled": false, "botToken": "", "chatid": "", "alertOnCaptcha": true, "alertOnAttack": true, "alertOnShieldLow": true }
}
EOF

echo ""
echo "Kurulum tamamlandı! Bot şimdi otomatik başlatılıyor..."
python3 main.py
EOF
chmod +x install.sh
./install.sh`, 'titanxis-script')}
                        className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px]"
                        title="Betiği Kopyala"
                      >
                        {copiedCode === 'titanxis-script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode === 'titanxis-script' ? (lang === 'tr' ? 'Kopyalandı!' : 'Copied!') : (lang === 'tr' ? 'Betiği Kopyala' : 'Copy Script')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Step 3: Base packages */}
                  <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 space-y-2 text-[11px] text-slate-300">
                    <div className="font-semibold text-emerald-400">3. Adım: Sistem Paketleri (ADB & Python)</div>
                    <div className="flex items-center justify-between gap-2 bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto">
                      <code>sudo apt update && sudo apt install -y python3-pip python3-venv git adb screen</code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('sudo apt update && sudo apt install -y python3-pip python3-venv git adb screen', 'apt-install')}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
                        title="Kopyala"
                      >
                        {copiedCode === 'apt-install' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Step 4: 24/7 Screen background command */}
                  <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 space-y-2 text-[11px] text-slate-300">
                    <div className="font-semibold text-emerald-400">4. Adım: 7/24 Arka Planda Kesintisiz Çalıştırma Komutu</div>
                    <p className="text-slate-400">
                      Termux veya JuiceSSH uygulamasını kapatsanız bile botun sunucuda sonsuza kadar açık kalması için <strong>screen</strong> kullanın:
                    </p>
                    <div className="flex items-center justify-between gap-2 bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                      <code>screen -d -m -S lojbot python3 bot_runner.py</code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('screen -d -m -S lojbot python3 bot_runner.py', 'screen-cmd')}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
                        title="Kopyala"
                      >
                        {copiedCode === 'screen-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      💡 Bot durumunu tekrar canlı izlemek istediğinizde: <code className="text-amber-300 font-mono">screen -r lojbot</code> yazabilirsiniz.
                    </div>
                  </div>
                </div>
              )}

              {/* CLOUD PHONE */}
              {vpsOs === 'cloudphone' && (
                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-slate-100 text-sm">
                      {lang === 'tr' ? 'Bulut Telefon (Cloud Phone - Redfinger / LDCloud)' : 'Cloud Phone Services'}
                    </h4>
                    <span className="text-[10px] text-sky-400 bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 rounded font-mono">
                      {lang === 'tr' ? 'Sıfır Sunucu Bilgisi' : 'Zero Setup'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'tr'
                      ? 'Sunucu komutlarıyla, SSH ile veya Windows kurmakla hiç uğraşmak istemiyorsanız doğrudan bulutta çalışan hazır Android telefon kiralayabilirsiniz.'
                      : 'If you don\'t want to manage Linux/Windows servers, rent a ready cloud Android phone.'}
                  </p>
                  <div className="text-[11px] text-slate-300 space-y-1.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <div>1. Tabletinize <strong>Redfinger</strong> veya <strong>LDCloud</strong> uygulamasını indirin.</div>
                    <div>2. Aylık küçük bir ücrete sanal bulut Android cihaz açın.</div>
                    <div>3. Cihazın içine Lands of Jail ve Play Store&apos;dan <strong>Macrorify</strong> veya <strong>Auto Clicker</strong> kurun.</div>
                    <div>4. Başlatın ve tableti kapatın; bulut telefon elektrik veya internet kesintisi olmadan 7/24 oyunda kalır!</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'simulator' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-500/30 text-sky-200 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-sky-300">
                  <Play className="w-4 h-4" />
                  <span>{lang === 'tr' ? 'Şu An Açık Olan Web Paneli Tabletinizde Ne Yapar?' : 'What does this web panel do on your tablet?'}</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  {lang === 'tr'
                    ? 'Şu an bulunduğunuz web sitesi, Lands of Jail oyununun tam bir strateji simülatörüdür. Tabletinizin internet tarayıcısında (Chrome) doğrudan çalışır.'
                    : 'This web app is a full strategy simulator for Lands of Jail. It runs directly inside your tablet browser.'}
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-emerald-400 block mb-1">1. Canlı Simülatör (Başlat Butonu):</strong>
                  Ekranın üstündeki &quot;Başlat&quot; butonuna basarak kaynak toplama, goril boss avlama ve ralli simülasyonunu izleyebilirsiniz.
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-amber-400 block mb-1">2. Kale / TAG Bulucu Modalı:</strong>
                  Üst menüdeki &quot;Kale / TAG Bulucu&quot; butonuna basıp rakip oyuncuların isimlerini veya ittifak TAG&apos;lerini aratarak haritada nerede olduklarını görebilirsiniz.
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-sky-400 block mb-1">3. Sanal Klavye:</strong>
                  Oyun içi hızlı koordinat ve mesaj şablonlarını buradan oluşturup kopyalayabilirsiniz.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'termux' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-purple-300">
                  <Smartphone className="w-4 h-4" />
                  <span>{lang === 'tr' ? 'İllaki Python Botunu Tabletimde Çalıştırmak İstiyorum Diyorsanız:' : 'Run Python Locally on Tablet with Termux:'}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {lang === 'tr'
                    ? 'Bilgisayarsız olarak tabletin kendi içine terminal kurup indirdiğiniz Python botunu çalıştırmak mümkündür. Bunun sırrı: Tabletin kendi kendine kablosuz eşleşmesidir (Local Loopback).'
                    : 'You can run Python inside the tablet via Termux. The tablet pairs with itself over local loopback WiFi.'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-[11px] text-slate-300">
                <div className="font-semibold text-slate-200">
                  {lang === 'tr' ? 'Bölünmüş Ekran (Split-Screen) Yöntemi:' : 'Split Screen Local Pairing:'}
                </div>
                <ol className="list-decimal list-inside space-y-1.5 pl-1">
                  <li>Tabletinize F-Droid veya Play Store&apos;dan <strong>Termux</strong> kurun.</li>
                  <li>Tabletin <strong>Bölünmüş Ekran</strong> modunu açın:
                    <div className="ml-4 mt-1 p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-amber-300">
                      Sol Yarım: Ayarlar &gt; Geliştirici Seçenekleri &gt; Kablosuz Hata Ayıklama &gt; Cihazı eşle<br/>
                      Sağ Yarım: Termux uygulaması
                    </div>
                  </li>
                  <li>Termux ekranında şu komutu yazın:
                    <div className="mt-1 flex items-center justify-between p-2 rounded bg-black border border-slate-800 font-mono text-[11px] text-emerald-400">
                      <code>adb pair 127.0.0.1:PORT KOD</code>
                      <button 
                        onClick={() => copyToClipboard('adb pair 127.0.0.1:PORT KOD', 'pair')}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        {copiedCode === 'pair' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </li>
                  <li>Sol tarafta çıkan 6 haneli kod ve portu sağ taraftaki Termux&apos;a girdiğinizde tablet <strong>BİLGİSAYARSIZ kendi kendine bağlanır!</strong></li>
                </ol>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
                <span className="text-amber-300 font-semibold">Tavsiyemiz:</span> Bu yöntem komut satırı gerektirdiği için zahmetlidir. Bilgisayarınız yoksa en rahatı <strong>&quot;1. Yol: Macrorify&quot;</strong> uygulamasını kullanmaktır!
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          {onOpenPcGuide ? (
            <button
              onClick={() => {
                onClose();
                onOpenPcGuide();
              }}
              className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
            >
              <Monitor className="w-4 h-4" />
              <span>{lang === 'tr' ? '💻 Bilgisayarınız Varsa: PC Kurulum Rehberi' : '💻 If You Have a PC: PC Setup Guide'}</span>
            </button>
          ) : (
            <div className="text-xs text-slate-400 hidden sm:block">
              {lang === 'tr' ? 'Sorularınız veya yardım için dilediğiniz zaman yazabilirsiniz.' : 'Feel free to ask any questions.'}
            </div>
          )}
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <span>{lang === 'tr' ? 'Anladım, Kapat' : 'Got It, Close'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
