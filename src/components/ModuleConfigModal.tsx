import React, { useState } from 'react';
import { X, Settings2, Sliders, Check, Clock } from 'lucide-react';
import { TaskModule, ModuleParam } from '../types';

interface ModuleConfigModalProps {
  lang: 'tr' | 'en';
  module: TaskModule | null;
  onClose: () => void;
  onSave: (updatedModule: TaskModule) => void;
}

export const ModuleConfigModal: React.FC<ModuleConfigModalProps> = ({
  lang,
  module,
  onClose,
  onSave
}) => {
  if (!module) return null;

  const [params, setParams] = useState<ModuleParam[]>(JSON.parse(JSON.stringify(module.params)));
  const [intervalSec, setIntervalSec] = useState<number>(module.intervalSec);

  const handleParamChange = (paramId: string, newValue: any) => {
    setParams((prev) =>
      prev.map((p) => (p.id === paramId ? { ...p, value: newValue } : p))
    );
  };

  const handleSave = () => {
    onSave({
      ...module,
      params,
      intervalSec
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Settings2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">
                {lang === 'tr' ? module.nameTr : module.nameEn}
              </h3>
              <p className="font-mono text-[11px] text-slate-400">{module.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs text-slate-300">
          {/* Loop Interval */}
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-medium text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'tr' ? 'Çalışma Döngü Aralığı' : 'Loop Interval Cooldown'}</span>
              </label>
              <span className="font-mono text-emerald-400 font-semibold">{intervalSec}s</span>
            </div>
            <input
              type="range"
              min={1}
              max={180}
              step={1}
              value={intervalSec}
              onChange={(e) => setIntervalSec(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1s ({lang === 'tr' ? 'Hızlı' : 'Fast'})</span>
              <span>180s ({lang === 'tr' ? 'Uzun' : 'Slow'})</span>
            </div>
          </div>

          {/* Dynamic Module Params */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {lang === 'tr' ? 'Modül Parametreleri' : 'Module Parameters'}
            </h4>

            {params.length === 0 ? (
              <p className="text-slate-500 italic">
                {lang === 'tr' ? 'Bu modül ek parametre gerektirmiyor.' : 'This module has no additional parameters.'}
              </p>
            ) : (
              params.map((p) => (
                <div key={p.id} className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-medium text-slate-200">
                      {lang === 'tr' ? p.nameTr : p.nameEn}
                    </label>
                    {p.type === 'range' && (
                      <span className="font-mono text-emerald-400 font-semibold">
                        {p.value} {p.unit || ''}
                      </span>
                    )}
                  </div>

                  {p.descriptionTr && (
                    <p className="text-[11px] text-slate-400 mb-2">
                      {lang === 'tr' ? p.descriptionTr : p.descriptionEn}
                    </p>
                  )}

                  {/* Range Slider */}
                  {p.type === 'range' && (
                    <input
                      type="range"
                      min={p.min ?? 1}
                      max={p.max ?? 10}
                      step={p.step ?? 1}
                      value={p.value}
                      onChange={(e) => handleParamChange(p.id, Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  )}

                  {/* Select */}
                  {p.type === 'select' && (
                    <select
                      value={p.value}
                      onChange={(e) => handleParamChange(p.id, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      {p.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {lang === 'tr' ? opt.labelTr : opt.labelEn}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Boolean Switch */}
                  {p.type === 'boolean' && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-400 text-[11px]">
                        {p.value ? (lang === 'tr' ? 'Aktif' : 'Enabled') : (lang === 'tr' ? 'Devre Dışı' : 'Disabled')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleParamChange(p.id, !p.value)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          p.value ? 'bg-emerald-500' : 'bg-slate-700'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            p.value ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  )}

                  {/* Number Input */}
                  {p.type === 'number' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={p.min}
                        max={p.max}
                        step={p.step}
                        value={p.value}
                        onChange={(e) => handleParamChange(p.id, Number(e.target.value))}
                        className="bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-200 font-mono w-28 focus:outline-none focus:border-emerald-500"
                      />
                      {p.unit && <span className="text-slate-400 font-mono text-[11px]">{p.unit}</span>}
                    </div>
                  )}

                  {/* Text Input (Hedef Oyuncu Adı, İttifak TAG vb.) */}
                  {p.type === 'text' && (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={p.value ?? ''}
                        placeholder={lang === 'tr' ? 'Örn: [TURK] Fatih veya Barbaros' : 'e.g. [TURK] Fatih'}
                        onChange={(e) => handleParamChange(p.id, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono shadow-inner"
                      />
                      <p className="text-[10px] text-emerald-400/90 flex items-center gap-1">
                        <span>💡</span>
                        <span>
                          {lang === 'tr'
                            ? 'Buraya aramak istediğiniz kişinin adını veya [TAG] ittifak etiketini yazabilirsiniz.'
                            : 'Enter the player name or [TAG] alliance tag to search on the map.'}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            {lang === 'tr' ? 'İptal' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{lang === 'tr' ? 'Kaydet & Güncelle' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
