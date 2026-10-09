import React, { useState } from 'react';
import { X, Sliders, Smartphone, ShieldCheck, Bell, Check, Zap } from 'lucide-react';
import { AdbConfig } from '../types';

interface AdbSettingsModalProps {
  lang: 'tr' | 'en';
  config: AdbConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newConfig: AdbConfig) => void;
  onOpenTabletNoPcGuide?: () => void;
}

export const AdbSettingsModal: React.FC<AdbSettingsModalProps> = ({
  lang,
  config,
  isOpen,
  onClose,
  onSave,
  onOpenTabletNoPcGuide
}) => {
  if (!isOpen) return null;

  const [localConfig, setLocalConfig] = useState<AdbConfig>(JSON.parse(JSON.stringify(config)));
  const [tab, setTab] = useState<'emulator' | 'antiban' | 'notifications'>('emulator');

  const handleDevicePresetChange = (device: AdbConfig['deviceType']) => {
    let port = 5554;
    let host = localConfig.host;
    if (device === 'bluestacks') port = 5555;
    if (device === 'nox') port = 62001;
    if (device === 'mumu') port = 7555;
    if (device === 'tablet') {
      port = 5555;
      if (host === '127.0.0.1') host = '192.168.1.100';
    }

    setLocalConfig((prev) => ({
      ...prev,
      deviceType: device,
      host,
      port
    }));
  };

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">
                {lang === 'tr' ? 'ADB Emülatör & Güvenlik Ayarları' : 'ADB & Security Settings'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'tr' ? 'Cihaz köprüsü ve insan davranışı taklitçisi' : 'Device bridge and human behavior mimic'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 text-xs">
          <button
            onClick={() => setTab('emulator')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              tab === 'emulator'
                ? 'border-sky-400 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{lang === 'tr' ? 'Emülatör & ADB' : 'Emulator & ADB'}</span>
          </button>

          <button
            onClick={() => setTab('antiban')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              tab === 'antiban'
                ? 'border-emerald-400 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'tr' ? 'Anti-Ban & Jitter' : 'Anti-Ban & Jitter'}</span>
          </button>

          <button
            onClick={() => setTab('notifications')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              tab === 'notifications'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{lang === 'tr' ? 'Telegram Uyarıları' : 'Alerts'}</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-1 text-xs text-slate-300 space-y-4">
          {tab === 'emulator' && (
            <div className="space-y-3">
              <div>
                <label className="block font-medium text-slate-200 mb-1.5">
                  {lang === 'tr' ? 'Emülatör Profili' : 'Emulator Profile'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ldplayer', label: 'LDPlayer 9 (Önerilen)', port: 5554 },
                    { id: 'bluestacks', label: 'BlueStacks 5', port: 5555 },
                    { id: 'nox', label: 'NoxPlayer', port: 62001 },
                    { id: 'tablet', label: '📱 Tablet / Telefon (WiFi)', port: 5555 },
                    { id: 'custom', label: 'Özel ADB Adresi', port: localConfig.port }
                  ].map((dev) => (
                    <button
                      key={dev.id}
                      type="button"
                      onClick={() => handleDevicePresetChange(dev.id as any)}
                      className={`p-2.5 rounded-lg border text-left transition-colors ${
                        localConfig.deviceType === dev.id
                          ? 'bg-sky-500/10 border-sky-500/50 text-sky-200'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-slate-200">{dev.label}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">Port: {dev.port}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tablet & Wireless Pairing Code Step-by-Step Guide */}
              {(localConfig.deviceType === 'tablet' || localConfig.deviceType === 'custom') && (
                <div className="space-y-3">
                  {/* Alert if user has NO PC */}
                  <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-amber-300">🚨 Bilgisayarınız Yok mu? (Sadece Tablet/Telefon)</span>
                      {onOpenTabletNoPcGuide && (
                        <button
                          type="button"
                          onClick={onOpenTabletNoPcGuide}
                          className="px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-bold text-[11px] hover:bg-amber-300 transition-colors shadow-sm"
                        >
                          Bilgisayarsız Çözümü Gör
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Bilgisayarınız yoksa eşleştirme koduyla uğraşmanıza gerek yoktur! Tablete doğrudan Play Store&apos;dan <strong className="text-emerald-300">Macrorify</strong> veya <strong className="text-emerald-300">Auto Clicker</strong> yükleyerek 2 dakikada botu çalıştırabilirsiniz.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-sky-950/40 border border-sky-500/30 text-sky-200 space-y-2">
                    <div className="font-semibold text-xs flex items-center gap-1.5 text-sky-300">
                      <span>📱 Bilgisayarınız Varsa: Eşleşme Kodu Ekranda Nerede Çıkar?</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
                      <li>
                        Tablette: <strong className="text-white">Ayarlar &gt; Geliştirici Seçenekleri</strong> menüsünü açın.
                      </li>
                      <li>
                        <span className="text-amber-300 font-semibold">⚠️ EN ÇOK YAPILAN HATA:</span> &quot;Kablosuz Hata Ayıklama&quot; anahtarına değil, <strong className="text-amber-200 underline">YAZININ KENDİSİNİN ÜSTÜNE TIKLAYIN</strong>.
                      </li>
                      <li>
                        Açılan alt sayfada <strong className="text-emerald-300">&quot;Cihazı eşleme koduyla eşle&quot;</strong> butonuna basın.
                      </li>
                      <li>
                        Ekrana açılan pop-up penceresinde <strong className="text-amber-400">6 Haneli Wi-Fi Eşleme Kodu</strong> ve altında <strong className="text-sky-300">IP adresi:Port</strong> (Örn: <code>192.168.1.35:41235</code>) görünür!
                      </li>
                    </ol>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    {localConfig.deviceType === 'tablet' ? 'Tablet Yerel IP Adresi' : 'Host IP'}
                  </label>
                  <input
                    type="text"
                    value={localConfig.host}
                    onChange={(e) => setLocalConfig({ ...localConfig, host: e.target.value })}
                    placeholder={localConfig.deviceType === 'tablet' ? '192.168.1.XX' : '127.0.0.1'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 font-mono text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">ADB Port</label>
                  <input
                    type="number"
                    value={localConfig.port}
                    onChange={(e) => setLocalConfig({ ...localConfig, port: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 font-mono text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  {lang === 'tr' ? 'Ekran Çözünürlüğü' : 'Resolution'}
                </label>
                <select
                  value={localConfig.screenResolution}
                  onChange={(e) => setLocalConfig({ ...localConfig, screenResolution: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-slate-200"
                >
                  <option value="1280x720">1280x720 (Standart 16:9 - Lands of Jail Önerilen)</option>
                  <option value="1920x1080">1920x1080 (Full HD)</option>
                  <option value="960x540">960x540 (Düşük Donanım / Çoklu Bot)</option>
                </select>
              </div>

              {/* Lands of Jail Game Package Setting */}
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-indigo-300 text-xs flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-indigo-400" />
                    {lang === 'tr' ? 'Hedef Oyun Paketi (Android Package)' : 'Target Game Package'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLocalConfig({ ...localConfig, gamePackage: 'com.justgame.jails', autoRestartOnCrash: true })}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  >
                    Lands of Jail Seç
                  </button>
                </div>
                <input
                  type="text"
                  value={localConfig.gamePackage || 'com.justgame.jails'}
                  onChange={(e) => setLocalConfig({ ...localConfig, gamePackage: e.target.value })}
                  placeholder="com.justgame.jails"
                  className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 font-mono text-slate-200 text-xs"
                />
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={localConfig.autoRestartOnCrash ?? true}
                    onChange={(e) => setLocalConfig({ ...localConfig, autoRestartOnCrash: e.target.checked })}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-[11px] text-slate-300">
                    {lang === 'tr' ? 'Oyun kapanırsa otomatik yeniden başlat (Crash Guard)' : 'Auto-restart Lands of Jail if game crashes'}
                  </span>
                </label>
              </div>
            </div>
          )}

          {tab === 'antiban' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs">
                {lang === 'tr'
                  ? 'Anti-Ban motoru, oyun sunucularının otomatik tıklama tespit algoritmalarını atlatmak için insan el hareketlerini simüle eder.'
                  : 'Anti-Ban engine simulates human touches and jitter to bypass bot detection.'}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-medium text-slate-200">
                    {lang === 'tr' ? 'Rastgele Koordinat Sapması (Click Jitter)' : 'Click Jitter Offset'}
                  </label>
                  <span className="font-mono text-emerald-400 font-semibold">
                    ±{localConfig.antiBan.clickJitterPx} px
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={15}
                  value={localConfig.antiBan.clickJitterPx}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      antiBan: { ...localConfig.antiBan, clickJitterPx: Number(e.target.value) }
                    })
                  }
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-medium text-slate-200">
                    {lang === 'tr' ? 'Saat Başı Dinlenme Molası' : 'Hourly Rest Break'}
                  </label>
                  <span className="font-mono text-emerald-400 font-semibold">
                    {localConfig.antiBan.hourlyBreakMinutes} {lang === 'tr' ? 'dakika' : 'mins'}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={localConfig.antiBan.hourlyBreakMinutes}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      antiBan: { ...localConfig.antiBan, hourlyBreakMinutes: Number(e.target.value) }
                    })
                  }
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div>
                  <div className="font-medium text-slate-200">Bezier Eğrisi ile Kaydırma (Swipe)</div>
                  <div className="text-[11px] text-slate-400">Doğrusal olmayan doğal parmak kaydırmaları</div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setLocalConfig({
                      ...localConfig,
                      antiBan: { ...localConfig.antiBan, bezierCurveSwipe: !localConfig.antiBan.bezierCurveSwipe }
                    })
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                    localConfig.antiBan.bezierCurveSwipe ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ${
                      localConfig.antiBan.bezierCurveSwipe ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div>
                  <div className="font-medium text-slate-200">Telegram Bildirimleri</div>
                  <div className="text-[11px] text-slate-400">Kritik durumlarda telefonunuza anlık mesaj iletir</div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setLocalConfig({
                      ...localConfig,
                      telegramNotifications: {
                        ...localConfig.telegramNotifications,
                        enabled: !localConfig.telegramNotifications.enabled
                      }
                    })
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                    localConfig.telegramNotifications.enabled ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ${
                      localConfig.telegramNotifications.enabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {localConfig.telegramNotifications.enabled && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Bot Token</label>
                    <input
                      type="text"
                      placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                      value={localConfig.telegramNotifications.botToken}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          telegramNotifications: { ...localConfig.telegramNotifications, botToken: e.target.value }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 font-mono text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Chat ID</label>
                    <input
                      type="text"
                      placeholder="987654321"
                      value={localConfig.telegramNotifications.chatId}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          telegramNotifications: { ...localConfig.telegramNotifications, chatId: e.target.value }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 font-mono text-slate-200"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition-colors">
            {lang === 'tr' ? 'Kapat' : 'Close'}
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{lang === 'tr' ? 'Kaydet' : 'Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
