/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  StepForward, 
  Sliders, 
  Download, 
  Layers, 
  HelpCircle, 
  Activity, 
  TrendingUp, 
  Flame, 
  Wheat, 
  Swords, 
  Zap, 
  Code2, 
  Terminal, 
  Cpu, 
  Smartphone,
  Eye,
  CheckCircle2,
  BookOpen,
  Radio
} from 'lucide-react';
import { Header } from './components/Header';
import { ModuleList } from './components/ModuleList';
import { EmulatorPreview } from './components/EmulatorPreview';
import { MiniMapRadar } from './components/MiniMapRadar';
import { RealtimeMetricsChart } from './components/RealtimeMetricsChart';
import { ConsoleTerminal } from './components/ConsoleTerminal';
import { PythonCodeViewer } from './components/PythonCodeViewer';
import { GuideSection } from './components/GuideSection';
import { QuickStepsBar } from './components/QuickStepsBar';
import { ModuleConfigModal } from './components/ModuleConfigModal';
import { ModuleCodeModal } from './components/ModuleCodeModal';
import { AdbSettingsModal } from './components/AdbSettingsModal';
import { PresetsModal } from './components/PresetsModal';
import { NewModuleModal } from './components/NewModuleModal';
import { DocsModal } from './components/DocsModal';
import { PlayerFinderModal } from './components/PlayerFinderModal';
import { TabletNoPcModal } from './components/TabletNoPcModal';
import { PcSetupModal } from './components/PcSetupModal';

import { INITIAL_MODULES, DEFAULT_ADB_CONFIG } from './data/defaultModules';
import { INITIAL_MAP_ENTITIES } from './data/mockMapEntities';
import { TaskModule, AdbConfig, BotLog, MarchSlot, EmulatorTapPoint, GamePreset } from './types';
import { simulatorEngine, SimulatorState } from './services/simulatorEngine';
import { generatePythonProject } from './utils/codeGenerator';
import { downloadProjectAsZip } from './utils/zipExport';

