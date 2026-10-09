export type ModuleId =
  | 'modules.gather'
  | 'modules.monster'
  | 'modules.rally'
  | 'modules.heal'
  | 'modules.shield_check'
  | 'modules.train_troops'
  | 'modules.daily_quests'
  | string;

export interface ModuleParam {
  id: string;
  nameTr: string;
  nameEn: string;
  type: 'select' | 'number' | 'boolean' | 'range' | 'text';
  value: any;
  options?: { labelTr: string; labelEn: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  descriptionTr?: string;
  descriptionEn?: string;
}

export interface TaskModule {
  id: ModuleId;
  nameTr: string;
  nameEn: string;
  category: 'gathering' | 'combat' | 'alliance' | 'economy' | 'security' | 'custom';
  descriptionTr: string;
  descriptionEn: string;
  enabled: boolean;
  intervalSec: number;
  lastRun?: number;
  runCount: number;
  successCount: number;
  errorCount: number;
  cooldownRemaining: number;
  params: ModuleParam[];
  pythonCodeSnippet: string;
  isCustom?: boolean;
}

export type LogLevel = 'INFO' | 'ACTION' | 'SUCCESS' | 'WARNING' | 'ERROR';

export interface BotLog {
  id: string;
  timestamp: string;
  moduleId?: string;
  level: LogLevel;
  messageTr: string;
  messageEn: string;
  details?: Record<string, any>;
}

export interface MarchSlot {
  id: number;
  status: 'idle' | 'marching' | 'gathering' | 'fighting' | 'returning';
  targetName: string;
  commander: string;
  troops: number;
  progressPercent: number;
  remainingSeconds: number;
  coords: { x: number; y: number };
}

export interface EmulatorTapPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  timestamp: number;
  color?: string;
}

export interface DetectedEntity {
  id: string;
  type: 'resource' | 'monster' | 'rally' | 'city' | 'button';
  name: string;
  level?: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number;
  height: number;
  confidence: number;
}

export interface MapEntity {
  id: string;
  name: string;
  category: 'player' | 'enemy' | 'resource' | 'monster' | 'rally' | 'alliance';
  tag?: string;
  level: number;
  x: number; // 0 to 1200
  y: number; // 0 to 1200
  distance?: number;
  status?: string;
  discoveredAt?: string;
}

export interface AdbConfig {
  deviceType: 'ldplayer' | 'bluestacks' | 'nox' | 'mumu' | 'custom' | 'tablet';
  host: string;
  port: number;
  serial: string;
  screenResolution: '1280x720' | '1920x1080' | '1600x900' | '960x540';
  orientation: 'landscape' | 'portrait';
  antiBan: {
    enabled: boolean;
    clickJitterPx: number;
    bezierCurveSwipe: boolean;
    randomDelayFactor: number;
    hourlyBreakMinutes: number;
  };
  gamePackage?: string;
  autoRestartOnCrash?: boolean;
  telegramNotifications: {
    enabled: boolean;
    botToken: string;
    chatId: string;
    alertOnCaptcha: boolean;
    alertOnAttack: boolean;
    alertOnShieldLow: boolean;
  };
}

export interface GamePreset {
  id: string;
  name: string;
  gameTitle: string;
  descriptionTr: string;
  descriptionEn: string;
  activeModules: string[];
  recommendedAdb: Partial<AdbConfig>;
}
