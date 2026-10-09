import { TaskModule, BotLog, MarchSlot, EmulatorTapPoint, DetectedEntity } from '../types';

export interface SimulatorState {
  isRunning: boolean;
  isPaused: boolean;
  cycleCount: number;
  currentModuleId: string | null;
  speedMultiplier: number;
  uptimeSeconds: number;
  stats: {
    totalActions: number;
    successRate: number;
    resourcesGathered: number; // e.g. 450,000
    monstersDefeated: number;
    ralliesJoined: number;
    staminaCurrent: number;
    staminaMax: number;
  };
}

export type SimulatorListener = (state: SimulatorState) => void;
export type LogListener = (log: BotLog) => void;
export type TapListener = (tap: EmulatorTapPoint) => void;
export type MarchListener = (marches: MarchSlot[]) => void;
export type EntityListener = (entities: DetectedEntity[]) => void;

class SimulatorEngine {
  private state: SimulatorState = {
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
  };

  private modules: TaskModule[] = [];
  private currentModuleIndex = 0;
  private loopTimer: any = null;
  private uptimeTimer: any = null;

  private stateListeners: Set<SimulatorListener> = new Set();
  private logListeners: Set<LogListener> = new Set();
  private tapListeners: Set<TapListener> = new Set();
  private marchListeners: Set<MarchListener> = new Set();
  private entityListeners: Set<EntityListener> = new Set();

  private marches: MarchSlot[] = [
    {
      id: 1,
      status: 'gathering',
      targetName: 'Seviye 6 Çelik Sahası',
      commander: 'Tyron & Phoenix',
      troops: 135000,
      progressPercent: 68,
      remainingSeconds: 420,
      coords: { x: 38, y: 44 }
    },
    {
      id: 2,
      status: 'marching',
      targetName: 'Cyber Gorilla (İttifak Rallisi)',
      commander: 'Inata & Nişancılar',
      troops: 1,
      progressPercent: 32,
      remainingSeconds: 85,
      coords: { x: 65, y: 72 }
    },
    {
      id: 3,
      status: 'idle',
      targetName: 'Karargahta Bekliyor',
      commander: 'Tyron (Savunma)',
      troops: 0,
      progressPercent: 0,
      remainingSeconds: 0,
      coords: { x: 50, y: 50 }
    },
    {
      id: 4,
      status: 'idle',
      targetName: 'Karargahta Bekliyor',
      commander: 'Bombacı Müfreze',
      troops: 0,
      progressPercent: 0,
      remainingSeconds: 0,
      coords: { x: 50, y: 50 }
    }
  ];

  public setModules(modules: TaskModule[]) {
    this.modules = modules;
  }

  public setSpeed(multiplier: number) {
    this.state.speedMultiplier = multiplier;
    this.notifyState();
  }

  public subscribeState(listener: SimulatorListener) {
    this.stateListeners.add(listener);
    listener(this.state);
    return () => this.stateListeners.delete(listener);
  }

  public subscribeLogs(listener: LogListener) {
    this.logListeners.add(listener);
    return () => this.logListeners.delete(listener);
  }

  public subscribeTaps(listener: TapListener) {
    this.tapListeners.add(listener);
    return () => this.tapListeners.delete(listener);
  }

  public subscribeMarches(listener: MarchListener) {
    this.marchListeners.add(listener);
    listener(this.marches);
    return () => this.marchListeners.delete(listener);
  }

  public subscribeEntities(listener: EntityListener) {
    this.entityListeners.add(listener);
    return () => this.entityListeners.delete(listener);
  }

  private notifyState() {
    this.stateListeners.forEach((l) => l({ ...this.state }));
  }