export default function App() {
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [modules, setModules] = useState<TaskModule[]>(INITIAL_MODULES);
  const [adbConfig, setAdbConfig] = useState<AdbConfig>(DEFAULT_ADB_CONFIG);
  const [activeTab, setActiveTab] = useState<'live' | 'code' | 'guide'>('live');
  const [deviceView, setDeviceView] = useState<'screen' | 'minimap'>('screen');

  // Simulator Engine state
  const [simState, setSimState] = useState<SimulatorState>({
    isRunning: false,
    isPaused: false,
    cycleCount: 0,
    currentModuleId: null,
    speedMultiplier: 1,
    uptimeSeconds: 0,
    stats: {
      totalActions: 0,
      successRate: 100,
      resourcesGathered: 125000,
      monstersDefeated: 4,
      ralliesJoined: 2,
      staminaCurrent: 85,
      staminaMax: 100
    }
  });

  const [logs, setLogs] = useState<BotLog[]>([]);
  const [marches, setMarches] = useState<MarchSlot[]>([]);
  const [activeTaps, setActiveTaps] = useState<EmulatorTapPoint[]>([]);

  // Modals
  const [configModalModule, setConfigModalModule] = useState<TaskModule | null>(null);
  const [codeModalModule, setCodeModalModule] = useState<TaskModule | null>(null);
  const [isAdbModalOpen, setIsAdbModalOpen] = useState(false);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);
  const [isNewModuleModalOpen, setIsNewModuleModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isPlayerFinderModalOpen, setIsPlayerFinderModalOpen] = useState(false);
  const [isTabletNoPcModalOpen, setIsTabletNoPcModalOpen] = useState(false);
  const [isPcModalOpen, setIsPcModalOpen] = useState(false);
  const [externalMapTarget, setExternalMapTarget] = useState<{
    name: string;
    tag?: string;
    coords: { x: number; y: number };
    action?: 'jump' | 'scout' | 'bookmark';
  } | null>(null);

  // Sync simulator with modules
  useEffect(() => {
    simulatorEngine.setModules(modules);
  }, [modules]);

  // Subscribe to simulator events
  useEffect(() => {
    const unsubState = simulatorEngine.subscribeState(setSimState);
    const unsubLogs = simulatorEngine.subscribeLogs((newLog) => {
      setLogs((prev) => [...prev.slice(-150), newLog]);
    });
    const unsubMarches = simulatorEngine.subscribeMarches(setMarches);
    const unsubTaps = simulatorEngine.subscribeTaps((tap) => {
      setActiveTaps((prev) => [...prev, tap]);
      setTimeout(() => {
        setActiveTaps((prev) => prev.filter((t) => t.id !== tap.id));
      }, 1200);
    });

    // Initial welcome log
    setLogs([
      {
        id: 'init_1',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour12: false }),
        level: 'INFO',
        messageTr: 'Gelişmiş Otomasyon Asistanı başlatılmaya hazır. AKTIF_GOREVLER yüklendi.',
        messageEn: 'Advanced Automation Assistant ready. AKTIF_GOREVLER loaded.'
      },
      {
        id: 'init_2',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour12: false }),
        level: 'INFO',
        messageTr: 'Varsayılan görevler: ["modules.gather", "modules.monster", "modules.rally"]',
        messageEn: 'Default tasks: ["modules.gather", "modules.monster", "modules.rally"]'
      }
    ]);

    return () => {
      unsubState();
      unsubLogs();
      unsubMarches();
      unsubTaps();
    };
  }, []);

  // Generated Python project
  const generatedProject = useMemo(() => {
    return generatePythonProject(modules, adbConfig);
  }, [modules, adbConfig]);

  // Handlers
  const handleToggleModule = (id: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const handleMoveModule = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= modules.length) return;

    setModules((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleSaveModuleParams = (updated: TaskModule) => {
    setModules((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleSaveModuleCode = (newCode: string) => {
    if (!codeModalModule) return;
    setModules((prev) =>
      prev.map((m) =>
        m.id === codeModalModule.id ? { ...m, pythonCodeSnippet: newCode } : m
      )
    );
  };

  const handleAddModule = (newMod: TaskModule) => {
    setModules((prev) => [...prev, newMod]);
  };

  const handleDeleteModule = (id: string) => {
    setModules((prev) => prev.filter((m) => m.id !== id));
  };

  const handleApplyPreset = (preset: GamePreset) => {
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        enabled: preset.activeModules.includes(m.id)
      }))
    );
    if (preset.recommendedAdb) {
      setAdbConfig((prev) => ({
        ...prev,
        ...preset.recommendedAdb
      }));
    }
  };

  const handleManualTap = (x: number, y: number) => {
    const tap: EmulatorTapPoint = {
      id: 'manual_' + Date.now(),
      x,
      y,
      label: `Manuel Tıklama (${x}, ${y})`,
      timestamp: Date.now(),
      color: '#38bdf8'
    };
    setActiveTaps((prev) => [...prev, tap]);
    setTimeout(() => {
      setActiveTaps((prev) => prev.filter((t) => t.id !== tap.id));
    }, 1200);
  };

  const handleNavigateToCoords = (x: number, y: number, label: string) => {
    const screenX = Math.round((x / 1200) * 1280);
    const screenY = Math.round((y / 1200) * 720);
    handleManualTap(screenX, screenY);
    setLogs((prev) => [
      ...prev,
      {
        id: 'nav_' + Date.now(),
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour12: false }),
        level: 'ACTION',
        messageTr: `[Mini-Harita Navigasyonu] Kamera (X: ${x}, Y: ${y}) konumuna kaydırıldı -> ${label}`,
        messageEn: `[Mini-Map Navigation] Camera panned to (X: ${x}, Y: ${y}) -> ${label}`
      }
    ]);
  };

  const handleApplyTargetToSimulation = (target: {
    name: string;
    tag: string;
    coords: { x: number; y: number };
    action: 'jump' | 'scout' | 'bookmark';
    strategy: string;
  }) => {
    // 1. Switch active view to minimap so user sees the visual lock
    setDeviceView('minimap');
    setActiveTab('live');

    // 2. Set external target so MiniMapRadar receives and centers on it
    setExternalMapTarget({
      name: target.name,
      tag: target.tag,
      coords: target.coords,
      action: target.action
    });

    // 3. Update python module params for player finder if present
    setModules((prev) =>
      prev.map((m) => {
        if (m.id === 'modules.player_finder') {
          const formatted = `${target.tag ? `[${target.tag}] ` : ''}${target.name}`;
          return {
            ...m,
            enabled: true,
            params: m.params.map((p) => {
              if (p.id === 'target_player_tag') {
                return { ...p, value: formatted };
              }
              if (p.id === 'search_strategy') {
                return { ...p, value: target.strategy };
              }
              return p;
            })
          };
        }
        return m;
      })
    );

    // 4. Log simulation event and trigger tap
    const fullName = `${target.tag ? `[${target.tag}] ` : ''}${target.name}`;
    handleNavigateToCoords(target.coords.x, target.coords.y, fullName);

    setLogs((prev) => [
      ...prev,
      {
        id: 'finder_' + Date.now(),
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour12: false }),
        level: 'SUCCESS',
        messageTr: `[Kale & Oyuncu Bulucu] Hedef kilitlendi: "${fullName}" -> Koordinat (X: ${target.coords.x}, Y: ${target.coords.y}). Aksiyon: ${target.action.toUpperCase()}, Strateji: ${target.strategy}.`,
        messageEn: `[Player & Castle Finder] Target locked: "${fullName}" at (X: ${target.coords.x}, Y: ${target.coords.y}). Action: ${target.action.toUpperCase()}, Strategy: ${target.strategy}.`
      }
    ]);

    // If action is scout, dispatch a march or simulated scout log
    if (target.action === 'scout') {
      setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          {
            id: 'scout_' + Date.now(),
            timestamp: new Date().toLocaleTimeString('tr-TR', { hour12: false }),
            level: 'ACTION',
            messageTr: `[Gözcü Birlikleri] ${fullName} kalesine keşif ekibi yola çıkarıldı! Hedef: (X: ${target.coords.x}, Y: ${target.coords.y}).`,
            messageEn: `[Scout Squad] Dispatched reconnaissance scout to ${fullName} at (X: ${target.coords.x}, Y: ${target.coords.y}).`
          }
        ]);
      }, 700);
    }
  };

  const handleRefillStamina = () => {
    setSimState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        staminaCurrent: Math.min(prev.stats.staminaMax, prev.stats.staminaCurrent + 50)
      }
    }));
  };

  const handleDownloadZip = () => {
    downloadProjectAsZip(generatedProject);
  };

  const activeModules = modules.filter((m) => m.enabled);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navigation & Status */}
      <Header
        lang={lang}
        setLang={setLang}
        state={simState}
        activeModulesCount={activeModules.length}
        onStart={() => simulatorEngine.start()}
        onPause={() => simulatorEngine.pause()}
        onReset={() => simulatorEngine.reset()}
        onStep={() => simulatorEngine.step()}
        onOpenPresets={() => setIsPresetsModalOpen(true)}
        onOpenAdbSettings={() => setIsAdbModalOpen(true)}
        onDownloadZip={handleDownloadZip}
        onOpenGuide={() => setActiveTab('guide')}
        onOpenPlayerFinder={() => setIsPlayerFinderModalOpen(true)}
        onOpenTabletGuide={() => setIsTabletNoPcModalOpen(true)}
        onOpenPcGuide={() => setIsPcModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 flex flex-col gap-3">
        {/* Quick Metrics Bar & Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
          {/* Key Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
              <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">
                  {lang === 'tr' ? 'Döngü Sayacı' : 'Cycle Loop'}
                </span>
                <span className="font-mono font-semibold text-slate-200 text-sm">
                  #{simState.cycleCount}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
              <Wheat className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">
                  {lang === 'tr' ? 'Toplanan Kaynak' : 'Gathered'}
                </span>
                <span className="font-mono font-semibold text-slate-200 text-sm">
                  {(simState.stats.resourcesGathered / 1000).toFixed(0)}k
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
              <Swords className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">
                  {lang === 'tr' ? 'Yok Edilen Canavar' : 'Monsters'}
                </span>
                <span className="font-mono font-semibold text-slate-200 text-sm">
                  {simState.stats.monstersDefeated}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
              <Flame className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">
                  {lang === 'tr' ? 'Katılınan Ralli' : 'Rallies Joined'}
                </span>
                <span className="font-mono font-semibold text-slate-200 text-sm">
                  {simState.stats.ralliesJoined}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Tab Navigation & Speed Selector */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Speed selector */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
              <span className="text-[10px] text-slate-400 px-1.5 hidden sm:inline">
                {lang === 'tr' ? 'Hız:' : 'Speed:'}
              </span>
              {[1, 2, 5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => simulatorEngine.setSpeed(speed)}
                  className={`px-2 py-1 rounded font-mono text-[11px] transition-colors ${
                    simState.speedMultiplier === speed
                      ? 'bg-slate-800 text-emerald-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setActiveTab('live')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === 'live'
                    ? 'bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'Canlı Simülasyon' : 'Live Studio'}</span>
              </button>

              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === 'code'
                    ? 'bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'Python Kod Üretici' : 'Python Project'}</span>
              </button>

              <button
                onClick={() => setActiveTab('guide')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === 'guide'
                    ? 'bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'Kullanım Rehberi' : 'User Guide'}</span>
              </button>
            </div>

            {/* Guide Button */}
            <button
              onClick={() => setActiveTab('guide')}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title={lang === 'tr' ? 'Kullanım Rehberi' : 'User Guide'}
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: Live Studio (Modular Pipeline + Visual Emulator + Console) */}
        {activeTab === 'live' && (
          <div className="flex flex-col gap-3 flex-1">
            {/* Quick 4-step onboarding banner */}
            <QuickStepsBar
              lang={lang}
              onOpenFullGuide={() => setActiveTab('guide')}
              onOpenTabletGuide={() => setIsTabletNoPcModalOpen(true)}
              onOpenPcGuide={() => setIsPcModalOpen(true)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1">
              {/* Left Column: Module Pipeline (AKTIF_GOREVLER) */}
              <div className="lg:col-span-4 h-[580px] lg:h-[740px]">
                <ModuleList
                  lang={lang}
                  modules={modules}
                  currentExecutingModuleId={simState.currentModuleId}
                  onToggleModule={handleToggleModule}
                  onMoveModule={handleMoveModule}
                  onConfigureModule={(mod) => setConfigModalModule(mod)}
                  onViewModuleCode={(mod) => setCodeModalModule(mod)}
                  onAddNewModule={() => setIsNewModuleModalOpen(true)}
                  onDeleteModule={handleDeleteModule}
                />
              </div>

              {/* Right Column: Emulator Preview + Chart, and Terminal Console */}
              <div className="lg:col-span-8 flex flex-col gap-3 min-h-[740px]">
                {/* Upper Row: Emulator Preview / MiniMap on Left, Realtime Line Chart directly on Right */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 min-h-[390px]">
                  {/* Left: Device View or Mini-Map */}
                  <div className="xl:col-span-7 flex flex-col gap-1.5 h-full">
                    {/* View Switcher: Sanal ADB Ekranı vs Krallık Mini-Haritası */}
                    <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800 rounded-lg p-1 text-xs">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setDeviceView('screen')}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                            deviceView === 'screen'
                              ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>{lang === 'tr' ? 'Sanal Ekran (ADB)' : 'ADB Screen'}</span>
                        </button>
                        <button
                          onClick={() => setDeviceView('minimap')}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                            deviceView === 'minimap'
                              ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                          <span>{lang === 'tr' ? 'Mini-Harita' : 'Mini-Map'}</span>
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono hidden sm:inline px-2">
                        {deviceView === 'minimap' ? '0..1200 Grid' : '1280x720'}
                      </span>
                    </div>

                    <div className="flex-1 min-h-[340px]">
                      {deviceView === 'screen' ? (
                        <EmulatorPreview
                          lang={lang}
                          marches={marches}
                          activeTaps={activeTaps}
                          currentModuleId={simState.currentModuleId}
                          staminaCurrent={simState.stats.staminaCurrent}
                          staminaMax={simState.stats.staminaMax}
                          onRefillStamina={handleRefillStamina}
                          onManualTap={handleManualTap}
                          onOpenMiniMap={() => setDeviceView('minimap')}
                          onOpenPlayerFinder={() => setIsPlayerFinderModalOpen(true)}
                          onLogMessage={(msg) => {
                            setLogs((prev) => [
                              ...prev,
                              {
                                id: 'rec_' + Date.now(),
                                timestamp: new Date().toLocaleTimeString('tr-TR', { hour12: false }),
                                level: 'INFO',
                                messageTr: msg,
                                messageEn: msg
                              }
                            ]);
                          }}
                          isRunning={simState.isRunning}
                          isPaused={simState.isPaused}
                          speedMultiplier={simState.speedMultiplier}
                          cycleCount={simState.cycleCount}
                          onStartBot={() => simulatorEngine.start()}
                          onPauseBot={() => simulatorEngine.pause()}
                          onResumeBot={() => simulatorEngine.resume()}
                          onResetBot={() => simulatorEngine.reset()}
                          onStepBot={() => simulatorEngine.step()}
                          onSetSpeed={(speed) => simulatorEngine.setSpeed(speed)}
                          onNavigateToCoords={handleNavigateToCoords}
                        />
                      ) : (
                        <MiniMapRadar
                          lang={lang}
                          onNavigateToCoords={handleNavigateToCoords}
                          onOpenPlayerFinder={() => setIsPlayerFinderModalOpen(true)}
                          externalTarget={externalMapTarget}
                        />
                      )}
                    </div>
                  </div>

                  {/* Right: Real-time Recharts Line Chart (Next to EmulatorPreview) */}
                  <div className="xl:col-span-5 h-[390px]">
                    <RealtimeMetricsChart
                      lang={lang}
                      currentResources={simState.stats.resourcesGathered}
                      currentMonsters={simState.stats.monstersDefeated}
                      currentStamina={simState.stats.staminaCurrent}
                      isRunning={simState.isRunning && !simState.isPaused}
                    />
                  </div>
                </div>

                {/* Lower Row: Live Python Execution Console */}
                <div className="flex-1 min-h-[280px]">
                  <ConsoleTerminal
                    lang={lang}
                    logs={logs}
                    onClearLogs={() => setLogs([])}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Python Code Generator & Direct Export */}
        {activeTab === 'code' && (
          <div className="h-[700px]">
            <PythonCodeViewer
              lang={lang}
              project={generatedProject}
              onDownloadZip={handleDownloadZip}
            />
          </div>
        )}

        {/* Tab 3: Detailed Step-by-Step Guide */}
        {activeTab === 'guide' && (
          <div className="h-[720px]">
            <GuideSection
              lang={lang}
              onGoToLive={() => setActiveTab('live')}
              onGoToCode={() => setActiveTab('code')}
              onDownloadZip={handleDownloadZip}
              onOpenAdbSettings={() => setIsAdbModalOpen(true)}
              onOpenPcGuide={() => setIsPcModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <ModuleConfigModal
        lang={lang}
        module={configModalModule}
        onClose={() => setConfigModalModule(null)}
        onSave={handleSaveModuleParams}
      />

      <ModuleCodeModal
        lang={lang}
        module={codeModalModule}
        onClose={() => setCodeModalModule(null)}
        onSaveCode={handleSaveModuleCode}
      />

      <AdbSettingsModal
        lang={lang}
        config={adbConfig}
        isOpen={isAdbModalOpen}
        onClose={() => setIsAdbModalOpen(false)}
        onSave={(newCfg) => setAdbConfig(newCfg)}
        onOpenTabletNoPcGuide={() => {
          setIsAdbModalOpen(false);
          setIsTabletNoPcModalOpen(true);
        }}
      />

      <PresetsModal
        lang={lang}
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        onApplyPreset={handleApplyPreset}
      />

      <NewModuleModal
        lang={lang}
        isOpen={isNewModuleModalOpen}
        onClose={() => setIsNewModuleModalOpen(false)}
        onAddModule={handleAddModule}
      />

      <DocsModal
        lang={lang}
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />

      <PlayerFinderModal
        lang={lang}
        isOpen={isPlayerFinderModalOpen}
        onClose={() => setIsPlayerFinderModalOpen(false)}
        existingEntities={INITIAL_MAP_ENTITIES}
        onApplyTargetToSimulation={handleApplyTargetToSimulation}
      />

      <TabletNoPcModal
        lang={lang}
        isOpen={isTabletNoPcModalOpen}
        onClose={() => setIsTabletNoPcModalOpen(false)}
        onOpenPcGuide={() => {
          setIsTabletNoPcModalOpen(false);
          setIsPcModalOpen(true);
        }}
      />

      <PcSetupModal
        lang={lang}
        isOpen={isPcModalOpen}
        onClose={() => setIsPcModalOpen(false)}
        onDownloadZip={handleDownloadZip}
        onOpenTabletGuide={() => {
          setIsPcModalOpen(false);
          setIsTabletNoPcModalOpen(true);
        }}
      />
    </div>
  );
}
