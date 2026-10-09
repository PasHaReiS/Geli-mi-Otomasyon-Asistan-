import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Trash2, 
  Download, 
  Search, 
  Copy, 
  Check, 
  ArrowDownCircle, 
  Filter 
} from 'lucide-react';
import { BotLog, LogLevel } from '../types';

interface ConsoleTerminalProps {
  lang: 'tr' | 'en';
  logs: BotLog[];
  onClearLogs: () => void;
}

export const ConsoleTerminal: React.FC<ConsoleTerminalProps> = ({
  lang,
  logs,
  onClearLogs
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'ALL' | LogLevel>('ALL');
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    const matchesSearch =
      searchTerm === '' ||
      log.messageTr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.messageEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.moduleId && log.moduleId.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  const handleCopyLogs = () => {
    const text = filteredLogs
      .map((l) => `${l.timestamp} [${l.level}] ${l.moduleId ? `[${l.moduleId}] ` : ''}${l.messageTr}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLogFile = () => {
    const text = logs
      .map((l) => `${l.timestamp} [${l.level}] ${l.moduleId ? `[${l.moduleId}] ` : ''}${l.messageTr}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `otomasyon_log_${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLevelBadgeClass = (level: LogLevel) => {
    switch (level) {
      case 'ACTION':
        return 'text-sky-400 font-semibold';
      case 'SUCCESS':
        return 'text-emerald-400 font-semibold';
      case 'WARNING':
        return 'text-amber-400 font-semibold';
      case 'ERROR':
        return 'text-rose-400 font-bold';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full font-mono">
      {/* Top Console Controls */}
      <div className="px-3 py-2 border-b border-slate-800 bg-slate-900/70 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-slate-200">
            {lang === 'tr' ? 'Python Terminal & Yürütme Logları' : 'Python Terminal & Execution Logs'}
          </span>
          <span className="text-slate-500 text-[11px]">({filteredLogs.length} satır)</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'tr' ? 'Loglarda ara...' : 'Search logs...'}
              className="bg-black/60 border border-slate-800 rounded px-2 py-0.5 pl-6 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700 w-28 sm:w-36"
            />
          </div>

          {/* Level Filter Select */}
          <div className="flex items-center bg-black/60 border border-slate-800 rounded px-1.5 py-0.5 text-[11px]">
            <Filter className="w-3 h-3 text-slate-400 mr-1" />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">Tümü (All)</option>
              <option value="ACTION" className="bg-slate-900">ACTION</option>
              <option value="SUCCESS" className="bg-slate-900">SUCCESS</option>
              <option value="WARNING" className="bg-slate-900">WARNING</option>
              <option value="ERROR" className="bg-slate-900">ERROR</option>
            </select>
          </div>

          {/* Action buttons */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1 rounded transition-colors ${
              autoScroll ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'
            }`}
            title={lang === 'tr' ? 'Otomatik Kaydırma' : 'Auto Scroll'}
          >
            <ArrowDownCircle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopyLogs}
            className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors"
            title={lang === 'tr' ? 'Kopyala' : 'Copy'}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownloadLogFile}
            className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors"
            title={lang === 'tr' ? 'Log Dosyasını İndir' : 'Download Log'}
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClearLogs}
            className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
            title={lang === 'tr' ? 'Temizle' : 'Clear'}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output stream */}
      <div className="p-3 overflow-y-auto flex-1 text-[11px] leading-relaxed space-y-1 bg-black/70">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-600 text-center py-8">
            {lang === 'tr' ? 'Henüz log kaydı yok. "Başlat" butonuna basın.' : 'No logs yet. Click "Start".'}
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 group hover:bg-slate-900/40 px-1 py-0.5 rounded">
              <span className="text-slate-600 select-none shrink-0">{log.timestamp}</span>
              <span className={`shrink-0 ${getLevelBadgeClass(log.level)}`}>
                [{log.level}]
              </span>
              {log.moduleId && (
                <span className="text-purple-400 shrink-0 font-semibold">
                  [{log.moduleId}]:
                </span>
              )}
              <span className="text-slate-300 break-all">
                {lang === 'tr' ? log.messageTr : log.messageEn}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
