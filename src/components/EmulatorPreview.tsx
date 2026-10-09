import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Crosshair, 
  Layers, 
  MapPin, 
  Maximize2, 
  Sparkles, 
  Sword, 
  Wheat, 
  ShieldAlert, 
  Zap, 
  Clock, 
  UserCheck,
  Eye,
  Radio,
  Video,
  VideoOff,
  Circle,
  Square,
  Download,
  CheckCircle2,
  Keyboard,
  Send,
  CornerDownLeft,
  Delete,
  MessageSquare,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Hash,
  Terminal,
  RotateCcw,
  Play,
  Pause,
  FastForward,
  Navigation,
  Map,
  Menu,
  X,
  Sliders,
  Target,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Activity,
  Flame,
  Volume2
} from 'lucide-react';
import { MarchSlot, EmulatorTapPoint } from '../types';

interface EmulatorPreviewProps {
  lang: 'tr' | 'en';
  marches: MarchSlot[];
  activeTaps: EmulatorTapPoint[];
  currentModuleId: string | null;
  staminaCurrent: number;
  staminaMax: number;
  onRefillStamina?: () => void;
  onManualTap?: (x: number, y: number) => void;
  onOpenMiniMap?: () => void;
  onOpenPlayerFinder?: () => void;
  onLogMessage?: (msg: string) => void;
  // On-screen Bot Controls & Overlay Props
  isRunning?: boolean;
  isPaused?: boolean;
  speedMultiplier?: number;
  cycleCount?: number;
  onStartBot?: () => void;
  onPauseBot?: () => void;
  onResumeBot?: () => void;
  onResetBot?: () => void;
  onStepBot?: () => void;
  onSetSpeed?: (speed: number) => void;
  onNavigateToCoords?: (x: number, y: number, label: string) => void;
}

