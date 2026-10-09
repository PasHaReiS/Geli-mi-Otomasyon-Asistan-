import React, { useState } from 'react';
import { BookOpen, ChevronRight, X, Sparkles, Layers, Play, Download, Smartphone, Monitor } from 'lucide-react';

interface QuickStepsBarProps {
  lang: 'tr' | 'en';
  onOpenFullGuide: () => void;
  onOpenTabletGuide?: () => void;
  onOpenPcGuide?: () => void;
}

export const QuickStepsBar: React.FC<QuickStepsBarProps> = ({ 
  lang, 
  onOpenFullGuide, 
  onOpenTabletGuide,
  onOpenPcGuide 
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-slate-950/80 border border-emerald-500/20 rounded-xl p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm">
      <div className="flex items-start sm:items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5 sm:mt-0">
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <div className="font-semibold text-slate-100 flex items-center gap-1.5">
            <span>{lang === 'tr' ? 'Hızlı Kullanım Akışı:' : 'Quick Usage Flow:'}</span>
            <span className="font-normal text-slate-400 text-[11px] hidden sm:inline">
              {lang === 'tr' ? '(4 Kolay Adımda Başlatın)' : '(Launch in 4 Simple Steps)'}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-[11px] text-slate-300 mt-1 flex-wrap">
            <span className="flex items-center gap-1 font-mono text-emerald-300">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 inline-flex items-center justify-center text-[10px] font-bold">1</span>
              {lang === 'tr' ? 'Modülleri Seç' : 'Pick Tasks'}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="flex items-center gap-1 font-mono text-sky-300">
              <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 inline-flex items-center justify-center text-[10px] font-bold">2</span>
              {lang === 'tr' ? 'Simülasyonda Test Et' : 'Test Live'}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="flex items-center gap-1 font-mono text-amber-300">
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 inline-flex items-center justify-center text-[10px] font-bold">3</span>
              {lang === 'tr' ? 'ZIP İndir' : 'Export ZIP'}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="flex items-center gap-1 font-mono text-purple-300">
              <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 inline-flex items-center justify-center text-[10px] font-bold">4</span>
              {lang === 'tr' ? 'baslat.bat Çalıştır' : 'Run baslat.bat'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onOpenPcGuide && (
          <button
            onClick={onOpenPcGuide}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 transition-colors cursor-pointer shadow-sm"
          >
            <Monitor className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'tr' ? '💻 PC Kurulum Rehberi' : '💻 PC Setup Guide'}</span>
          </button>
        )}

        {onOpenTabletGuide && (
          <button
            onClick={onOpenTabletGuide}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 transition-colors cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'tr' ? '📱 Tablet (PC Yok)' : '📱 Tablet (No PC)'}</span>
          </button>
        )}

        <button
          onClick={onOpenFullGuide}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{lang === 'tr' ? 'Detaylı Rehberi Oku' : 'Open Full Guide'}</span>
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors rounded-lg"
          title={lang === 'tr' ? 'Kapat' : 'Dismiss'}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
