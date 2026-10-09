import React from 'react';
import { X, BookOpen, Terminal, Shield, Cpu, ExternalLink } from 'lucide-react';

interface DocsModalProps {
  lang: 'tr' | 'en';
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ lang, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">
                {lang === 'tr' ? 'Otomasyon Mimarisi & Çalıştırma Rehberi' : 'Architecture & Execution Guide'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'tr' ? 'Dinamik Python importlib modül yapısı ve yerel kurulum' : 'Dynamic Python importlib loop & local execution'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs text-slate-300 leading-relaxed">
          {/* Section 1: Dynamic Architecture */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-emerald-400 flex items-center gap-1.5 text-sm">
              <Cpu className="w-4 h-4" />
              <span>{lang === 'tr' ? '1. Dinamik Modül Yükleme Mantığı' : '1. Dynamic Module Architecture'}</span>
            </h4>
            <p>
              {lang === 'tr' ? (
                <>
                  Python kodunuzdaki <code className="text-pink-400 font-mono">importlib.import_module(gorev)</code>{' '}
                  çağrısı sayesinde bot kodunu yeniden derlemeye veya ana dosyayı değiştirmeye gerek kalmadan
                  yeni görevler ekleyip çıkarabilirsiniz.
                </>
              ) : (
                <>
                  Thanks to <code className="text-pink-400 font-mono">importlib.import_module(task)</code>, tasks
                  can be dynamically hot-loaded and configured without restarting the core bot script.
                </>
              )}
            </p>
            <div className="p-2.5 rounded-lg bg-black/60 font-mono text-[11px] text-slate-300">
              <span className="text-slate-500"># Her modül bağımsız bir dosya ve calistir() fonksiyonuna sahiptir:</span><br/>
              <span className="text-pink-400">def</span> <span className="text-emerald-400">calistir</span>():<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;... # Ekranı tara ve işlemi yap<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-400">return</span> <span className="text-amber-300">True</span> # veya devam_et = False
            </div>
          </div>

          {/* Section 2: Local Run steps */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-sky-400 flex items-center gap-1.5 text-sm">
              <Terminal className="w-4 h-4" />
              <span>{lang === 'tr' ? '2. Bilgisayarınızda Çalıştırma (3 Adım)' : '2. Running on Your Computer (3 Steps)'}</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
              <li>
                <strong className="text-white">ZIP Dosyasını İndirin:</strong> Sağ üstteki{' '}
                <span className="text-emerald-400 font-semibold">&quot;Python ZIP İndir&quot;</span> butonuna tıklayıp arşivi masaüstünüze çıkarın.
              </li>
              <li>
                <strong className="text-white">Emülatörü Açın:</strong> LDPlayer veya BlueStacks ayarlarından &quot;ADB Hata Ayıklama (ADB Debugging)&quot; seçeneğini etkinleştirin.
              </li>
              <li>
                <strong className="text-white">Çift Tıklayın:</strong> Windows için <code className="text-sky-300 font-mono">baslat.bat</code> dosyasına çift tıklayın. Gerekli kütüphaneleri otomatik yükler ve <code className="text-sky-300 font-mono">python main.py</code> komutunu çalıştırır!
              </li>
            </ol>
          </div>

          {/* Section 3: Anti-Ban Protection */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-amber-400 flex items-center gap-1.5 text-sm">
              <Shield className="w-4 h-4" />
              <span>{lang === 'tr' ? '3. Ban Koruması & İnsan Davranışı (Anti-Ban)' : '3. Anti-Ban Safety'}</span>
            </h4>
            <p className="text-slate-400">
              Oyun sunucularının otomatik tıklama tespit algoritmalarını engellemek için bot motorumuz:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
              <li>Her dokunmada ±6 piksel rastgele Gauss sapması uygular.</li>
              <li>Tıklama süreleri arasında 0.3s - 0.7s rastgele mikro gecikmeler (jitter) ekler.</li>
              <li>Sonsuz döngüyü CPU dostu <code className="text-amber-300 font-mono">time.sleep(1)</code> ile dengeler.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button onClick={onClose} className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors">
            {lang === 'tr' ? 'Anladım' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
