import React, { useState, useMemo, useEffect } from 'react';
import { 
  Crosshair, 
  MapPin, 
  Navigation, 
  Search, 
  Radio, 
  Eye, 
  Send, 
  Compass, 
  Flame, 
  ShieldAlert, 
  Wheat, 
  Swords, 
  Bookmark, 
  Copy, 
  Check, 
  Maximize2,
  Sparkles,
  Sliders
} from 'lucide-react';
import { MapEntity } from '../types';
import { INITIAL_MAP_ENTITIES } from '../data/mockMapEntities';

interface MiniMapRadarProps {
  lang: 'tr' | 'en';
  onNavigateToCoords: (x: number, y: number, label: string) => void;
  onOpenPlayerFinder?: () => void;
  externalTarget?: {
    name: string;
    tag?: string;
    coords: { x: number; y: number };
    action?: 'jump' | 'scout' | 'bookmark';
  } | null;
}

export const MiniMapRadar: React.FC<MiniMapRadarProps> = ({
  lang,
  onNavigateToCoords,
  onOpenPlayerFinder,
  externalTarget
}) => {
  const [entities, setEntities] = useState<MapEntity[]>(INITIAL_MAP_ENTITIES);
  const [targetX, setTargetX] = useState<number>(482);
  const [targetY, setTargetY] = useState<number>(618);
  const [selectedEntity, setSelectedEntity] = useState<MapEntity | null>(
    INITIAL_MAP_ENTITIES.find((e) => e.id === 'player_fatih') || INITIAL_MAP_ENTITIES[0]
  );
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'player' | 'resource' | 'monster' | 'rally'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [radarScanning, setRadarScanning] = useState(true);
  const [copied, setCopied] = useState(false);

  // Sync external target from PlayerFinderModal when provided
  useEffect(() => {
    if (!externalTarget) return;

    setTargetX(externalTarget.coords.x);
    setTargetY(externalTarget.coords.y);
    setCategoryFilter('player');
    if (externalTarget.name) {
      setSearchQuery(externalTarget.name);
    } else if (externalTarget.tag) {
      setSearchQuery(externalTarget.tag);
    }

    // Check if entity exists or create custom entity
    const existing = entities.find(
      (e) =>
        e.name.toLowerCase().includes(externalTarget.name.toLowerCase()) ||
        (externalTarget.tag && e.tag?.toLowerCase() === externalTarget.tag.toLowerCase()) ||
        (Math.abs(e.x - externalTarget.coords.x) < 20 && Math.abs(e.y - externalTarget.coords.y) < 20)
    );

    if (existing) {
      setSelectedEntity(existing);
      onNavigateToCoords(
        existing.x,
        existing.y,
        `[Modal Hedefi]: ${existing.name}`
      );
    } else {
      const customEnt: MapEntity = {
        id: 'target_' + Date.now(),
        name: `${externalTarget.tag ? `[${externalTarget.tag}] ` : ''}${externalTarget.name}`,
        tag: externalTarget.tag,
        category: 'enemy',
        level: 25,
        x: externalTarget.coords.x,
        y: externalTarget.coords.y,
        status: 'Modal ile Kilitlenmiş Hedef Kale',
        discoveredAt: new Date().toLocaleTimeString('tr-TR', { hour12: false })
      };
      setEntities((prev) => [customEnt, ...prev]);
      setSelectedEntity(customEnt);
      onNavigateToCoords(
        customEnt.x,
        customEnt.y,
        `[Modal Kilit]: ${customEnt.name} (X:${customEnt.x}, Y:${customEnt.y})`
      );
    }
  }, [externalTarget]);

  // Player base is at center (600, 600)
  const baseCoords = { x: 600, y: 600 };

  // Calculate distance between two points
  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.round(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
  };

  // Filtered entities
  const filteredEntities = useMemo(() => {
    return entities.filter((e) => {
      const matchesCat =
        categoryFilter === 'all'
          ? true
          : categoryFilter === 'player'
          ? e.category === 'player' || e.category === 'enemy'
          : e.category === categoryFilter;

      const matchesSearch =
        searchQuery === '' ||
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.tag && e.tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        e.x.toString().includes(searchQuery) ||
        e.y.toString().includes(searchQuery);

      return matchesCat && matchesSearch;
    });
  }, [entities, categoryFilter, searchQuery]);

  // Handle click on map canvas
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const normX = Math.round(Math.max(10, Math.min(1190, (clickX / rect.width) * 1200)));
    const normY = Math.round(Math.max(10, Math.min(1190, (clickY / rect.height) * 1200)));

    setTargetX(normX);
    setTargetY(normY);

    // Check if clicked near an existing entity (within 35 units)
    const clickedEntity = entities.find(
      (ent) => Math.abs(ent.x - normX) < 40 && Math.abs(ent.y - normY) < 40
    );

    if (clickedEntity) {
      setSelectedEntity(clickedEntity);
    } else {
      setSelectedEntity({
        id: 'custom_' + Date.now(),
        name: `Özel Konum (X:${normX}, Y:${normY})`,
        category: 'enemy',
        level: 1,
        x: normX,
        y: normY,
        status: 'Bilinmeyen Arazi / Hedef'
      });
    }

    onNavigateToCoords(normX, normY, clickedEntity ? clickedEntity.name : `Harita (X:${normX}, Y:${normY})`);
  };

  const handleEntitySelect = (entity: MapEntity) => {
    setSelectedEntity(entity);
    setTargetX(entity.x);
    setTargetY(entity.y);
    onNavigateToCoords(entity.x, entity.y, entity.name);
  };

  const handleDirectJump = () => {
    const clampedX = Math.max(1, Math.min(1200, targetX));
    const clampedY = Math.max(1, Math.min(1200, targetY));
    setTargetX(clampedX);
    setTargetY(clampedY);

    const existing = entities.find((e) => Math.abs(e.x - clampedX) < 20 && Math.abs(e.y - clampedY) < 20);
    if (existing) {
      setSelectedEntity(existing);
    }

    onNavigateToCoords(clampedX, clampedY, `Navigasyon: (X:${clampedX}, Y:${clampedY})`);
  };

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`X: ${targetX}, Y: ${targetY}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getEntityIcon = (category: MapEntity['category']) => {
    switch (category) {
      case 'player':
        return <span className="text-xs">🏰</span>;
      case 'enemy':
        return <span className="text-xs">🚩</span>;
      case 'resource':
        return <span className="text-xs">🪙</span>;
      case 'monster':
        return <span className="text-xs">👹</span>;
      case 'rally':
        return <span className="text-xs">⛺</span>;
      default:
        return <span className="text-xs">📍</span>;
    }
  };

  const getEntityColor = (category: MapEntity['category']) => {
    switch (category) {
      case 'player':
        return 'text-sky-400 bg-sky-500/20 border-sky-400';
      case 'enemy':
        return 'text-rose-400 bg-rose-500/20 border-rose-500';
      case 'resource':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-400';
      case 'monster':
        return 'text-amber-400 bg-amber-500/20 border-amber-400';
      case 'rally':
        return 'text-purple-400 bg-purple-500/20 border-purple-400';
      default:
        return 'text-slate-400 bg-slate-500/20 border-slate-400';
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full">
      {/* Top Header & Coordinate Jump Bar */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Radio className={`w-3.5 h-3.5 ${radarScanning ? 'animate-pulse text-emerald-400' : 'text-slate-500'}`} />
          </div>
          <div>
            <span className="font-semibold text-slate-200">
              {lang === 'tr' ? 'Krallık Mini-Haritası & Koordinat Radarı' : 'Kingdom Mini-Map & Radar'}
            </span>
            <span className="text-slate-500 text-[11px] font-mono ml-2 hidden sm:inline">(0..1200 x 0..1200)</span>
          </div>
        </div>

        {/* Coordinate Direct Input & Jump Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/60 border border-slate-800 rounded-md px-2 py-1 font-mono text-[11px]">
            <span className="text-slate-500 font-semibold">X:</span>
            <input
              type="number"
              min={0}
              max={1200}
              value={targetX}
              onChange={(e) => setTargetX(Number(e.target.value))}
              className="w-14 bg-transparent text-emerald-400 focus:outline-none"
            />
            <span className="text-slate-600">|</span>
            <span className="text-slate-500 font-semibold">Y:</span>
            <input
              type="number"
              min={0}
              max={1200}
              value={targetY}
              onChange={(e) => setTargetY(Number(e.target.value))}
              className="w-14 bg-transparent text-emerald-400 focus:outline-none"
            />
          </div>

          <button
            onClick={handleDirectJump}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors shadow-sm"
            title={lang === 'tr' ? 'Koordinata Doğrudan Git (ADB Komutu)' : 'Jump to Coordinates'}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{lang === 'tr' ? 'Git' : 'Jump'}</span>
          </button>

          <button
            onClick={handleCopyCoords}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 rounded-md transition-colors"
            title={lang === 'tr' ? 'Koordinatları Kopyala' : 'Copy Coordinates'}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Content: Split between Radar Canvas on left, Entity Inspector/List on right */}
      <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-800">
        {/* Left Area: Tactical Radar Canvas (7 cols) */}
        <div className="md:col-span-7 p-3 bg-slate-950 flex flex-col justify-center items-center select-none">
          {/* Radar Canvas */}
          <div
            onClick={handleMapClick}
            className="relative w-full aspect-square max-w-[360px] rounded-full border-2 border-emerald-500/40 bg-slate-950 overflow-hidden cursor-crosshair shadow-2xl"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, rgba(6, 78, 59, 0.25) 50%, rgba(2, 6, 23, 0.98) 100%)'
            }}
          >
            {/* Concentric distance circles */}
            <div className="absolute inset-[15%] rounded-full border border-emerald-500/20 pointer-events-none" />
            <div className="absolute inset-[35%] rounded-full border border-emerald-500/20 pointer-events-none" />
            <div className="absolute inset-[55%] rounded-full border border-emerald-500/20 pointer-events-none" />

            {/* Crosshair Axes */}
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-emerald-500/30 pointer-events-none" />
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-emerald-500/30 pointer-events-none" />

            {/* Rotating Radar Sweep Line */}
            {radarScanning && (
              <div
                className="absolute inset-0 pointer-events-none origin-center"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(16, 185, 129, 0.25) 360deg)',
                  animation: 'spin 4s linear infinite'
                }}
              />
            )}

            {/* Plotted Entities */}
            {filteredEntities.map((ent) => {
              const leftPercent = (ent.x / 1200) * 100;
              const topPercent = (ent.y / 1200) * 100;
              const isSelected = selectedEntity?.id === ent.id;

              return (
                <div
                  key={ent.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEntitySelect(ent);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-10 ${
                    isSelected ? 'scale-125 ring-2 ring-emerald-400 ring-offset-2 ring-offset-black' : ''
                  }`}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  title={`${ent.name} (X: ${ent.x}, Y: ${ent.y})`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shadow-md ${getEntityColor(
                      ent.category
                    )}`}
                  >
                    {getEntityIcon(ent.category)}
                  </div>
                </div>
              );
            })}

            {/* Target Crosshair Marker */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
              style={{
                left: `${(targetX / 1200) * 100}%`,
                top: `${(targetY / 1200) * 100}%`
              }}
            >
              <div className="w-8 h-8 rounded-full border-2 border-rose-500 animate-ping opacity-75" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Crosshair className="w-5 h-5 text-rose-400" />
              </div>
            </div>

            {/* Center Label for Player Stronghold */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
              <span className="text-[10px] text-sky-400 font-mono font-bold bg-black/80 px-1 rounded border border-sky-400/50 mt-5">
                KALE (600, 600)
              </span>
            </div>

            {/* Corner Coordinate Guides */}
            <span className="absolute top-2 left-3 text-[9px] font-mono text-emerald-500/60 pointer-events-none">
              (0, 0)
            </span>
            <span className="absolute top-2 right-3 text-[9px] font-mono text-emerald-500/60 pointer-events-none">
              (1200, 0)
            </span>
            <span className="absolute bottom-2 left-3 text-[9px] font-mono text-emerald-500/60 pointer-events-none">
              (0, 1200)
            </span>
            <span className="absolute bottom-2 right-3 text-[9px] font-mono text-emerald-500/60 pointer-events-none">
              (1200, 1200)
            </span>
          </div>

          {/* Quick instructions under radar */}
          <div className="flex items-center justify-between w-full max-w-[360px] text-[10px] text-slate-500 font-mono mt-2">
            <span>{lang === 'tr' ? 'Radara tıklayarak koordinat belirleyin' : 'Click radar to set target'}</span>
            <button
              onClick={() => setRadarScanning(!radarScanning)}
              className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
            >
              {radarScanning ? (lang === 'tr' ? 'Taramayı Durdur' : 'Pause Sweep') : (lang === 'tr' ? 'Taramayı Aç' : 'Start Sweep')}
            </button>
          </div>
        </div>

        {/* Right Area: Selected Entity Details & Search/Filter List (5 cols) */}
        <div className="md:col-span-5 flex flex-col bg-slate-900/40 p-3 overflow-y-auto space-y-3">
          {/* Selected Entity Card */}
          {selectedEntity && (
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${getEntityColor(
                      selectedEntity.category
                    )}`}
                  >
                    {getEntityIcon(selectedEntity.category)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100 text-xs">
                      {selectedEntity.tag && <span className="text-emerald-400 font-mono mr-1">[{selectedEntity.tag}]</span>}
                      {selectedEntity.name}
                    </h4>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Seviye: {selectedEntity.level} · Mesafe: {calculateDistance(baseCoords.x, baseCoords.y, selectedEntity.x, selectedEntity.y)} km
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  X:{selectedEntity.x} Y:{selectedEntity.y}
                </div>
              </div>

              {selectedEntity.status && (
                <div className="text-[11px] text-slate-300 bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
                  <span className="text-slate-500">Durum: </span>
                  <span className="text-slate-200">{selectedEntity.status}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                <button
                  onClick={() => onNavigateToCoords(selectedEntity.x, selectedEntity.y, `Kamera: ${selectedEntity.name}`)}
                  className="py-1 px-2 rounded-lg font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center justify-center gap-1"
                >
                  <Navigation className="w-3 h-3" />
                  <span>{lang === 'tr' ? 'Koordinata Git' : 'Navigate'}</span>
                </button>

                <button
                  onClick={() =>
                    onNavigateToCoords(selectedEntity.x, selectedEntity.y, `Keşif/Gözcü: ${selectedEntity.name}`)
                  }
                  className="py-1 px-2 rounded-lg font-medium bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 transition-colors flex items-center justify-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>{lang === 'tr' ? 'Keşif Yolla' : 'Scout'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Oyuncu ve Kale Bulucu Arama Bölümü */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-300">
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'tr' ? '🏰 Oyuncu & Kale Bulucu (Kişi Adı / TAG)' : '🏰 Player & Castle Finder (Name / TAG)'}
              </span>
              <div className="flex items-center gap-1.5">
                {onOpenPlayerFinder && (
                  <button
                    onClick={onOpenPlayerFinder}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold transition-colors shadow-sm"
                    title={lang === 'tr' ? 'Ayrıntılı Hedef Arama ve Simülasyon Kilit Modalını Aç' : 'Open Target Finder Modal'}
                  >
                    <span>{lang === 'tr' ? '🔍 Hedef Modalı' : '🔍 Finder Modal'}</span>
                  </button>
                )}
                <span className="text-[10px] text-slate-500 font-mono">
                  {filteredEntities.length} {lang === 'tr' ? 'hedef' : 'targets'}
                </span>
              </div>
            </div>

            {/* Oyuncu Adı Giriş Kutusu */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  lang === 'tr'
                    ? 'Oyuncu adını yazın (örn: Fatih, Barbaros, ShadowLord)...'
                    : 'Search player name (e.g. Fatih, Barbaros, ShadowLord)...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  title={lang === 'tr' ? 'Temizle' : 'Clear'}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Bilgilendirme İpucu */}
            <div className="text-[10px] text-slate-300 bg-emerald-950/20 p-2 rounded-lg border border-emerald-500/20 flex items-start gap-1.5">
              <span className="text-emerald-400 text-xs">💡</span>
              <span className="leading-tight">
                {lang === 'tr'
                  ? 'Hızlı Arama: TAG yazmak zorunda değilsiniz. Doğrudan oyuncu ismini yazarak veya aşağıdaki hızlı isimlere tıklayarak kaleyi anında haritada bulabilirsiniz.'
                  : 'Fast Search: TAG is not required. Type player name or click a quick name below to locate castle immediately.'}
              </span>
            </div>

            {/* Hızlı Oyuncu İsimleri Seçiciler */}
            <div className="flex items-center gap-1 flex-wrap pt-0.5">
              <span className="text-[10px] text-slate-400 mr-1">{lang === 'tr' ? 'Hızlı Oyuncu:' : 'Quick Player:'}</span>
              {['Fatih', 'Barbaros', 'ShadowLord', 'BraveHeart', 'DragonSlayer'].map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    setCategoryFilter('player');
                    setSearchQuery(name);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    searchQuery.toLowerCase() === name.toLowerCase()
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-emerald-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  👤 {name}
                </button>
              ))}
              {['TURK', 'WOLF'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setCategoryFilter('player');
                    setSearchQuery(tag);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800`}
                  title={lang === 'tr' ? 'İsteğe bağlı TAG filtresi' : 'Optional TAG filter'}
                >
                  [{tag}]
                </button>
              ))}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                >
                  {lang === 'tr' ? 'Sıfırla' : 'Reset'}
                </button>
              )}
            </div>

            {/* Kategori Filtre Sekmeleri */}
            <div className="flex items-center gap-1 overflow-x-auto text-[11px] pt-1 border-t border-slate-800/80">
              {[
                { id: 'all', labelTr: 'Tümü', labelEn: 'All' },
                { id: 'player', labelTr: 'Kaleler', labelEn: 'Castles' },
                { id: 'resource', labelTr: 'Madenler', labelEn: 'Mines' },
                { id: 'monster', labelTr: 'Canavarlar', labelEn: 'Monsters' },
                { id: 'rally', labelTr: 'Ralliler', labelEn: 'Rallies' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id as any)}
                  className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                    categoryFilter === tab.id
                      ? 'bg-slate-800 text-emerald-400 font-semibold border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {lang === 'tr' ? tab.labelTr : tab.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Entities List */}
          <div className="space-y-1.5 overflow-y-auto flex-1 max-h-[190px] pr-1">
            {filteredEntities.map((ent) => (
              <div
                key={ent.id}
                onClick={() => handleEntitySelect(ent)}
                className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs ${
                  selectedEntity?.id === ent.id
                    ? 'bg-slate-800/80 border-emerald-500/50 text-slate-100 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/60 text-slate-300 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span>{getEntityIcon(ent.category)}</span>
                  <div className="truncate">
                    <span className="font-medium">{ent.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{ent.status}</span>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono text-[10px] text-emerald-400 ml-2">
                  X:{ent.x} Y:{ent.y}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
