import React, { useState } from 'react';
import { X, Plus, Code, Check } from 'lucide-react';
import { TaskModule } from '../types';

interface NewModuleModalProps {
  lang: 'tr' | 'en';
  isOpen: boolean;
  onClose: () => void;
  onAddModule: (module: TaskModule) => void;
}

export const NewModuleModal: React.FC<NewModuleModalProps> = ({
  lang,
  isOpen,
  onClose,
  onAddModule
}) => {
  if (!isOpen) return null;

  const [idName, setIdName] = useState('scout_fog');
  const [nameTr, setNameTr] = useState('Sis Açma ve Keşif (Scout)');
  const [descriptionTr, setDescriptionTr] = useState('Haritadaki keşfedilmemiş alanlara otomatik gözcü yollar.');
  const [category, setCategory] = useState<TaskModule['category']>('gathering');
  const [intervalSec, setIntervalSec] = useState(10);
  const [pythonCode, setPythonCode] = useState(`# modules/${idName}.py
import time
import logging
from adb_controller import adb

logger = logging.getLogger("modules.${idName}")

def calistir():
    """Özel görev yürütme mantığı"""
    logger.info("Gözcü kampı kontrol ediliyor...")
    if adb.sablon_mevcut_mu("icon_gozcu_bosta.png"):
        adb.dokun_sablon("icon_gozcu_bosta.png")
        time.sleep(0.5)
        adb.dokun_sablon("btn_kesif_gonder.png")
        logger.info("Yeni harita keşif görevi başlatıldı.")
        return True
    return False
`);

  const handleIdChange = (val: string) => {
    const cleaned = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setIdName(cleaned);
  };

  const handleCreate = () => {
    const fullId = `modules.${idName}`;
    const newModule: TaskModule = {
      id: fullId,
      nameTr: nameTr || idName,
      nameEn: nameTr || idName,
      category,
      descriptionTr,
      descriptionEn: descriptionTr,
      enabled: true,
      intervalSec,
      runCount: 0,
      successCount: 0,
      errorCount: 0,
      cooldownRemaining: 0,
      params: [],
      pythonCodeSnippet: pythonCode,
      isCustom: true
    };

    onAddModule(newModule);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">
                {lang === 'tr' ? 'Yeni Görev Modülü Ekle' : 'Add New Task Module'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'tr' ? 'Dinamik Python importlib modülü oluşturun' : 'Create dynamic Python importlib module'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3.5 text-xs text-slate-300">
          <div>
            <label className="block font-medium text-slate-200 mb-1">
              {lang === 'tr' ? 'Modül Dosya Adı / Tanımlayıcısı' : 'Module ID (Python file name)'}
            </label>
            <div className="flex items-center gap-1 font-mono">
              <span className="text-slate-500 bg-slate-950 border border-slate-800 px-2 py-1.5 rounded-l-md">
                modules.
              </span>
              <input
                type="text"
                value={idName}
                onChange={(e) => handleIdChange(e.target.value)}
                placeholder="ornek_gorev"
                className="bg-slate-950 border border-slate-700 rounded-r-md p-1.5 font-mono text-emerald-400 flex-1 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-mono">
              {lang === 'tr' ? `Oluşturulacak dosya: modules/${idName}.py` : `Created file: modules/${idName}.py`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-200 mb-1">
                {lang === 'tr' ? 'Görünen İsim' : 'Display Name'}
              </label>
              <input
                type="text"
                value={nameTr}
                onChange={(e) => setNameTr(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-md p-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-200 mb-1">
                {lang === 'tr' ? 'Kategori' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-md p-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="gathering">{lang === 'tr' ? 'Toplama / Ekonomi' : 'Gathering'}</option>
                <option value="combat">{lang === 'tr' ? 'Savaş / Canavar' : 'Combat'}</option>
                <option value="alliance">{lang === 'tr' ? 'İttifak' : 'Alliance'}</option>
                <option value="security">{lang === 'tr' ? 'Güvenlik / Kalkan' : 'Security'}</option>
                <option value="custom">{lang === 'tr' ? 'Özel' : 'Custom'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-200 mb-1">
              {lang === 'tr' ? 'Açıklama' : 'Description'}
            </label>
            <input
              type="text"
              value={descriptionTr}
              onChange={(e) => setDescriptionTr(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-md p-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-200 mb-1 flex items-center justify-between">
              <span>{lang === 'tr' ? 'Python calistir() Kodu' : 'Python calistir() Code'}</span>
              <span className="text-[10px] text-slate-500 font-mono">def calistir() -&gt; bool</span>
            </label>
            <textarea
              rows={6}
              value={pythonCode}
              onChange={(e) => setPythonCode(e.target.value)}
              className="w-full bg-black/80 border border-slate-800 rounded-md p-2 font-mono text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition-colors">
            {lang === 'tr' ? 'İptal' : 'Cancel'}
          </button>
          <button
            onClick={handleCreate}
            disabled={!idName}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-lg transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{lang === 'tr' ? 'Modülü Ekle & Aktif Et' : 'Add Module'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
