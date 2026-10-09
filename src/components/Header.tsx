import React from 'react';
import { 
  Terminal, 
  Settings, 
  Sliders, 
  Download, 
  Play, 
  Pause, 
  RotateCcw, 
  StepForward, 
  ShieldCheck, 
  Cpu, 
  Layers,
  BookOpen,
  Crosshair,
  Tablet,
  Monitor
} from 'lucide-react';
import { SimulatorState } from '../services/simulatorEngine';

interface HeaderProps {
  lang: 'tr' | 'en';
  setLang: (lang: 'tr' | 'en') => void;
  state: SimulatorState;
  activeModulesCount: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep: () => void;
  onOpenPresets: () => void;
  onOpenAdbSettings: () => void;
  onDownloadZip: () => void;
  onOpenGuide?: () => void;
  onOpenPlayerFinder?: () => void;
  onOpenTabletGuide?: () => void;
  onOpenPcGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  state,
  activeModulesCount,
  onStart,
  onPause,
  onReset,
  onStep,
  onOpenPresets,
  onOpenAdbSettings,
  onDownloadZip,
  onOpenGuide,
  onOpenPlayerFinder,
  onOpenTabletGuide,
  onOpenPcGuide
}) => {
  const formatUptime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Status */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-slate-100 text-base tracking-tight">
                {lang === 'tr' ? 'Gelişmiş Otomasyon Asistanı' : 'Advanced Automation Assistant'}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Lands of Jail
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="inline-block w-2 h-2 rounded-full animate-pulse bg-emerald-500" />
                <span className="font-mono text-[11px] text-emerald-400">
                  {state.isRunning 
                    ? (state.isPaused ? (lang === 'tr' ? 'Duraklatıldı' : 'Paused') : (lang === 'tr' ? 'Çalışıyor' : 'Running')) 
                    : (lang === 'tr' ? 'Hazır' : 'Ready')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-slate-500">v2.4.0-core</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-300/80 font-mono text-[11px]">com.justgame.jails</span>
              <span aria-hidden="true">·</span>
              <span>{activeModulesCount} {lang === 'tr' ? 'aktif görev modülü' : 'active task modules'}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-400">{formatUptime(state.uptimeSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Top Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Loop Runner Buttons */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 shadow-sm">
            {!state.isRunning || state.isPaused ? (
              <button
                onClick={onStart}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/10 rounded-md transition-colors"
                title={lang === 'tr' ? 'Döngüyü Başlat (ana_dongu)' : 'Start Loop'}
              >
                <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                <span>{lang === 'tr' ? 'Başlat' : 'Start'}</span>
              </button>
            ) : (
              <button
                onClick={onPause}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/10 rounded-md transition-colors"
                title={lang === 'tr' ? 'Döngüyü Duraklat' : 'Pause Loop'}
              >
                <Pause className="w-3.5 h-3.5 fill-current text-amber-400" />
                <span>{lang === 'tr' ? 'Duraklat' : 'Pause'}</span>
              </button>
            )}

            <button
              onClick={onStep}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              title={lang === 'tr' ? 'Tek Adım Yürüt (calistir)' : 'Step Once'}
            >
              <StepForward className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'tr' ? 'Adım' : 'Step'}</span>
            </button>

            <button
              onClick={onReset}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
              title={lang === 'tr' ? 'Sıfırla' : 'Reset'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Presets Button */}
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'tr' ? 'Oyun Profili' : 'Game Profile'}</span>
          </button>

          {/* ADB Connection Button */}
          <button
            onClick={onOpenAdbSettings}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            <span>ADB & Güvenlik</span>
          </button>

          {/* Guide Button */}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'tr' ? 'Rehber' : 'Guide'}</span>
            </button>
          )}

          {/* PC Kurulum Rehberi Butonu */}
          {onOpenPcGuide && (
            <button
              onClick={onOpenPcGuide}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 rounded-lg transition-colors shadow-sm cursor-pointer"
              title={lang === 'tr' ? 'Windows PC / LDPlayer / BlueStacks Kurulum Rehberi' : 'PC & LDPlayer Setup Guide'}
            >
              <Monitor className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'tr' ? '💻 PC Kurulumu' : '💻 PC Setup'}</span>
            </button>
          )}

          {/* Tablet (PC Yok) Rehberi Butonu */}
          {onOpenTabletGuide && (
            <button
              onClick={onOpenTabletGuide}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 rounded-lg transition-colors shadow-sm"
              title={lang === 'tr' ? 'Bilgisayarsız (Sadece Tablet/Telefon) Kullanım Rehberi' : 'No PC Tablet/Mobile Guide'}
            >
              <Tablet className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'tr' ? '📱 Tablet (PC Yok)' : '📱 Tablet (No PC)'}</span>
            </button>
          )}

          {/* Kale & Oyuncu Bulucu Modal Button */}
          {onOpenPlayerFinder && (
            <button
              onClick={onOpenPlayerFinder}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/40 rounded-lg transition-colors shadow-sm"
              title={lang === 'tr' ? 'Oyuncu adı veya TAG ile Kale Bulucu Modalını Aç' : 'Search Player & Alliance TAG Modal'}
            >
              <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'tr' ? 'Kale / TAG Bulucu' : 'Castle Finder'}</span>
            </button>
          )}

          {/* Download ZIP */}
          <button
            onClick={onDownloadZip}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="font-semibold">{lang === 'tr' ? 'Python ZIP İndir' : 'Export Python ZIP'}</span>
          </button>

          {/* Language Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setLang('tr')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                lang === 'tr' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              TR
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                lang === 'en' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
