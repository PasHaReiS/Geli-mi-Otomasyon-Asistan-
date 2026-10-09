import React, { useState } from 'react';
import {
  Crosshair,
  Search,
  Tag,
  User,
  MapPin,
  Send,
  Eye,
  Bookmark,
  Shield,
  Sparkles,
  Compass,
  X,
  CheckCircle2,
  AlertCircle,
  Radio
} from 'lucide-react';
import { MapEntity } from '../types';

export interface PlayerSearchTarget {
  playerName: string;
  tag: string;
  action: 'jump' | 'scout' | 'bookmark';
  scanStrategy: 'coord_box' | 'spiral_scan' | 'rankings';
}

interface PlayerFinderModalProps {
  lang: 'tr' | 'en';
  isOpen: boolean;
  onClose: () => void;
  existingEntities: MapEntity[];
  onApplyTargetToSimulation: (target: {
    name: string;
    tag: string;
    coords: { x: number; y: number };
    action: 'jump' | 'scout' | 'bookmark';
    strategy: string;
  }) => void;
}

export const PlayerFinderModal: React.FC<PlayerFinderModalProps> = ({
  lang,
  isOpen,
  onClose,
  existingEntities,
  onApplyTargetToSimulation
}) => {
  const [playerName, setPlayerName] = useState('Fatih');
  const [tag, setTag] = useState('TURK');
  const [action, setAction] = useState<'jump' | 'scout' | 'bookmark'>('jump');
  const [scanStrategy, setScanStrategy] = useState<'coord_box' | 'spiral_scan' | 'rankings'>('coord_box');
  const [customX, setCustomX] = useState<number | ''>(482);
  const [customY, setCustomY] = useState<number | ''>(618);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>('player_fatih');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter existing player entities
  const knownPlayers = existingEntities.filter(
    (e) => e.category === 'player' || e.category === 'enemy'
  );

  const handlePlayerNameChange = (name: string) => {
    setPlayerName(name);
    // Instant auto-match with known players on typing
    const trimmed = name.trim().toLowerCase();
    if (trimmed) {
      const match = knownPlayers.find(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.name.toLowerCase().replace(/\[.*?\]\s*/, '').includes(trimmed) ||
          p.id.toLowerCase().includes(trimmed)
      );
      if (match) {
        setCustomX(match.x);
        setCustomY(match.y);
        setSelectedEntityId(match.id);
        if (match.tag) setTag(match.tag);
      }
    }
  };

  const handleSelectQuickPlayer = (ent: MapEntity) => {
    setSelectedEntityId(ent.id);
    const cleanName = ent.name.replace(/\[.*?\]\s*/, '').replace(/ \(.*\)/, '');
    setPlayerName(cleanName);
    setTag(ent.tag || '');
    setCustomX(ent.x);
    setCustomY(ent.y);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();

    const finalX = typeof customX === 'number' ? customX : 600;
    const finalY = typeof customY === 'number' ? customY : 600;
    const finalName = playerName.trim() || 'Hedef Kale';
    const finalTag = tag ? tag.trim().replace(/^\[|\]$/g, '') : '';

    onApplyTargetToSimulation({
      name: finalName,
      tag: finalTag,
      coords: { x: finalX, y: finalY },
      action,
      strategy: scanStrategy
    });

    setStatusMessage(
      lang === 'tr'
        ? `[${finalName}] oyuncusu başarıyla harita simülasyonuna aktarıldı ve kilitlendi!`
        : `Player [${finalName}] successfully linked to map simulation!`
    );

    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Crosshair className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                <span>{lang === 'tr' ? 'Hızlı Oyuncu & Kale Bulucu' : 'Fast Player & Castle Finder'}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {lang === 'tr' ? 'İsimle Anında Bul' : 'Instant Name Search'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'tr'
                  ? 'Oyuncu ismini girin (TAG zorunlu değildir) — Harita kamerası hedefe anında kilitlenir'
                  : 'Enter player name (TAG is optional) — Map camera immediately locks on target'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleApply} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Status Banner */}
          {statusMessage && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Quick Notice: TAG not required, Name is fastest */}
          <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-tight">
              {lang === 'tr'
                ? '⚡ Hızlı Arama: Oyuncu bulurken TAG yazmak zorunlu DEĞİLDİR! Sadece oyuncu ismini yazarak veya aşağıdaki listeden tıklayarak kaleyi çok daha hızlı tespit edebilirsiniz.'
                : '⚡ Fast Search: TAG is NOT required! Simply enter the player name or click a known player below to lock on their castle instantly.'}
            </span>
          </div>

          {/* Player Name and TAG Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8 space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'tr' ? 'Oyuncu Adı (Öncelikli & Hızlı)' : 'Player Name (Primary)'}</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {lang === 'tr' ? '✓ Otomatik eşleşir' : '✓ Auto-matched'}
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={lang === 'tr' ? 'Örn: Fatih, Barbaros, ShadowLord...' : 'e.g. Fatih, Barbaros, ShadowLord...'}
                  value={playerName}
                  onChange={(e) => handlePlayerNameChange(e.target.value)}
                  className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div className="sm:col-span-4 space-y-1.5">
              <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === 'tr' ? 'İttifak TAG\'i (Opsiyonel)' : 'Alliance TAG (Optional)'}</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={lang === 'tr' ? 'Zorunlu değil' : 'Optional'}
                  value={tag}
                  onChange={(e) => setTag(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Quick Pre-discovered Targets Chip Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>{lang === 'tr' ? '👑 Haritada Tespit Edilen Oyuncular (Hızlı Seçim):' : '👑 Known Map Players (Quick Pick):'}</span>
              <span className="text-[11px] text-emerald-400">
                {lang === 'tr' ? 'Tek tıkla koordinat doldurur' : 'Auto-fills coords'}
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {knownPlayers.map((p) => {
                const isSelected = selectedEntityId === p.id;
                const displayName = p.name.replace(/\[.*?\]\s*/, '').replace(/ \(.*\)/, '');
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => handleSelectQuickPlayer(p)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 text-slate-300 text-xs font-bold border border-slate-800">
                      👤
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold truncate leading-tight text-white">{displayName}</div>
                      <div className="text-[10px] font-mono text-emerald-400">
                        X:{p.x} Y:{p.y}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coordinates (X, Y) */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                {lang === 'tr' ? 'Harita Koordinatları (0..1200 Grid)' : 'Map Coordinates (0..1200 Grid)'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {lang === 'tr' ? 'Simülatör kamerası bu noktaya gidecek' : 'Simulator camera links here'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">X Koordinatı (0-1200)</label>
                <input
                  type="number"
                  min={0}
                  max={1200}
                  value={customX}
                  onChange={(e) => setCustomX(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Y Koordinatı (0-1200)</label>
                <input
                  type="number"
                  min={0}
                  max={1200}
                  value={customY}
                  onChange={(e) => setCustomY(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Simulation Action Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{lang === 'tr' ? 'Simülasyona Aktarılacak Aksiyon:' : 'Simulation Action on Target:'}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAction('jump')}
                className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  action === 'jump'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-4 h-4 text-sky-400" />
                <span>{lang === 'tr' ? 'Kamerayı Kilitle' : 'Lock Camera'}</span>
                <span className="text-[9px] text-slate-500">Jump to (X, Y)</span>
              </button>

              <button
                type="button"
                onClick={() => setAction('scout')}
                className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  action === 'scout'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Send className="w-4 h-4 text-rose-400" />
                <span>{lang === 'tr' ? 'Keşif Yolla' : 'Dispatch Scout'}</span>
                <span className="text-[9px] text-slate-500">Scout march</span>
              </button>

              <button
                type="button"
                onClick={() => setAction('bookmark')}
                className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  action === 'bookmark'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>{lang === 'tr' ? 'Yer İmlerine Ekle' : 'Add Bookmark'}</span>
                <span className="text-[9px] text-slate-500">Save coordinate</span>
              </button>
            </div>
          </div>

          {/* Strategy Info */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'tr' ? 'Python Bot Entegrasyon Stratejisi:' : 'Bot Scan Strategy:'}</span>
            </div>
            <select
              value={scanStrategy}
              onChange={(e) => setScanStrategy(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="coord_box">
                {lang === 'tr'
                  ? 'Oyun İçi Koordinat Arama Kutusu (Doğrudan X, Y Atlaması)'
                  : 'In-Game Coordinate Search (Direct Jump)'}
              </option>
              <option value="spiral_scan">
                {lang === 'tr'
                  ? 'Spiral Harita Taraması + OCR Metin Tespiti'
                  : 'Spiral Grid Scan + OCR Text Detection'}
              </option>
              <option value="rankings">
                {lang === 'tr'
                  ? 'İttifak Liderlik Tablosundan Profile Atlayarak Bul'
                  : 'Leaderboard Profile Jump Strategy'}
              </option>
            </select>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>
              {lang === 'tr'
                ? 'Veriler harita simülasyonuna ve Python modülüne aktarılacaktır.'
                : 'Data transfers directly to map radar & bot module.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {lang === 'tr' ? 'Vazgeç' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>{lang === 'tr' ? 'Haritaya Aktar & Kilitlen' : 'Apply to Map & Lock'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
