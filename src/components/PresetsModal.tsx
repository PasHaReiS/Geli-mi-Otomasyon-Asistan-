import React from 'react';
import { X, Layers, Check, Gamepad2 } from 'lucide-react';
import { GamePreset } from '../types';
import { GAME_PRESETS } from '../data/gamePresets';

interface PresetsModalProps {
  lang: 'tr' | 'en';
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset: (preset: GamePreset) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  lang,
  isOpen,
  onClose,
  onApplyPreset
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">
                {lang === 'tr' ? 'Hazır Oyun ve Strateji Profilleri' : 'Game Strategy Presets'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'tr' ? 'Popüler MMO strateji oyunları için tek tıkla yapılandırma' : 'One-click configs for popular MMO strategy games'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets List */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {GAME_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between gap-3 group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-200 text-sm group-hover:text-indigo-300 transition-colors">
                    {preset.name}
                  </h4>
                  <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded">
                    {preset.gameTitle}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {lang === 'tr' ? preset.descriptionTr : preset.descriptionEn}
                </p>

                <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                  <span className="text-[10px] text-slate-500 font-mono">Modüller:</span>
                  {preset.activeModules.map((modId) => (
                    <span
                      key={modId}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400"
                    >
                      {modId.replace('modules.', '')}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  onApplyPreset(preset);
                  onClose();
                }}
                className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'Bu Profili Uygula' : 'Apply This Preset'}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button onClick={onClose} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition-colors">
            {lang === 'tr' ? 'Kapat' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