  private emitLog(level: BotLog['level'], msgTr: string, msgEn: string, moduleId?: string, details?: Record<string, any>) {
    const log: BotLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour12: false }),
      level,
      messageTr: msgTr,
      messageEn: msgEn,
      moduleId,
      details
    };
    this.logListeners.forEach((l) => l(log));
  }

  private emitTap(x: number, y: number, label: string, color?: string) {
    const tap: EmulatorTapPoint = {
      id: 'tap_' + Date.now(),
      x,
      y,
      label,
      timestamp: Date.now(),
      color
    };
    this.tapListeners.forEach((l) => l(tap));
  }

  public start() {
    if (this.state.isRunning && !this.state.isPaused) return;

    this.state.isRunning = true;
    this.state.isPaused = false;
    this.notifyState();

    this.emitLog('INFO', 'Gelişmiş Otomasyon Asistanı Başlatıldı...', 'Advanced Automation Assistant Started...');
    this.emitLog('INFO', 'ADB cihazı bağlandı (127.0.0.1:5554) - Çözünürlük: 1280x720', 'ADB device connected (127.0.0.1:5554) - Res: 1280x720');

    if (!this.uptimeTimer) {
      this.uptimeTimer = setInterval(() => {
        if (this.state.isRunning && !this.state.isPaused) {
          this.state.uptimeSeconds += 1;
          this.tickMarches();
          this.notifyState();
        }
      }, 1000);
    }

    this.scheduleNextStep();
  }

  public pause() {
    this.state.isPaused = true;
    if (this.loopTimer) clearTimeout(this.loopTimer);
    this.emitLog('WARNING', 'Otomasyon asistanı kullanıcı tarafından duraklatıldı.', 'Automation assistant paused by user.');
    this.notifyState();
  }

  public resume() {
    if (!this.state.isRunning) {
      this.start();
      return;
    }
    this.state.isPaused = false;
    this.emitLog('INFO', 'Otomasyon asistanı devam ettiriliyor...', 'Automation assistant resumed...');
    this.notifyState();
    this.scheduleNextStep();
  }

  public reset() {
    if (this.loopTimer) clearTimeout(this.loopTimer);
    if (this.uptimeTimer) clearInterval(this.uptimeTimer);
    this.loopTimer = null;
    this.uptimeTimer = null;

    this.state = {
      isRunning: false,
      isPaused: false,
      cycleCount: 0,
      currentModuleId: null,
      speedMultiplier: this.state.speedMultiplier,
      uptimeSeconds: 0,
      stats: {
        totalActions: 0,
        successRate: 100,
        resourcesGathered: 0,
        monstersDefeated: 0,
        ralliesJoined: 0,
        staminaCurrent: 100,
        staminaMax: 100
      }
    };
    this.currentModuleIndex = 0;
    this.emitLog('INFO', 'Tüm sayaçlar ve otomasyon döngüsü sıfırlandı.', 'All counters and automation loop reset.');
    this.notifyState();
  }

  public step() {
    this.runSingleStep();
  }

  private scheduleNextStep() {
    if (!this.state.isRunning || this.state.isPaused) return;

    const baseDelay = 1800; // ms
    const actualDelay = Math.max(300, baseDelay / this.state.speedMultiplier);

    this.loopTimer = setTimeout(() => {
      this.runSingleStep();
      this.scheduleNextStep();
    }, actualDelay);
  }

  private runSingleStep() {
    const activeMods = this.modules.filter((m) => m.enabled);
    if (activeMods.length === 0) {
      this.emitLog('WARNING', 'Aktif görev modülü bulunmuyor. AKTIF_GOREVLER listesini kontrol edin.', 'No active modules. Check AKTIF_GOREVLER list.');
      return;
    }

    if (this.currentModuleIndex >= activeMods.length) {
      this.currentModuleIndex = 0;
      this.state.cycleCount += 1;
      this.emitLog('INFO', `--- Döngü #${this.state.cycleCount} Tamamlandı. CPU dinleniyor (1s) ---`, `--- Cycle #${this.state.cycleCount} Completed. CPU resting (1s) ---`);
      this.notifyState();
      return;
    }

    const currentMod = activeMods[this.currentModuleIndex];
    this.state.currentModuleId = currentMod.id;
    this.notifyState();

    // Execute the module's step
    this.executeModuleAction(currentMod);
    this.currentModuleIndex++;
  }

  private executeModuleAction(mod: TaskModule) {
    this.state.stats.totalActions++;

    switch (mod.id) {
      case 'modules.gather': {
        this.emitLog('ACTION', '[modules.gather] Harita kaynak taraması (Odun, Yemek, Çelik, Benzin) başlatıldı...', '[modules.gather] Scanning map for resources (Wood, Food, Steel, Gas)...', mod.id);
        const tapX = 250 + Math.floor(Math.random() * 400);
        const tapY = 200 + Math.floor(Math.random() * 250);
        this.emitTap(tapX, tapY, 'Kaynak Tespit Edildi (Lv 6 Çelik)', '#10b981');

        setTimeout(() => {
          this.emitLog('SUCCESS', '[modules.gather] Kıta #3 Seviye 6 Çelik sahasına gönderildi (+68k/s).', '[modules.gather] March #3 dispatched to Lv 6 Steel node (+68k/h).', mod.id);
          this.state.stats.resourcesGathered += 45000;
          this.assignIdleMarch('Seviye 6 Çelik Sahası', 'gathering', 300);
          this.notifyState();
        }, 400);
        break;
      }

      case 'modules.monster': {
        if (this.state.stats.staminaCurrent < 20) {
          this.emitLog('WARNING', `[modules.monster] Yetersiz Enerji (${this.state.stats.staminaCurrent} AP). Goril avı pas geçildi (time.sleep 2).`, `[modules.monster] Low Stamina (${this.state.stats.staminaCurrent} AP). Skipped Gorilla hunt.`, mod.id);
        } else {
          this.state.stats.staminaCurrent -= 10;
          this.emitLog('ACTION', `[modules.monster] Seviye 25 Primal Gorilla tespit edildi. Tyron & Phoenix ile saldırı başlatıldı (-10 AP).`, `[modules.monster] Lv 25 Primal Gorilla spotted. Attacking with Tyron & Phoenix (-10 AP).`, mod.id);
          this.emitTap(640, 360, 'Saldır: Primal Gorilla Lv 25', '#ef4444');
          setTimeout(() => {
            this.state.stats.monstersDefeated += 1;
            this.emitLog('SUCCESS', '[modules.monster] Zafer! Primal Gorilla etkisiz hale getirildi. Ödül: İleri İkmal Kartı, Teçhizat Parçası, 50k XP.', '[modules.monster] Victory! Primal Gorilla defeated. Equipment & Supply Card granted.', mod.id);
            this.notifyState();
          }, 500);
        }
        break;
      }

      case 'modules.rally': {
        this.emitLog('ACTION', '[modules.rally] İttifak Savaşları (Goril Rallileri) taranıyor...', '[modules.rally] Scanning alliance rallies (Gorilla events)...', mod.id);
        this.emitTap(880, 520, 'İttifak Ralli Listesi', '#3b82f6');
        setTimeout(() => {
          this.emitTap(540, 290, 'Ralliye Katıl (1 Asker / Nişancı)', '#8b5cf6');
          this.state.stats.ralliesJoined += 1;
          this.emitLog('SUCCESS', '[modules.rally] Cyber Gorilla ralli ordusuna 1 asker / nişancı ile başarıyla katılınıldı!', '[modules.rally] Successfully joined Cyber Gorilla rally with 1 unit!', mod.id);
          this.assignIdleMarch('Cyber Gorilla (İttifak Rallisi)', 'fighting', 120);
          this.notifyState();
        }, 500);
        break;
      }

      case 'modules.heal': {
        this.emitLog('ACTION', '[modules.heal] Hapishane reviri (Infirmary) kontrol ediliyor...', '[modules.heal] Checking prison infirmary...', mod.id);
        this.emitTap(310, 480, 'Revir Tedavi (800 Asker)', '#06b6d4');
        setTimeout(() => {
          this.emitLog('SUCCESS', '[modules.heal] 800 yaralı gardiyan/asker tedavi edildi. İttifak yardımı istendi.', '[modules.heal] 800 wounded healed. Alliance help requested.', mod.id);
          this.notifyState();
        }, 400);
        break;
      }

      case 'modules.shield_check': {
        this.emitLog('INFO', '[modules.shield_check] Karargah barış kalkanı izleniyor: 8h kalkan aktif (Kalan süre: 05:42:18). Ada güvende.', '[modules.shield_check] Prison peace shield active (Remaining: 05:42:18). Safe.', mod.id);
        break;
      }

      case 'modules.train_troops': {
        this.emitLog('ACTION', '[modules.train_troops] Eğitim kampları taranıyor... T4 Nişancı (Shooters) eğitimi başlatıldı (+1,200).', '[modules.train_troops] Queued 1,200 T4 Shooters training.', mod.id);
        this.emitTap(420, 310, 'Nişancı Eğit', '#f59e0b');
        break;
      }

      case 'modules.daily_quests': {
        this.emitLog('SUCCESS', '[modules.daily_quests] Günlük İkmal Sandığı toplandı, mahkum mutluluğu korundu & İttifak teknolojisine 20x bağış yapıldı.', '[modules.daily_quests] Daily Supply claimed, prisoner happiness checked & 20x alliance tech donated.', mod.id);
        this.emitTap(180, 80, 'İkmal Sandığı Topla', '#eab308');
        break;
      }

      case 'modules.player_finder': {
        const randX = 400 + Math.floor(Math.random() * 300);
        const randY = 300 + Math.floor(Math.random() * 250);
        this.emitLog('ACTION', `[modules.player_finder] Harita koordinatları taranıyor (X: ${randX}, Y: ${randY}). OCR ile oyuncu aranıyor...`, `[modules.player_finder] Scanning map coords (X: ${randX}, Y: ${randY}). Running OCR for player...`, mod.id);
        this.emitTap(randX, randY, `Oyuncu Bulundu: [TURK] Fatih (X:${randX}, Y:${randY})`, '#f43f5e');
        setTimeout(() => {
          this.emitLog('SUCCESS', `[modules.player_finder] HEDEF BULUNDU! Oyuncu: [TURK] Fatih (Lv 25 Kale) - Koordinat (X: ${randX}, Y: ${randY}). Telegram'a anlık konum gönderildi.`, `[modules.player_finder] TARGET FOUND! [TURK] Fatih at (X: ${randX}, Y: ${randY}). Telegram notification sent.`, mod.id);
          this.notifyState();
        }, 500);
        break;
      }

      default: {
        this.emitLog('ACTION', `[${mod.id}] Özel modül yürütülüyor (calistir())...`, `[${mod.id}] Executing custom module...`, mod.id);
        setTimeout(() => {
          this.emitLog('SUCCESS', `[${mod.id}] Modül başarıyla tamamlandı (devam_et = True).`, `[${mod.id}] Module completed successfully.`, mod.id);
        }, 300);
      }
    }

    this.notifyState();
  }

  private assignIdleMarch(name: string, status: MarchSlot['status'], durationSec: number) {
    const idleSlot = this.marches.find((m) => m.status === 'idle');
    if (idleSlot) {
      idleSlot.status = status;
      idleSlot.targetName = name;
      idleSlot.remainingSeconds = durationSec;
      idleSlot.progressPercent = 5;
      idleSlot.troops = status === 'fighting' ? 1 : 120000;
      this.marchListeners.forEach((l) => l([...this.marches]));
    }
  }

  private tickMarches() {
    let changed = false;
    this.marches.forEach((m) => {
      if (m.status !== 'idle' && m.remainingSeconds > 0) {
        m.remainingSeconds -= 1;
        m.progressPercent = Math.min(100, m.progressPercent + 1);
        if (m.remainingSeconds <= 0) {
          m.status = 'idle';
          m.targetName = 'Kalede Bekliyor';
          m.troops = 0;
          m.progressPercent = 0;
          changed = true;
        }
      }
    });
    if (changed) {
      this.marchListeners.forEach((l) => l([...this.marches]));
    }
  }
}

export const simulatorEngine = new SimulatorEngine();
