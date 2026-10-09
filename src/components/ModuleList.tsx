import React from 'react';
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Code, 
  Flame, 
  GanttChartSquare, 
  Plus, 
  Settings2, 
  Shield, 
  Sparkles, 
  Swords, 
  Trash2, 
  Wheat, 
  Zap,
  Activity
} from 'lucide-react';
import { TaskModule } from '../types';

interface ModuleListProps {
  lang: 'tr' | 'en';
  modules: TaskModule[];
  currentExecutingModuleId: string | null;
  onToggleModule: (id: string) => void;
  onMoveModule: (index: number, direction: 'up' | 'down') => void;
  onConfigureModule: (module: TaskModule) => void;
  onViewModuleCode: (module: TaskModule) => void;
  onAddNewModule: () => void;
  onDeleteModule?: (id: string) => void;
}

export const ModuleList: React.FC<ModuleListProps> = ({
  lang,
  modules,
  currentExecutingModuleId,
  onToggleModule,
  onMoveModule,
  onConfigureModule,
  onViewModuleCode,
  onAddNewModule,
  onDeleteModule
}) => {
  const activeModules = modules.filter((m) => m.enabled);

  const getCategoryIcon = (category: TaskModule['category']) => {
    switch (category) {
      case 'gathering':
        return <Wheat className="w-4 h-4 text-emerald-400" />;
      case 'combat':
        return <Swords className="w-4 h-4 text-rose-400" />;
      case 'alliance':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'security':
        return <Shield className="w-4 h-4 text-sky-400" />;
      case 'economy':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      default:
        return <Zap className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full">
      {/* Header & Python Code Snippet Banner */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <GanttChartSquare className="w-4 h-4 text-emerald-400" />
            <h2 className="font-semibold text-slate-200 text-sm">
              {lang === 'tr' ? 'Görev Modülleri & Öncelik Sırası' : 'Task Modules & Priority Order'}
            </h2>
          </div>
          <button
            onClick={onAddNewModule}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'tr' ? 'Yeni Modül' : 'Add Module'}</span>
          </button>
        </div>

        {/* Live Python Variable Preview */}
        <div className="p-2.5 rounded-lg bg-black/50 border border-slate-800/80 font-mono text-[11px] text-slate-300 overflow-x-auto">
          <div className="text-slate-500 text-[10px] mb-1">
            # {lang === 'tr' ? 'Python ana_dongu() tarafından çalıştırılacak liste:' : 'List executed by Python ana_dongu():'}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-pink-400 font-semibold">AKTIF_GOREVLER</span>
            <span className="text-slate-400">=</span>
            <span className="text-amber-300 font-semibold">[</span>
            {activeModules.map((m, idx) => (
              <span key={m.id} className="inline-flex items-center">
                <span className="text-emerald-400">&quot;{m.id}&quot;</span>
                {idx < activeModules.length - 1 && <span className="text-slate-400 mr-1.5">,</span>}
              </span>
            ))}
            <span className="text-amber-300 font-semibold">]</span>
          </div>
        </div>
      </div>

      {/* Module List Body */}
      <div className="p-3 divide-y divide-slate-800/60 overflow-y-auto flex-1 space-y-1">
        {modules.map((mod, index) => {
          const isCurrentlyRunning = currentExecutingModuleId === mod.id;

          return (
            <div
              key={mod.id}
              className={`p-3 rounded-lg transition-all ${
                isCurrentlyRunning
                  ? 'bg-emerald-950/20 border border-emerald-500/40 shadow-sm'
                  : mod.enabled
                  ? 'bg-slate-950/40 hover:bg-slate-800/40 border border-transparent'
                  : 'bg-slate-950/20 opacity-60 hover:opacity-80 border border-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                {/* Left: Icon, Name, Category */}
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 p-1.5 rounded-md bg-slate-800/80 border border-slate-700/60">
                    {getCategoryIcon(mod.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-200 text-xs sm:text-sm">
                        {lang === 'tr' ? mod.nameTr : mod.nameEn}
                      </span>
                      {isCurrentlyRunning && (
                        <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                          <Activity className="w-3 h-3 animate-spin" />
                          <span>calistir()</span>
                        </div>
                      )}
                    </div>
                    <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                      {mod.id}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {lang === 'tr' ? mod.descriptionTr : mod.descriptionEn}
                    </p>
                  </div>
                </div>

                {/* Right: Toggle Switch & Order buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Priority reorder */}
                  <div className="flex flex-col">
                    <button
                      onClick={() => onMoveModule(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                      title={lang === 'tr' ? 'Önceliği Artır' : 'Move Up'}
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onMoveModule(index, 'down')}
                      disabled={index === modules.length - 1}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                      title={lang === 'tr' ? 'Önceliği Azalt' : 'Move Down'}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Enable / Disable toggle */}
                  <button
                    onClick={() => onToggleModule(mod.id)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      mod.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        mod.enabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Action Buttons for Module: Configure & Code View */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/40 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-slate-500">
                    {mod.params.length} {lang === 'tr' ? 'parametre' : 'params'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {mod.intervalSec}s {lang === 'tr' ? 'aralık' : 'interval'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onViewModuleCode(mod)}
                    className="flex items-center gap-1 px-2 py-1 text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    title={lang === 'tr' ? 'Python Kodunu Gör' : 'View Code'}
                  >
                    <Code className="w-3 h-3 text-emerald-400" />
                    <span>{lang === 'tr' ? 'Kod' : 'Code'}</span>
                  </button>

                  <button
                    onClick={() => onConfigureModule(mod)}
                    className="flex items-center gap-1 px-2 py-1 text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    title={lang === 'tr' ? 'Parametreleri Düzenle' : 'Configure Params'}
                  >
                    <Settings2 className="w-3 h-3 text-sky-400" />
                    <span>{lang === 'tr' ? 'Ayarlar' : 'Config'}</span>
                  </button>

                  {mod.isCustom && onDeleteModule && (
                    <button
                      onClick={() => onDeleteModule(mod.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                      title={lang === 'tr' ? 'Modülü Sil' : 'Delete'}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