export const EmulatorPreview: React.FC<EmulatorPreviewProps> = ({
  lang,
  marches,
  activeTaps,
  currentModuleId,
  staminaCurrent,
  staminaMax,
  onRefillStamina,
  onManualTap,
  onOpenMiniMap,
  onOpenPlayerFinder,
  onLogMessage,
  isRunning = false,
  isPaused = false,
  speedMultiplier = 1,
  cycleCount = 0,
  onStartBot,
  onPauseBot,
  onResumeBot,
  onResetBot,
  onStepBot,
  onSetSpeed,
  onNavigateToCoords
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'city'>('map');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [lastDownloadedVideo, setLastDownloadedVideo] = useState<string | null>(null);

  // On-Screen HUD Overlay Controls States
  const [showOverlay, setShowOverlay] = useState(true);
  const [isGoToCoordsOpen, setIsGoToCoordsOpen] = useState(false);
  const [customCoordX, setCustomCoordX] = useState('600');
  const [customCoordY, setCustomCoordY] = useState('600');
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);
  const [activeTargetNotice, setActiveTargetNotice] = useState<string | null>(null);

  // Virtual Keyboard & In-Game Text Input States
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
  const [showKeyGrid, setShowKeyGrid] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isCapsLock, setIsCapsLock] = useState(false);
  const [targetChannel, setTargetChannel] = useState<'alliance' | 'kingdom' | 'coords' | 'command'>('alliance');
  const [recentInputs, setRecentInputs] = useState<string[]>([
    '[TURK] Ralliye katılın!',
    'X:600 Y:600',
    'Goril bulundu: X:520 Y:380'
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<any>(null);
  const activeBubbleRef = useRef<{ text: string; channel: string; timestamp: number } | null>(null);
  const currentInputTextRef = useRef('');

  useEffect(() => {
    currentInputTextRef.current = inputText;
  }, [inputText]);

  // Canvas interaction click handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1280);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 720);

    if (onManualTap) {
      onManualTap(x, y);
    }
  };

  // Canvas hover coordinates handler
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1280);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 720);
    setHoverCoords({ x, y });
  };

  // Helper to translate task module names
  const getModuleName = (modId: string | null) => {
    if (!modId) return lang === 'tr' ? 'Boşta / Bekliyor' : 'Idle / Standby';
    switch (modId) {
      case 'modules.gather':
        return lang === 'tr' ? '🌾 Kaynak Toplama' : '🌾 Resource Gathering';
      case 'modules.monster':
        return lang === 'tr' ? '⚔️ Canavar Avı' : '⚔️ Monster Hunting';
      case 'modules.rally':
        return lang === 'tr' ? '🔥 İttifak Rallisi' : '🔥 Alliance Rally';
      case 'modules.heal':
        return lang === 'tr' ? '🩹 Hastane Tedavi' : '🩹 Hospital Heal';
      case 'modules.shield_check':
        return lang === 'tr' ? '🛡️ Barış Kalkanı' : '🛡️ Shield Watchdog';
      case 'modules.train_troops':
        return lang === 'tr' ? '🛡️ Asker Eğitimi' : '🛡️ Troop Training';
      case 'modules.daily_quests':
        return lang === 'tr' ? '📜 Günlük Görevler' : '📜 Daily Quests';
      default:
        return modId.replace('modules.', '');
    }
  };

  // Quick preset targets on the world map
  const quickLocations = [
    { nameTr: 'Merkez Karargah', nameEn: 'Headquarters', x: 600, y: 600, icon: '🏛️', tag: '[MERKEZ]' },
    { nameTr: 'Cyber Gorilla (Ralli)', nameEn: 'Cyber Gorilla (Rally)', x: 520, y: 380, icon: '🦍', tag: 'LVL.35' },
    { nameTr: 'Seviye 6 Çiftlik', nameEn: 'Level 6 Farm', x: 350, y: 420, icon: '🌾', tag: '500K Gıda' },
    { nameTr: 'Seviye 6 Demir Madeni', nameEn: 'Level 6 Iron Mine', x: 780, y: 640, icon: '⛏️', tag: '420K Demir' },
    { nameTr: 'Düşman İttifak Kalesi', nameEn: 'Enemy Castle', x: 410, y: 890, icon: '🏰', tag: '[RAID]' },
    { nameTr: 'Kristal Ocağı', nameEn: 'Crystal Field', x: 840, y: 260, icon: '💎', tag: 'Nadir Maden' }
  ];

  // Quick navigation jump handler
  const handleGoToCoords = (x: number, y: number, label: string) => {
    if (onNavigateToCoords) {
      onNavigateToCoords(x, y, label);
    } else if (onManualTap) {
      const screenX = Math.round((x / 1200) * 1280);
      const screenY = Math.round((y / 1200) * 720);
      onManualTap(screenX, screenY);
    }

    setActiveTargetNotice(`${label} (X: ${x}, Y: ${y})`);
    setTimeout(() => {
      setActiveTargetNotice(null);
    }, 3200);

    if (onLogMessage) {
      onLogMessage(
        lang === 'tr'
          ? `[Ekran Navigasyonu] Kamera (X: ${x}, Y: ${y}) konumuna kaydırıldı -> ${label}`
          : `[Screen Navigation] Camera panned to (X: ${x}, Y: ${y}) -> ${label}`
      );
    }
  };

  // Directional Swipe / Camera Pan Handler (simulated ADB swipe)
  const handleSwipeDirection = (direction: 'up' | 'down' | 'left' | 'right') => {
    let startX = 640;
    let startY = 360;
    let endX = 640;
    let endY = 360;
    let label = '';

    if (direction === 'up') {
      startY = 520;
      endY = 200;
      label = lang === 'tr' ? 'Kuzeye Kaydırıldı (Yukarı)' : 'Swiped North (Up)';
    } else if (direction === 'down') {
      startY = 200;
      endY = 520;
      label = lang === 'tr' ? 'Güneye Kaydırıldı (Aşağı)' : 'Swiped South (Down)';
    } else if (direction === 'left') {
      startX = 820;
      endX = 460;
      label = lang === 'tr' ? 'Batıya Kaydırıldı (Sol)' : 'Swiped West (Left)';
    } else if (direction === 'right') {
      startX = 460;
      endX = 820;
      label = lang === 'tr' ? 'Doğuya Kaydırıldı (Sağ)' : 'Swiped East (Right)';
    }

    if (onManualTap) {
      onManualTap(endX, endY);
    }

    setActiveTargetNotice(label);
    setTimeout(() => setActiveTargetNotice(null), 2500);

    if (onLogMessage) {
      onLogMessage(`[ADB Kaydırma] Kamera ${label} (adb shell input swipe ${startX} ${startY} ${endX} ${endY} 350)`);
    }
  };

  // Screen recording controls (MP4 format prioritized)
  const startRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // 30 FPS stream from the HTML5 canvas
      const stream = canvas.captureStream(30);

      // Prioritize MP4 container formats if supported by browser
      const preferredMimeTypes = [
        'video/mp4;codecs=avc1',
        'video/mp4;codecs=h264',
        'video/mp4',
        'video/webm;codecs=vp9',
        'video/webm'
      ];

      let selectedMimeType = '';
      for (const mime of preferredMimeTypes) {
        if (typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(mime)) {
          selectedMimeType = mime;
          break;
        }
      }

      const recorder = selectedMimeType 
        ? new MediaRecorder(stream, { mimeType: selectedMimeType, videoBitsPerSecond: 3000000 })
        : new MediaRecorder(stream);

      recordedChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const isNativeMp4 = selectedMimeType.includes('mp4');
        const blob = new Blob(recordedChunksRef.current, { 
          type: isNativeMp4 ? 'video/mp4' : 'video/mp4' 
        });

        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10);
        const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '-');
        const filename = `bot_simulasyon_${dateStr}_${timeStr}.mp4`;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setLastDownloadedVideo(filename);
        setTimeout(() => setLastDownloadedVideo(null), 5000);

        if (onLogMessage) {
          onLogMessage(`[Ekran Kaydı] 1280x720 MP4 videosu başarıyla dışa aktarıldı: ${filename}`);
        }
      };

      recorder.start(500); // 500ms time slice
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      recordTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      if (onLogMessage) {
        onLogMessage(`[Ekran Kaydı] Sanal bot simülasyonu MP4 formatında kaydedilmeye başlandı (1280x720 @ 30FPS)...`);
      }
    } catch (err) {
      console.error('Recording start failed:', err);
      if (onLogMessage) {
        onLogMessage(`[Ekran Kaydı Hata]: ${err}`);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    setIsRecording(false);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Virtual Keyboard & Text Input Handlers
  const handleKeyClick = (key: string) => {
    const charToAdd = isCapsLock ? key.toUpperCase() : key.toLowerCase();
    setInputText((prev) => prev + charToAdd);
    if (onManualTap) {
      onManualTap(640, 670);
    }
  };

  const handleBackspace = () => {
    setInputText((prev) => prev.slice(0, -1));
    if (onManualTap) {
      onManualTap(1200, 670);
    }
  };

  const handleClear = () => {
    setInputText('');
  };

  const handleSendEnterKey = () => {
    if (onManualTap) {
      onManualTap(1220, 680);
    }
    if (onLogMessage) {
      onLogMessage(
        lang === 'tr'
          ? '[ADB Klavye] ↵ ENTER tuşlandı (adb shell input keyevent 66)'
          : '[ADB Keyboard] ↵ ENTER pressed (adb shell input keyevent 66)'
      );
    }
  };

  const handleSendText = (customText?: string) => {
    const toSend = (customText !== undefined ? customText : inputText).trim();
    if (!toSend) return;

    const channelNames = {
      alliance: lang === 'tr' ? 'İttifak Sohbeti' : 'Alliance Chat',
      kingdom: lang === 'tr' ? 'Krallık Sohbeti' : 'Kingdom Chat',
      coords: lang === 'tr' ? 'Koordinat Arama' : 'Coordinate Search',
      command: lang === 'tr' ? 'ADB Shell Konsolu' : 'ADB Shell Command'
    };

    activeBubbleRef.current = {
      text: toSend,
      channel: targetChannel,
      timestamp: Date.now()
    };

    if (onManualTap) {
      onManualTap(640, 680);
    }

    if (onLogMessage) {
      const adbEscaped = toSend.replace(/([\\' "])/g, '\\$1');
      onLogMessage(
        lang === 'tr'
          ? `[Sanal Klavye] "${toSend}" metni oyuna aktarıldı -> adb shell input text "${adbEscaped}" (Kanal: ${channelNames[targetChannel]})`
          : `[Virtual Keyboard] Text sent to game: "${toSend}" -> adb shell input text "${adbEscaped}" (Channel: ${channelNames[targetChannel]})`
      );
    }

    setRecentInputs((prev) => {
      const filtered = prev.filter((item) => item !== toSend);
      return [toSend, ...filtered].slice(0, 8);
    });

    setInputText('');
  };

  // Continuous Canvas Animation & Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frameCount = 0;

    const render = () => {
      frameCount++;
      const time = Date.now() / 1000;

      // 1. Clear background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, 1280, 720);

      // Radial background glow
      const radialGlow = ctx.createRadialGradient(640, 360, 50, 640, 360, 680);
      if (viewMode === 'map') {
        radialGlow.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
        radialGlow.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
      } else {
        radialGlow.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
        radialGlow.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
      }
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, 1280, 720);

      // 2. Tactical Coordinate Grid
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < 1280; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 720);
        ctx.stroke();
      }
      for (let y = 0; y < 720; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1280, y);
        ctx.stroke();
      }

      if (viewMode === 'map') {
        // --- MAP VIEW ELEMENTS ---

        // Draw animated march lines
        ctx.setLineDash([8, 8]);
        ctx.lineDashOffset = -frameCount * 1.5;

        // Line to Çelik Sahası (380, 240)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(640, 360);
        ctx.lineTo(380, 240);
        ctx.stroke();

        // Line to Barbarian Fort (260, 490)
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(640, 360);
        ctx.lineTo(260, 490);
        ctx.stroke();

        ctx.setLineDash([]); // Reset dash

        // Center: Player Stronghold (Castle)
        const shieldPulse = Math.sin(time * 3) * 6;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(640, 360, 52 + shieldPulse, 0, Math.PI * 2);
        ctx.stroke();

        // Castle Base Box
        ctx.fillStyle = 'rgba(79, 70, 229, 0.25)';
        ctx.strokeStyle = '#818cf8';
        ctx.lineWidth = 2;
        ctx.roundRect(640 - 36, 360 - 36, 72, 72, 12);
        ctx.fill();
        ctx.stroke();

        ctx.font = '32px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🏰', 640, 360 - 2);

        // Castle Name Label
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.roundRect(640 - 60, 360 + 44, 120, 22, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#a5b4fc';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('Kalem (Lv 25) [KORUMA]', 640, 360 + 55);

        // Resource 1: Çelik Sahası Lv6 (380, 240)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.roundRect(380 - 26, 240 - 26, 52, 52, 8);
        ctx.fill();
        ctx.stroke();
        ctx.font = '24px sans-serif';
        ctx.fillText('🔩', 380, 240);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(380 - 45, 240 + 32, 90, 18);
        ctx.fillStyle = '#7dd3fc';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('Çelik Sahası Lv6', 380, 240 + 41);

        // Resource 2: Odun Alanı Lv6 (920, 180)
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.roundRect(920 - 26, 180 - 26, 52, 52, 8);
        ctx.fill();
        ctx.stroke();
        ctx.font = '24px sans-serif';
        ctx.fillText('🌲', 920, 180);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(920 - 45, 180 + 32, 90, 18);
        ctx.fillStyle = '#6ee7b7';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('Odun Alanı Lv6', 920, 180 + 41);

        // Resource 3: Benzin İstasyonu Lv5 (500, 170)
        ctx.fillStyle = 'rgba(234, 179, 8, 0.2)';
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2;
        ctx.roundRect(500 - 24, 170 - 24, 48, 48, 8);
        ctx.fill();
        ctx.stroke();
        ctx.font = '22px sans-serif';
        ctx.fillText('⛽', 500, 170);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(500 - 40, 170 + 28, 80, 16);
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('Benzin Lv5', 500, 170 + 36);

        // Resource 4: Yemek Deposu / Çiftlik Lv5 (440, 520)
        ctx.fillStyle = 'rgba(249, 115, 22, 0.2)';
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        ctx.roundRect(440 - 24, 520 - 24, 48, 48, 8);
        ctx.fill();
        ctx.stroke();
        ctx.font = '22px sans-serif';
        ctx.fillText('🍖', 440, 520);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(440 - 40, 520 + 28, 80, 16);
        ctx.fillStyle = '#fdba74';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('Yemek Lv5', 440, 520 + 36);

        // Entity 3: Barbarian Lv25 (870, 470) - Animated bounce
        const mobBounce = Math.sin(time * 5) * 4;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.roundRect(870 - 26, 470 - 26 + mobBounce, 52, 52, 8);
        ctx.fill();
        ctx.stroke();
        ctx.font = '24px sans-serif';
        ctx.fillText('👹', 870, 470 + mobBounce);

        ctx.fillStyle = '#450a0a';
        ctx.fillRect(870 - 45, 470 + 32, 90, 18);
        ctx.fillStyle = '#fca5a5';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('Barbar Lv25', 870, 470 + 41);

        // Entity 4: Rally Fort Lv5 (260, 490)
        ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.roundRect(260 - 28, 490 - 28, 56, 56, 8);
        ctx.fill();
        ctx.stroke();
        ctx.font = '26px sans-serif';
        ctx.fillText('⛺', 260, 490);

        ctx.fillStyle = '#3b0764';
        ctx.fillRect(260 - 55, 490 + 34, 110, 18);
        ctx.fillStyle = '#d8b4fe';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('Ralli: Kale Lv5', 260, 490 + 43);
      } else {
        // --- CITY VIEW ELEMENTS ---
        const buildings = [
          { name: 'Belediye Sarayı (Lv 25)', icon: '🏛️', x: 360, y: 300, color: '#38bdf8' },
          { name: 'Hastane (Kapasite: 250k)', icon: '🏥', x: 640, y: 300, color: '#10b981' },
          { name: 'Kışla (T4 Piyade)', icon: '⚔️', x: 920, y: 300, color: '#f59e0b' },
          { name: 'İttifak Merkezi (30/30)', icon: '🛡️', x: 640, y: 500, color: '#a855f7' }
        ];

        buildings.forEach((b) => {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
          ctx.strokeStyle = b.color;
          ctx.lineWidth = 2;
          ctx.roundRect(b.x - 70, b.y - 45, 140, 90, 12);
          ctx.fill();
          ctx.stroke();

          ctx.font = '36px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(b.icon, b.x, b.y - 8);

          ctx.fillStyle = '#e2e8f0';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(b.name, b.x, b.y + 30);
        });
      }

      // 3. Render Animated Tap Points (ADB Tap Ripples)
      activeTaps.forEach((tap) => {
        const age = (Date.now() - tap.timestamp) / 1000;
        if (age < 1.2) {
          const radius = 10 + age * 35;
          const alpha = Math.max(0, 1 - age / 1.2);

          ctx.strokeStyle = tap.color || '#10b981';
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(tap.x, tap.y, radius, 0, Math.PI * 2);
          ctx.stroke();

          // Center dot
          ctx.fillStyle = tap.color || '#10b981';
          ctx.beginPath();
          ctx.arc(tap.x, tap.y, 4, 0, Math.PI * 2);
          ctx.fill();

          // Tag Label Box
          ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
          ctx.fillRect(tap.x - 60, tap.y - 32, 120, 20);
          ctx.strokeStyle = tap.color || '#10b981';
          ctx.strokeRect(tap.x - 60, tap.y - 32, 120, 20);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`${tap.label.slice(0, 15)} (${tap.x}, ${tap.y})`, tap.x, tap.y - 18);

          ctx.globalAlpha = 1.0; // Reset alpha
        }
      });

      // 4. On-Screen Watermarks & HUD (Included in video recording!)
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      // Top Left ADB Telemetry
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(16, 16, 260, 28);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(16, 16, 260, 28);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px monospace';
      ctx.fillText('ADB: 127.0.0.1:5554 | 1280x720 60FPS', 26, 24);

      // Top Center AP / Energy Bar
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(540, 16, 200, 28);
      ctx.strokeStyle = '#f59e0b';
      ctx.strokeRect(540, 16, 200, 28);
      ctx.fillStyle = '#fcd34d';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`⚡ ENERJİ (AP): ${staminaCurrent}/${staminaMax}`, 640, 24);

      // Bottom Left Active Bot Task Module
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(16, 672, 340, 32);
      ctx.strokeStyle = '#10b981';
      ctx.strokeRect(16, 672, 340, 32);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(
        currentModuleId ? `[BOT] ${currentModuleId}.calistir()` : '[BOT] Sistem Hazır (Döngü Bekleniyor)',
        26,
        682
      );

      // 5. Recording Overlay if Active
      // 5. Recording Overlay if Active (MP4 720p HD)
      if (isRecording) {
        ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(225, 29, 72, 0.9)';
        ctx.fillRect(1280 - 180, 16, 164, 30);
        ctx.strokeStyle = '#ffe4e6';
        ctx.strokeRect(1280 - 180, 16, 164, 30);

        // Blinking Red Dot
        const blink = Math.floor(time * 2) % 2 === 0;
        if (blink) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(1280 - 164, 31, 6, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`REC ${formatTimer(recordingSeconds)} (MP4)`, 1280 - 20, 24);
      }

      // 6. In-Game Chat Bubble Render (from Virtual Keyboard input)
      const bubble = activeBubbleRef.current;
      if (bubble) {
        const age = (Date.now() - bubble.timestamp) / 1000;
        if (age < 5.0) {
          const alpha = age > 4.0 ? Math.max(0, 1 - (age - 4.0)) : 1.0;
          ctx.save();
          ctx.globalAlpha = alpha;

          const bX = 640;
          const bY = 560;
          const bW = 640;
          const bH = 68;

          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 14;

          ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2.5;
          ctx.roundRect(bX - bW / 2, bY - bH / 2, bW, bH, 12);
          ctx.fill();
          ctx.stroke();

          ctx.shadowBlur = 0;

          // Header badge
          ctx.fillStyle = '#34d399';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(`💬 SANAL KLAVYE GİRDİSİ [${bubble.channel.toUpperCase()}]`, bX - bW / 2 + 18, bY - 16);

          ctx.fillStyle = '#38bdf8';
          ctx.font = '10px monospace';
          ctx.textAlign = 'right';
          ctx.fillText('adb shell input text', bX + bW / 2 - 18, bY - 16);

          // Message content
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 14px monospace';
          ctx.textAlign = 'left';
          const displayText = bubble.text.length > 46 ? bubble.text.slice(0, 46) + '...' : bubble.text;
          ctx.fillText(`"${displayText}"`, bX - bW / 2 + 18, bY + 12);

          ctx.restore();
        } else {
          activeBubbleRef.current = null;
        }
      }

      // Live typing indicator at bottom left of canvas
      if (currentInputTextRef.current) {
        ctx.save();
        ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.5;
        ctx.roundRect(20, 626, 440, 36, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('⌨️ SANAL KLAVYE YAZIYOR:', 30, 638);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px monospace';
        const preview = currentInputTextRef.current.slice(-30);
        const cursor = Math.floor(time * 2) % 2 === 0 ? '█' : ' ';
        ctx.fillText(`> ${preview}${cursor}`, 30, 652);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [viewMode, activeTaps, currentModuleId, staminaCurrent, staminaMax, isRecording, recordingSeconds]);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full">
      {/* Top Device Header */}
      <div className="px-3 py-2 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-ping'}`} />
          <span className="font-semibold text-slate-200">
            {lang === 'tr' ? 'Sanal ADB Ekranı (1280x720)' : 'Virtual ADB Screen (1280x720)'}
          </span>
          <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">127.0.0.1:5554</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Stamina / AP Display */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[11px]">
            <Zap className="w-3 h-3 text-amber-400 fill-amber-400/20" />
            <span className="text-slate-400">{lang === 'tr' ? 'AP:' : 'AP:'}</span>
            <span className="font-mono font-semibold text-amber-300">
              {staminaCurrent}/{staminaMax}
            </span>
            {onRefillStamina && (
              <button
                onClick={onRefillStamina}
                className="text-[10px] text-amber-400 hover:text-amber-300 underline ml-1 cursor-pointer"
                title={lang === 'tr' ? 'Stamina Doldur' : 'Refill AP'}
              >
                +İksir
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5 text-[11px]">
            <button
              onClick={() => setViewMode('map')}
              className={`px-2 py-0.5 rounded transition-colors ${
                viewMode === 'map' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'tr' ? 'Harita' : 'Map'}
            </button>
            <button
              onClick={() => setViewMode('city')}
              className={`px-2 py-0.5 rounded transition-colors ${
                viewMode === 'city' ? 'bg-slate-800 text-sky-400 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'tr' ? 'Şehir' : 'City'}
            </button>
          </div>

          {/* SCREEN RECORDING BUTTON: START / STOP MP4 */}
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-semibold transition-colors shadow-sm"
              title={lang === 'tr' ? 'Simülasyonu MP4 Formatında Kaydet ve İndir' : 'Record Simulation in MP4 Format'}
            >
              <Circle className="w-3 h-3 fill-rose-500 text-rose-500" />
              <span>{lang === 'tr' ? 'MP4 Kaydı Başlat' : 'Record MP4'}</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white border border-rose-400 text-[11px] font-bold transition-colors animate-pulse shadow-md"
              title={lang === 'tr' ? 'Kaydı Durdur ve MP4 Dosyasını İndir' : 'Stop & Export MP4 Video'}
            >
              <Square className="w-3 h-3 fill-white" />
              <span>REC {formatTimer(recordingSeconds)} · {lang === 'tr' ? 'Durdur & MP4 İndir' : 'Stop & MP4'}</span>
            </button>
          )}

          {/* Mini-Map / Castle Finder trigger */}
          {onOpenMiniMap && (
            <button
              onClick={onOpenMiniMap}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition-colors"
              title={lang === 'tr' ? 'Krallık Mini-Haritası ve Radar Ekranını Aç' : 'Open Mini-Map & Radar'}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{lang === 'tr' ? 'Mini-Harita' : 'Mini-Map'}</span>
            </button>
          )}

          {/* Dedicated Player / Castle Finder Modal Trigger */}
          {onOpenPlayerFinder && (
            <button
              onClick={onOpenPlayerFinder}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold transition-colors shadow-sm"
              title={lang === 'tr' ? 'Haritada Oyuncu Adı veya TAG ile Kale Bulucu Modalını Aç' : 'Open Player & Castle Finder Modal'}
            >
              <Crosshair className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>{lang === 'tr' ? '🎯 Kale & TAG Bul' : '🎯 Find Target'}</span>
            </button>
          )}

          {/* Virtual Keyboard Header Toggle Trigger */}
          <button
            onClick={() => setShowVirtualKeyboard((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold transition-all border shadow-sm ${
              showVirtualKeyboard
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title={lang === 'tr' ? 'Sanal Klavye ve Metin Giriş Panelini Aç / Kapat' : 'Toggle Virtual Keyboard & In-Game Input'}
          >
            <Keyboard className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'tr' ? '⌨️ Sanal Klavye' : '⌨️ Virtual Keyboard'}</span>
            <span className={`w-1.5 h-1.5 rounded-full ${showVirtualKeyboard ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          </button>
        </div>
      </div>

      {/* Screen Canvas Area with Live Video Recording & Direct Clicks */}
      <div className="p-2.5 bg-slate-950 flex-1 flex flex-col justify-center relative">
        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={() => setHoverCoords(null)}
            className="w-full h-full object-contain cursor-crosshair select-none block"
            title={lang === 'tr' ? 'Tıklayarak ADB dokunma testi yapın' : 'Click to test tap'}
          />

          {/* Downloaded Video Toast Alert */}
          {lastDownloadedVideo && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 px-3 py-1.5 rounded-lg shadow-xl text-xs flex items-center gap-2 backdrop-blur animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'tr' ? `MP4 Videosu İndirildi: ${lastDownloadedVideo}` : `MP4 Video Exported: ${lastDownloadedVideo}`}</span>
            </div>
          )}

          {/* Active Target Notification Toast */}
          {activeTargetNotice && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-40 bg-slate-950/95 border border-amber-500/80 text-amber-300 px-3.5 py-1.5 rounded-lg shadow-2xl text-xs flex items-center gap-2 backdrop-blur animate-in fade-in zoom-in-95 pointer-events-none">
              <Crosshair className="w-4 h-4 text-amber-400 animate-spin" />
              <span className="font-semibold">{activeTargetNotice}</span>
            </div>
          )}

          {/* 1. TOP FLOATING HUD BAR (Play/Pause, Step, Reset, Haritaya Git, View Switcher) */}
          {showOverlay ? (
            <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between gap-1.5 pointer-events-none">
              {/* Left: Bot Status Badge + Direct Run/Pause/Step/Reset Buttons */}
              <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-950/85 backdrop-blur-md border border-slate-700/70 rounded-lg p-1 shadow-lg">
                {/* Live Status indicator */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border font-mono">
                  <span className={`w-2 h-2 rounded-full ${isRunning && !isPaused ? 'bg-emerald-400 animate-ping' : isPaused ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
                  <span className={isRunning && !isPaused ? 'text-emerald-300' : isPaused ? 'text-amber-300' : 'text-slate-400'}>
                    {isRunning && !isPaused
                      ? (lang === 'tr' ? 'ÇALIŞIYOR' : 'RUNNING')
                      : isPaused
                      ? (lang === 'tr' ? 'DURAKLATILDI' : 'PAUSED')
                      : (lang === 'tr' ? 'BEKLEMEDE' : 'IDLE')}
                  </span>
                  {cycleCount > 0 && (
                    <span className="text-[10px] text-slate-500 hidden sm:inline">#{cycleCount}</span>
                  )}
                </div>

                {/* Primary Start / Pause / Resume Button */}
                {isRunning && !isPaused ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPauseBot?.();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/25 hover:bg-amber-500/40 text-amber-200 border border-amber-400/60 text-xs font-bold transition-all shadow cursor-pointer"
                    title={lang === 'tr' ? 'Botu Duraklat' : 'Pause Bot'}
                  >
                    <Pause className="w-3.5 h-3.5 fill-amber-300" />
                    <span>{lang === 'tr' ? 'Durdur' : 'Pause'}</span>
                  </button>
                ) : isPaused ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      (onResumeBot || onStartBot)?.();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-200 border border-emerald-400/80 text-xs font-bold transition-all shadow cursor-pointer animate-pulse"
                    title={lang === 'tr' ? 'Botu Devam Ettir' : 'Resume Bot'}
                  >
                    <Play className="w-3.5 h-3.5 fill-emerald-300" />
                    <span>{lang === 'tr' ? 'Devam Et' : 'Resume'}</span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartBot?.();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600/50 hover:bg-emerald-500 text-white border border-emerald-400 text-xs font-bold transition-all shadow-md cursor-pointer"
                    title={lang === 'tr' ? 'Otomasyon Botunu Başlat' : 'Start Automation Bot'}
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{lang === 'tr' ? 'Başlat' : 'Start'}</span>
                  </button>
                )}

                {/* Single Step Test Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStepBot?.();
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900/90 hover:bg-slate-800 text-sky-300 border border-sky-500/40 text-xs font-medium transition-colors shadow cursor-pointer"
                  title={lang === 'tr' ? 'Tek Adım Yürüt (Test)' : 'Step Once'}
                >
                  <FastForward className="w-3 h-3 text-sky-400" />
                  <span className="hidden sm:inline">{lang === 'tr' ? 'Adım' : 'Step'}</span>
                </button>

                {/* Reset Loop Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onResetBot?.();
                  }}
                  className="p-1 rounded bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs transition-colors shadow cursor-pointer"
                  title={lang === 'tr' ? 'Döngüyü Sıfırla' : 'Reset Loop'}
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              {/* Right: Haritaya Git, Mini-Harita, Şehir/Harita Toggle, & Menu Minimizer */}
              <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-950/85 backdrop-blur-md border border-slate-700/70 rounded-lg p-1 shadow-lg">
                {/* "Haritaya Git" / Quick Coords Popup Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsGoToCoordsOpen((prev) => !prev);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all border shadow cursor-pointer ${
                    isGoToCoordsOpen
                      ? 'bg-amber-500/30 text-amber-200 border-amber-400 ring-1 ring-amber-400/50'
                      : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40'
                  }`}
                  title={lang === 'tr' ? 'Haritada Koordinata Git ve Yönlendir' : 'Go to Coordinates & Pan'}
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>{lang === 'tr' ? 'Haritaya Git' : 'Go to Coords'}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isGoToCoordsOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Quick Toggle View: Map ↔ City */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewMode((prev) => (prev === 'map' ? 'city' : 'map'));
                  }}
                  className="hidden md:flex items-center gap-1 px-2 py-1 rounded bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-colors shadow cursor-pointer"
                  title={lang === 'tr' ? 'Harita ve Şehir Görünümünü Değiştir' : 'Toggle Map and City View'}
                >
                  <Map className="w-3 h-3 text-sky-400" />
                  <span>{viewMode === 'map' ? (lang === 'tr' ? 'Harita' : 'Map') : (lang === 'tr' ? 'Şehir' : 'City')}</span>
                </button>

                {/* Mini-Harita Quick Trigger */}
                {onOpenMiniMap && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenMiniMap();
                    }}
                    className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-medium transition-colors shadow cursor-pointer"
                    title={lang === 'tr' ? 'Radar Mini-Haritasına Geç' : 'Switch to Mini-Map Radar'}
                  >
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>{lang === 'tr' ? 'Radar' : 'Radar'}</span>
                  </button>
                )}

                {/* Toggle Overlay Visibility */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOverlay(false);
                  }}
                  className="p-1 rounded bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 text-xs transition-colors shadow cursor-pointer"
                  title={lang === 'tr' ? 'Ekran Menüsünü Gizle' : 'Hide Screen Overlay'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Minimized Pill to restore overlay */
            <div className="absolute top-2 left-2 z-20 pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOverlay(true);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/90 hover:bg-slate-900 text-emerald-400 border border-emerald-500/50 text-xs font-semibold backdrop-blur shadow-xl transition-all cursor-pointer ring-1 ring-emerald-500/30"
                title={lang === 'tr' ? 'Ekran Bot Menüsünü Göster' : 'Show Screen Bot Overlay'}
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'tr' ? '⚡ Bot Menüsü' : '⚡ Bot HUD'}</span>
              </button>
            </div>
          )}

          {/* 2. ANDROID EMULATOR RIGHT SIDE DOCK (LDPlayer / BlueStacks style quick tools) */}
          {showOverlay && (
            <div className="absolute right-2 top-14 bottom-10 z-20 flex flex-col justify-center gap-1.5 pointer-events-auto">
              <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800/80 rounded-xl p-1 shadow-2xl flex flex-col gap-1 items-center">
                {/* 1. Play / Pause */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isRunning && !isPaused) onPauseBot?.();
                    else (onResumeBot || onStartBot)?.();
                  }}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    isRunning && !isPaused
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  }`}
                  title={isRunning && !isPaused ? (lang === 'tr' ? 'Durdur' : 'Pause') : (lang === 'tr' ? 'Başlat' : 'Start')}
                >
                  {isRunning && !isPaused ? <Pause className="w-3.5 h-3.5 fill-amber-300" /> : <Play className="w-3.5 h-3.5 fill-emerald-300" />}
                </button>

                {/* 2. Step */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStepBot?.();
                  }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-700 text-xs transition-colors cursor-pointer"
                  title={lang === 'tr' ? 'Tek Adım İlerle' : 'Step Once'}
                >
                  <FastForward className="w-3.5 h-3.5" />
                </button>

                {/* 3. Go to Coords */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsGoToCoordsOpen((prev) => !prev);
                  }}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    isGoToCoordsOpen
                      ? 'bg-amber-500/30 text-amber-300 border border-amber-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700'
                  }`}
                  title={lang === 'tr' ? 'Haritaya Git (Koordinat Seçici)' : 'Go to Coordinates'}
                >
                  <Navigation className="w-3.5 h-3.5" />
                </button>

                {/* 4. Mini-Map Radar */}
                {onOpenMiniMap && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenMiniMap();
                    }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700 transition-colors cursor-pointer"
                    title={lang === 'tr' ? 'Radar Mini-Haritası' : 'Mini-Map Radar'}
                  >
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                  </button>
                )}

                {/* 5. Target / Castle Finder */}
                {onOpenPlayerFinder && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPlayerFinder();
                    }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-700 transition-colors cursor-pointer"
                    title={lang === 'tr' ? 'Kale & TAG Bulucu Modal' : 'Castle & Target Finder'}
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* 6. Refill Stamina */}
                {onRefillStamina && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRefillStamina();
                    }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 transition-colors cursor-pointer"
                    title={lang === 'tr' ? '+50 AP İksir Kullan' : 'Refill +50 AP'}
                  >
                    <Zap className="w-3.5 h-3.5 fill-amber-400/30" />
                  </button>
                )}

                {/* 7. Map / City Switch */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewMode((prev) => (prev === 'map' ? 'city' : 'map'));
                  }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-700 transition-colors cursor-pointer"
                  title={lang === 'tr' ? 'Şehir / Harita Geçişi' : 'Toggle City / Map'}
                >
                  <Map className="w-3.5 h-3.5" />
                </button>

                {/* 8. Virtual Keyboard */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowVirtualKeyboard((prev) => !prev);
                  }}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    showVirtualKeyboard
                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                  title={lang === 'tr' ? 'Sanal Klavyeyi Aç / Kapat' : 'Toggle Virtual Keyboard'}
                >
                  <Keyboard className="w-3.5 h-3.5" />
                </button>

                {/* 9. Reset */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onResetBot?.();
                  }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                  title={lang === 'tr' ? 'Döngüyü Sıfırla' : 'Reset Simulation'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 3. INTERACTIVE "HARİTAYA GİT" OVERLAY PANEL */}
          {isGoToCoordsOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-12 left-2 right-2 sm:left-auto sm:right-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[480px] z-30 bg-slate-950/95 backdrop-blur-xl border border-amber-500/60 rounded-xl p-3 shadow-2xl flex flex-col gap-2.5 animate-in fade-in zoom-in-95 pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Navigation className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-200">
                      {lang === 'tr' ? '🗺️ Haritaya Git & Kamerayı Kaydır' : '🗺️ Go to Coordinates & Pan'}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {lang === 'tr' ? 'Hedef koordinat seçin veya yön tuşlarıyla haritada gezinin' : 'Select target coordinates or pan with directional arrows'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsGoToCoordsOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title={lang === 'tr' ? 'Kapat' : 'Close'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Preset Location Grid */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {lang === 'tr' ? 'Hızlı Hedef Noktaları' : 'Quick Presets'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {quickLocations.map((loc) => (
                    <button
                      key={loc.nameEn}
                      onClick={() => handleGoToCoords(loc.x, loc.y, lang === 'tr' ? loc.nameTr : loc.nameEn)}
                      className="flex flex-col items-start p-1.5 rounded-lg bg-slate-900/90 hover:bg-amber-500/20 hover:border-amber-500/60 border border-slate-800 text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs">{loc.icon}</span>
                        <span className="text-[9px] font-mono text-amber-400/90 bg-amber-500/10 px-1 py-0.2 rounded border border-amber-500/30">
                          {loc.tag}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-200 group-hover:text-amber-200 truncate w-full mt-0.5">
                        {lang === 'tr' ? loc.nameTr : loc.nameEn}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        X:{loc.x} Y:{loc.y}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Coordinates Input & Camera D-Pad Pan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                {/* Manual X & Y Jump */}
                <div className="flex flex-col gap-1.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400">
                    {lang === 'tr' ? '🎯 Özel Koordinat Girişi (0-1200)' : '🎯 Custom Coordinates (0-1200)'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 flex-1">
                      <span className="text-[10px] font-mono text-amber-400">X:</span>
                      <input
                        type="number"
                        min="0"
                        max="1200"
                        value={customCoordX}
                        onChange={(e) => setCustomCoordX(e.target.value)}
                        className="w-full bg-transparent text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 flex-1">
                      <span className="text-[10px] font-mono text-amber-400">Y:</span>
                      <input
                        type="number"
                        min="0"
                        max="1200"
                        value={customCoordY}
                        onChange={(e) => setCustomCoordY(e.target.value)}
                        className="w-full bg-transparent text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const px = Math.max(0, Math.min(1200, parseInt(customCoordX) || 0));
                      const py = Math.max(0, Math.min(1200, parseInt(customCoordY) || 0));
                      handleGoToCoords(px, py, lang === 'tr' ? 'Özel Koordinat' : 'Custom Coords');
                    }}
                    className="w-full py-1 rounded bg-amber-500/25 hover:bg-amber-500/40 text-amber-200 border border-amber-400/60 text-xs font-bold transition-all shadow cursor-pointer text-center"
                  >
                    🚀 {lang === 'tr' ? 'Konuma Git & Tıkla' : 'Jump to Coords'}
                  </button>
                </div>

                {/* D-Pad Camera Swipe / Pan Directional Controls */}
                <div className="flex flex-col gap-1.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400">
                    {lang === 'tr' ? '🕹️ Kamerayı Kaydır (ADB Swipe)' : '🕹️ Pan Camera (ADB Swipe)'}
                  </span>
                  <div className="grid grid-cols-3 gap-1 place-items-center">
                    <div />
                    <button
                      onClick={() => handleSwipeDirection('up')}
                      className="p-1.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs transition-colors cursor-pointer w-full flex justify-center"
                      title={lang === 'tr' ? 'Kuzeye Kaydır (Yukarı)' : 'Swipe North (Up)'}
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-sky-400" />
                    </button>
                    <div />

                    <button
                      onClick={() => handleSwipeDirection('left')}
                      className="p-1.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs transition-colors cursor-pointer w-full flex justify-center"
                      title={lang === 'tr' ? 'Batıya Kaydır (Sola)' : 'Swipe West (Left)'}
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
                    </button>
                    <button
                      onClick={() => handleGoToCoords(600, 600, lang === 'tr' ? 'Merkez' : 'Center')}
                      className="p-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition-colors cursor-pointer w-full text-center"
                      title={lang === 'tr' ? 'Merkeze Sıfırla' : 'Center'}
                    >
                      MERKEZ
                    </button>
                    <button
                      onClick={() => handleSwipeDirection('right')}
                      className="p-1.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs transition-colors cursor-pointer w-full flex justify-center"
                      title={lang === 'tr' ? 'Doğuya Kaydır (Sağa)' : 'Swipe East (Right)'}
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                    </button>

                    <div />
                    <button
                      onClick={() => handleSwipeDirection('down')}
                      className="p-1.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs transition-colors cursor-pointer w-full flex justify-center"
                      title={lang === 'tr' ? 'Güneye Kaydır (Aşağı)' : 'Swipe South (Down)'}
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
                    </button>
                    <div />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. BOTTOM FLOATING HUD STATUS STRIP */}
          {showOverlay && (
            <div className="absolute bottom-1.5 left-2 right-2 z-20 flex items-center justify-between text-[10px] font-mono pointer-events-none gap-2">
              {/* Left: Real-time Cursor & Screen Tap Position */}
              <div className="bg-slate-950/85 backdrop-blur border border-slate-800 rounded px-2 py-0.5 text-slate-300 flex items-center gap-1.5 shadow">
                <Crosshair className="w-3 h-3 text-emerald-400" />
                <span>
                  ADB: X:<strong className="text-white">{hoverCoords ? hoverCoords.x : 640}</strong> Y:<strong className="text-white">{hoverCoords ? hoverCoords.y : 360}</strong>
                </span>
                <span className="text-slate-500 hidden sm:inline">(1280x720)</span>
              </div>

              {/* Center: Current active module indicator */}
              <div className="bg-slate-950/85 backdrop-blur border border-slate-800 rounded px-2 py-0.5 text-emerald-300 font-semibold flex items-center gap-1 shadow">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>{getModuleName(currentModuleId)}</span>
              </div>

              {/* Right: Direct Speed Selector */}
              {onSetSpeed && (
                <div className="pointer-events-auto bg-slate-950/85 backdrop-blur border border-slate-800 rounded p-0.5 flex items-center gap-0.5 shadow">
                  <span className="text-[9px] text-slate-400 px-1 hidden sm:inline">
                    {lang === 'tr' ? 'Hız:' : 'Speed:'}
                  </span>
                  {[1, 2, 5].map((s) => (
                    <button
                      key={s}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetSpeed(s);
                      }}
                      className={`px-1.5 py-0.2 rounded font-bold transition-colors cursor-pointer ${
                        speedMultiplier === s
                          ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sanal Klavye & Oyun İçi Metin Giriş Modülü */}
      {showVirtualKeyboard ? (
        <div className="px-3 py-2.5 border-t border-slate-800 bg-slate-950/95 flex flex-col gap-2 transition-all shadow-inner">
          {/* Header Row: Title, Target Channel Selector & Quick Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <Keyboard className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'tr' ? 'Sanal Klavye & Oyun İçi Metin Girişi' : 'Virtual Keyboard & In-Game Input'}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
                (adb shell input text / keyevent)
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Channel Selector */}
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setTargetChannel('alliance')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    targetChannel === 'alliance'
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={lang === 'tr' ? 'İttifak Sohbeti Kanalı' : 'Alliance Chat Channel'}
                >
                  💬 {lang === 'tr' ? 'İttifak' : 'Alliance'}
                </button>
                <button
                  type="button"
                  onClick={() => setTargetChannel('kingdom')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    targetChannel === 'kingdom'
                      ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={lang === 'tr' ? 'Krallık Sohbeti Kanalı' : 'Kingdom Chat Channel'}
                >
                  🌐 {lang === 'tr' ? 'Krallık' : 'Kingdom'}
                </button>
                <button
                  type="button"
                  onClick={() => setTargetChannel('coords')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    targetChannel === 'coords'
                      ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={lang === 'tr' ? 'Harita Koordinat Arama' : 'Coordinate Search'}
                >
                  🎯 {lang === 'tr' ? 'Koordinat' : 'Coords'}
                </button>
                <button
                  type="button"
                  onClick={() => setTargetChannel('command')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    targetChannel === 'command'
                      ? 'bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={lang === 'tr' ? 'Doğrudan ADB Shell Komutu' : 'Direct ADB Command'}
                >
                  📟 {lang === 'tr' ? 'Konsol' : 'Console'}
                </button>
              </div>

              {/* Toggle Key Grid Collapse Button */}
              <button
                type="button"
                onClick={() => setShowKeyGrid((prev) => !prev)}
                className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] transition-colors"
                title={showKeyGrid ? (lang === 'tr' ? 'Tuş Takımını Gizle' : 'Hide Keys') : (lang === 'tr' ? 'Tuş Takımını Göster' : 'Show Keys')}
              >
                <span>{showKeyGrid ? (lang === 'tr' ? 'Tuşları Gizle' : 'Hide Keys') : (lang === 'tr' ? 'Tuşları Aç' : 'Show Keys')}</span>
                {showKeyGrid ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {/* Close Keyboard Panel Button */}
              <button
                type="button"
                onClick={() => setShowVirtualKeyboard(false)}
                className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-[11px]"
                title={lang === 'tr' ? 'Klavyeyi Kapat' : 'Close Keyboard'}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Metin Giriş Alanı & Action Buttons */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendText();
            }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  targetChannel === 'coords'
                    ? (lang === 'tr' ? 'Koordinat girin (örn: X:600 Y:600)...' : 'Enter coords (e.g. X:600 Y:600)...')
                    : targetChannel === 'command'
                    ? (lang === 'tr' ? 'ADB Shell parametresi veya komutu...' : 'ADB shell command...')
                    : (lang === 'tr' ? 'Oyun içine metin yazın veya sanal klavye tuşlarına tıklayın...' : 'Type text or click virtual keys...')
                }
                className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono pr-8 transition-colors"
              />
              {inputText && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 text-xs"
                  title={lang === 'tr' ? 'Temizle' : 'Clear'}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0 flex-wrap sm:flex-nowrap">
              {/* Send Text Button */}
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-semibold shadow-md shadow-emerald-950/50 transition-all active:scale-95"
                title={lang === 'tr' ? 'Metni oyuna yaz (adb shell input text)' : 'Send text to game'}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'Gönder' : 'Send'}</span>
              </button>

              {/* Enter Key (Keyevent 66) */}
              <button
                type="button"
                onClick={handleSendEnterKey}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-colors active:scale-95"
                title={lang === 'tr' ? 'ENTER tuşu gönder (Keyevent 66)' : 'Send ENTER key (Keyevent 66)'}
              >
                <CornerDownLeft className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">ENTER</span>
              </button>

              {/* Backspace Button */}
              <button
                type="button"
                onClick={handleBackspace}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-colors active:scale-95"
                title={lang === 'tr' ? 'Geri Sil (Backspace - Keyevent 67)' : 'Backspace (Keyevent 67)'}
              >
                <Delete className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">{lang === 'tr' ? 'Sil' : 'Del'}</span>
              </button>

              {/* Clear All */}
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs transition-colors"
                title={lang === 'tr' ? 'Tüm Metni Temizle' : 'Clear all text'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick Game Macros (Hızlı Oyun Şablonları) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px] no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 font-mono">
              {lang === 'tr' ? 'Makrolar:' : 'Macros:'}
            </span>
            {[
              { label: '[TURK] Selamlar!', value: '[TURK] Selamlar, ralliye hazırız!' },
              { label: '🎯 X:600 Y:600', value: 'X:600 Y:600' },
              { label: '🦍 Goril X:520 Y:380', value: 'Goril Bulundu: X:520 Y:380' },
              { label: '⚔️ Ralli Desteği', value: '[TURK] Ralli açıldı, acil destek!' },
              { label: '🛡️ Barış Kalkanı', value: 'Barış Kalkanı 8 Saat Aktif' },
              { label: '🏛️ Lands of Jail', value: 'Lands of Jail - Karargah Emirleri' },
              { label: '💊 Revir Yardımı', value: 'Revirde yaralılar var, yardım rica!' }
            ].map((macro, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(macro.value);
                }}
                onDoubleClick={() => {
                  handleSendText(macro.value);
                }}
                className="shrink-0 px-2 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 text-[10px] font-medium transition-all"
                title={lang === 'tr' ? 'Tıkla: Yazdır / Çift Tıkla: Doğrudan Gönder' : 'Click: Insert / Double Click: Send'}
              >
                {macro.label}
              </button>
            ))}
          </div>

          {/* Interactive Virtual Keyboard Grid (Tuş Takımı) */}
          {showKeyGrid && (
            <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-2 flex flex-col gap-1.5 select-none animate-in fade-in duration-200">
              {/* Row 1: Numbers & Symbols */}
              <div className="flex items-center justify-center gap-1 flex-wrap sm:flex-nowrap">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '/'].map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => handleKeyClick(char)}
                    className="flex-1 min-w-[22px] sm:min-w-[32px] h-7 sm:h-8 rounded bg-slate-900 hover:bg-slate-800 active:bg-emerald-600/40 border border-slate-800 hover:border-slate-700 text-slate-200 font-mono text-xs font-semibold flex items-center justify-center transition-all active:scale-95 shadow-sm"
                  >
                    {char}
                  </button>
                ))}
              </div>

              {/* Row 2: QWERTY Row 1 (Q..P, Ğ, Ü) */}
              <div className="flex items-center justify-center gap-1 flex-wrap sm:flex-nowrap">
                {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'ğ', 'ü'].map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => handleKeyClick(char)}
                    className="flex-1 min-w-[22px] sm:min-w-[32px] h-7 sm:h-8 rounded bg-slate-900 hover:bg-slate-800 active:bg-emerald-600/40 border border-slate-800 hover:border-slate-700 text-slate-200 font-mono text-xs font-semibold flex items-center justify-center transition-all active:scale-95 shadow-sm uppercase"
                  >
                    {isCapsLock ? char.toUpperCase() : char.toLowerCase()}
                  </button>
                ))}
              </div>

              {/* Row 3: QWERTY Row 2 (A..L, Ş, İ) */}
              <div className="flex items-center justify-center gap-1 flex-wrap sm:flex-nowrap px-1 sm:px-3">
                {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ş', 'i'].map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => handleKeyClick(char)}
                    className="flex-1 min-w-[22px] sm:min-w-[32px] h-7 sm:h-8 rounded bg-slate-900 hover:bg-slate-800 active:bg-emerald-600/40 border border-slate-800 hover:border-slate-700 text-slate-200 font-mono text-xs font-semibold flex items-center justify-center transition-all active:scale-95 shadow-sm uppercase"
                  >
                    {isCapsLock ? char.toUpperCase() : char.toLowerCase()}
                  </button>
                ))}
              </div>

              {/* Row 4: CapsLock, Bottom Letters (Z..M, Ö, Ç), Backspace */}
              <div className="flex items-center justify-center gap-1 flex-wrap sm:flex-nowrap">
                {/* Caps Lock Button */}
                <button
                  type="button"
                  onClick={() => setIsCapsLock((prev) => !prev)}
                  className={`px-2 sm:px-3 h-7 sm:h-8 rounded border text-xs font-mono font-bold flex items-center gap-1 transition-all active:scale-95 shadow-sm ${
                    isCapsLock
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-emerald-950/40'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                  }`}
                  title={isCapsLock ? 'Caps Lock Açık' : 'Caps Lock Kapalı'}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isCapsLock ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                  <span className="text-[10px]">CAPS</span>
                </button>

                {['z', 'x', 'c', 'v', 'b', 'n', 'm', 'ö', 'ç'].map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => handleKeyClick(char)}
                    className="flex-1 min-w-[22px] sm:min-w-[30px] h-7 sm:h-8 rounded bg-slate-900 hover:bg-slate-800 active:bg-emerald-600/40 border border-slate-800 hover:border-slate-700 text-slate-200 font-mono text-xs font-semibold flex items-center justify-center transition-all active:scale-95 shadow-sm uppercase"
                  >
                    {isCapsLock ? char.toUpperCase() : char.toLowerCase()}
                  </button>
                ))}

                {/* Backspace Button in Keyboard Grid */}
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="px-2 sm:px-3 h-7 sm:h-8 rounded bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-600 text-rose-300 border border-rose-500/30 text-xs font-mono font-semibold flex items-center gap-1 transition-all active:scale-95 shadow-sm"
                  title="Backspace (Geri Sil)"
                >
                  <Delete className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">SİL</span>
                </button>
              </div>

              {/* Row 5: Coordinates, Spacebar, Punctuation & Enter */}
              <div className="flex items-center justify-center gap-1 flex-wrap sm:flex-nowrap">
                {/* Quick Coords & Tag Brackets */}
                <button
                  type="button"
                  onClick={() => handleKeyClick('X:')}
                  className="px-2 h-7 sm:h-8 rounded bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 font-mono text-[11px] font-bold"
                >
                  X:
                </button>
                <button
                  type="button"
                  onClick={() => handleKeyClick('Y:')}
                  className="px-2 h-7 sm:h-8 rounded bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 font-mono text-[11px] font-bold"
                >
                  Y:
                </button>
                <button
                  type="button"
                  onClick={() => handleKeyClick('[')}
                  className="w-7 h-7 sm:h-8 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-xs font-bold"
                >
                  [
                </button>
                <button
                  type="button"
                  onClick={() => handleKeyClick(']')}
                  className="w-7 h-7 sm:h-8 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-xs font-bold"
                >
                  ]
                </button>

                {/* Spacebar */}
                <button
                  type="button"
                  onClick={() => handleKeyClick(' ')}
                  className="flex-grow min-w-[90px] h-7 sm:h-8 rounded bg-slate-900 hover:bg-slate-800 active:bg-emerald-600/30 border border-slate-800 text-slate-300 font-mono text-[11px] font-medium flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm"
                >
                  <span>BOŞLUK (SPACE)</span>
                </button>

                {/* Punctuations */}
                <button
                  type="button"
                  onClick={() => handleKeyClick('.')}
                  className="w-7 h-7 sm:h-8 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-xs font-bold"
                >
                  .
                </button>
                <button
                  type="button"
                  onClick={() => handleKeyClick(':')}
                  className="w-7 h-7 sm:h-8 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-xs font-bold"
                >
                  :
                </button>
                <button
                  type="button"
                  onClick={() => handleKeyClick('#')}
                  className="w-7 h-7 sm:h-8 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-xs font-bold"
                >
                  #
                </button>

                {/* Enter / Send in Grid */}
                <button
                  type="button"
                  onClick={() => handleSendText()}
                  className="px-3 h-7 sm:h-8 rounded bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-mono text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  <span>GÖNDER</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom Helpful Guide / ADB Command Hint */}
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono px-1">
            <span>
              {lang === 'tr'
                ? '💡 İpucu: Fiziksel klavyeden veya sanal tuşlara basarak doğrudan oyun içine ADB metin girişi yapabilirsiniz.'
                : '💡 Tip: Type with physical keyboard or click virtual keys to send text via ADB.'}
            </span>
            {recentInputs.length > 0 && (
              <span className="hidden sm:inline text-slate-400">
                {lang === 'tr' ? 'Son Girdi:' : 'Last:'} &quot;{recentInputs[0].slice(0, 20)}...&quot;
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Collapsed Quick Text Input Bar */
        <div className="px-3 py-1.5 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            <Keyboard className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendText();
                }
              }}
              placeholder={lang === 'tr' ? 'Hızlı metin yazın ve Enter\'a basın...' : 'Type fast text and hit Enter...'}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
            {inputText.trim() && (
              <button
                type="button"
                onClick={() => handleSendText()}
                className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shrink-0"
              >
                {lang === 'tr' ? 'Gönder' : 'Send'}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowVirtualKeyboard(true)}
            className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium hover:underline shrink-0"
          >
            <Keyboard className="w-3 h-3" />
            <span>{lang === 'tr' ? 'Sanal Klavyeyi Aç ▾' : 'Open Virtual Keyboard ▾'}</span>
          </button>
        </div>
      )}

      {/* March Slots Bar (Kıtalar 1..4) */}
      <div className="px-3 py-2 border-t border-slate-800 bg-slate-950/80">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'tr' ? 'Aktif Birlik & Kıta Durumu' : 'Active Marches'}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {marches.filter((m) => m.status !== 'idle').length} / {marches.length} {lang === 'tr' ? 'Meşgul' : 'Busy'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {marches.map((march) => {
            const isIdle = march.status === 'idle';
            return (
              <div
                key={march.id}
                className={`p-1.5 rounded-lg border text-xs ${
                  isIdle
                    ? 'bg-slate-900/40 border-slate-800/60 text-slate-500'
                    : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] mb-0.5">
                  <span className="font-semibold text-slate-200">Kıta #{march.id}</span>
                  <span
                    className={
                      march.status === 'gathering'
                        ? 'text-emerald-400'
                        : march.status === 'fighting' || march.status === 'marching'
                        ? 'text-amber-400'
                        : 'text-slate-500'
                    }
                  >
                    {march.status === 'gathering'
                      ? (lang === 'tr' ? 'Topluyor' : 'Gathering')
                      : march.status === 'marching'
                      ? (lang === 'tr' ? 'Yolda' : 'Marching')
                      : march.status === 'fighting'
                      ? (lang === 'tr' ? 'Rallide' : 'Rallying')
                      : (lang === 'tr' ? 'Boşta' : 'Idle')}
                  </span>
                </div>

                <div className="text-[10px] truncate text-slate-300 font-medium">{march.targetName}</div>

                {/* Progress bar */}
                {!isIdle && (
                  <div className="mt-1">
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${march.progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
