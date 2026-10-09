import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  FolderTree, 
  Code2, 
  FileText, 
  Settings,
  Sparkles
} from 'lucide-react';
import { GeneratedProject } from '../utils/codeGenerator';

interface PythonCodeViewerProps {
  lang: 'tr' | 'en';
  project: GeneratedProject;
  onDownloadZip: () => void;
}

export const PythonCodeViewer: React.FC<PythonCodeViewerProps> = ({
  lang,
  project,
  onDownloadZip
}) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeFile = project.files[activeFileIndex] || project.files[0];

  const handleCopyCode = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.py')) return <FileCode className="w-3.5 h-3.5 text-emerald-400" />;
    if (filename.endsWith('.json')) return <Settings className="w-3.5 h-3.5 text-amber-400" />;
    if (filename.endsWith('.bat') || filename.endsWith('.sh')) return <Code2 className="w-3.5 h-3.5 text-sky-400" />;
    return <FileText className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full">
      {/* Top Bar with File Tabs and Download action */}
      <div className="px-3 py-2 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200 text-xs">
            {lang === 'tr' ? 'Üretilen Python Projesi' : 'Generated Python Project'}
          </span>
          <span className="text-slate-500 text-[11px] font-mono">({project.files.length} dosya)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (lang === 'tr' ? 'Kopyalandı!' : 'Copied!') : (lang === 'tr' ? 'Kodu Kopyala' : 'Copy Code')}</span>
          </button>

          <button
            onClick={onDownloadZip}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'tr' ? 'ZIP İndir' : 'Download ZIP'}</span>
          </button>
        </div>
      </div>

      {/* File Selector Tabs */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-slate-800 bg-slate-950/40 overflow-x-auto text-xs">
        {project.files.map((file, idx) => (
          <button
            key={file.path}
            onClick={() => setActiveFileIndex(idx)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors whitespace-nowrap shrink-0 ${
              activeFileIndex === idx
                ? 'bg-slate-800 text-slate-100 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {getFileIcon(file.path)}
            <span>{file.path}</span>
          </button>
        ))}
      </div>

      {/* File Description Header */}
      {activeFile && (
        <div className="px-3 py-1.5 bg-slate-950/80 border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate">{activeFile.description}</span>
          <span className="font-mono text-slate-500 text-[10px] uppercase">{activeFile.language}</span>
        </div>
      )}

      {/* Code Viewer Body */}
      <div className="p-3 overflow-y-auto flex-1 bg-black/80 font-mono text-xs text-slate-300 leading-relaxed">
        <pre className="select-text whitespace-pre overflow-x-auto">
          <code>
            {activeFile?.content.split('\n').map((line, i) => (
              <div key={i} className="table-row">
                <span className="table-cell pr-4 text-slate-600 select-none text-right w-8 text-[11px]">
                  {i + 1}
                </span>
                <span className="table-cell">{line || ' '}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};
