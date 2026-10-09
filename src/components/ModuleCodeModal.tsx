import React, { useState } from 'react';
import { X, Code2, Copy, Check, Save } from 'lucide-react';
import { TaskModule } from '../types';

interface ModuleCodeModalProps {
  lang: 'tr' | 'en';
  module: TaskModule | null;
  onClose: () => void;
  onSaveCode?: (code: string) => void;
}

export const ModuleCodeModal: React.FC<ModuleCodeModalProps> = ({
  lang,
  module,
  onClose,
  onSaveCode
}) => {
  if (!module) return null;

  const [code, setCode] = useState(module.pythonCodeSnippet);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (onSaveCode) {
      onSaveCode(code);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">
                {module.id}.py
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'tr' ? module.nameTr : module.nameEn}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Editor */}
        <div className="p-4 flex-1 overflow-hidden flex flex-col bg-black/80">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-80 font-mono text-xs text-emerald-300 bg-transparent resize-none focus:outline-none p-2 border border-slate-800 rounded-md"
            spellCheck={false}
          />
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition-colors">
              {lang === 'tr' ? 'Kapat' : 'Close'}
            </button>
            {onSaveCode && (
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'Kodu Kaydet' : 'Save Code'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
