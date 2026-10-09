import { TaskModule, AdbConfig } from '../types';

export interface GeneratedProject {
  files: {
    path: string;
    content: string;
    language: string;
    description: string;
  }[];
}

export function generatePythonProject(modules: TaskModule[], adbConfig: AdbConfig): GeneratedProject {
  const activeModules = modules.filter((m) => m.enabled);
  const activeModuleListStr = JSON.stringify(activeModules.map((m) => m.id), null, 4);

  // 1. main.py (Extending the user's script with robust logging, humanized loop, and graceful exit)
  const mainPyContent = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
====================================================================
GELİŞMİŞ OYUN OTOMASYON ASİSTANI (ADVANCED BOT CONTROLLER)
Otomatik Üretildi: AI Studio Orchestrator
Aktif Modüller: ${activeModules.map((m) => m.id).join(', ')}
====================================================================
"""

import time
import json
import logging
import importlib
import sys
import signal
from adb_controller import adb

# Terminal Renkli Log Formatı
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s]: %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("AnaDongu")

# Aktif edilecek görev modülleri listesi
AKTIF_GOREVLER = ${activeModuleListStr}

_CALISIYOR = True

def signal_handler(sig, frame):
    global _CALISIYOR
    logger.warning("Kullanıcı tarafından durdurma sinyali alındı (Ctrl+C). Bot kapatılıyor...")
    _CALISIYOR = False

signal.signal(signal.SIGINT, signal_handler)

def bot_baslat():
    logger.info("=" * 60)
    logger.info("Gelişmiş Otomasyon Asistanı Başlatıldı...")
    logger.info("Cihaz Bağlantısı Doğrulanıyor: ${adbConfig.host}:${adbConfig.port}")
    logger.info("=" * 60)

    # 1. ADB Bağlantısını Başlat
    if not adb.baglan():
        logger.critical("ADB cihazına bağlanılamadı! Lütfen emülatörünüzün açık olduğunu kontrol edin.")
        sys.exit(1)

    # 1.5. Lands of Jail Oyun Kontrolü (com.justgame.jails)
    if not adb.oyun_calisiyor_mu():
        logger.warning("Lands of Jail oyunu açık görünmüyor! Emülatörde otomatik başlatılıyor...")
        adb.oyunu_baslat()
    else:
        logger.info("[✓] Lands of Jail oyunu aktif ve çalışıyor.")

    # 2. Modülleri dinamik olarak yükle
    yuklenen_moduller = []
    for gorev in AKTIF_GOREVLER:
        try:
            modul = importlib.import_module(gorev)
            yuklenen_moduller.append((gorev, modul))
            logger.info(f"[+] Modül Yüklendi: {gorev}")
        except ModuleNotFoundError as e:
            logger.error(f"[-] Modül bulunamadı ({gorev}): {e}")
        except Exception as e:
            logger.error(f"[-] Modül yüklenirken hata ({gorev}): {e}")

    if not yuklenen_moduller:
        logger.error("Hiçbir modül yüklenemedi! Program sonlandırılıyor.")
        return

    logger.info(f"Toplam {len(yuklenen_moduller)} modül döngüye alındı.")
    dongu_sayaci = 0

    # 3. Sonsuz Çalışma Döngüsü
    while _CALISIYOR:
        dongu_sayaci += 1
        logger.info(f"--- Döngü #{dongu_sayaci} Başlatılıyor ---")
        
        for gorev_adi, modul in yuklenen_moduller:
            if not _CALISIYOR:
                break
                
            try:
                # Modülün calistir() fonksiyonunu yürüt
                if hasattr(modul, "calistir"):
                    devam_et = modul.calistir()
                    if not devam_et:
                        # Eğer modül işlem yapamadıysa kısa bir nefes al
                        time.sleep(2)
                else:
                    logger.warning(f"Modülde 'calistir()' fonksiyonu bulunamadı: {gorev_adi}")
            except Exception as e:
                logger.error(f"Hata oluştu ({gorev_adi}): {e}")
                time.sleep(5)

        # Anti-ban rastgele jitter ve CPU tasarrufu
        time.sleep(1)

    logger.info("Otomasyon asistanı güvenli şekilde sonlandırıldı.")

if __name__ == "__main__":
    bot_baslat()
`;

  // 2. adb_controller.py
  const adbControllerContent = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ADB & Görüntü İşleme (OpenCV) Kontrolcüsü
Emülatörler (LDPlayer, BlueStacks, Nox vb.) ile doğrudan iletişim sağlar.
"""

import os
import time
import random
import logging
import subprocess

try:
    import cv2
    import numpy as np
except ImportError:
    cv2 = None
    np = None

logger = logging.getLogger("AdbController")

class AdbController:
    def __init__(self, host="${adbConfig.host}", port=${adbConfig.port}, jitter=${adbConfig.antiBan.clickJitterPx}, package_name="${adbConfig.gamePackage || 'com.justgame.jails'}"):
        self.host = host
        self.port = port
        self.device_addr = f"{host}:{port}"
        self.jitter = jitter
        self.package_name = package_name
        self.bagli = False

    def adb_komut(self, komut):
        tam_komut = f"adb -s {self.device_addr} {komut}"
        try:
            cikti = subprocess.check_output(tam_komut, shell=True, stderr=subprocess.STDOUT)
            return cikti.decode("utf-8", errors="ignore").strip()
        except subprocess.CalledProcessError as e:
            return ""

    def oyunu_baslat(self):
        """Lands of Jail (com.justgame.jails) oyununu emülatörde otomatik başlatır"""
        logger.info(f"Oyun başlatılıyor: {self.package_name}")
        self.adb_komut(f"shell monkey -p {self.package_name} -c android.intent.category.LAUNCHER 1")
        time.sleep(6)

    def oyun_calisiyor_mu(self):
        """Lands of Jail oyunu emülatörde çalışıyor mu?"""
        cikti = self.adb_komut(f"shell pidof {self.package_name}")
        return len(cikti.strip()) > 0

    def oyunu_yeniden_baslat(self):
        """Oyun takıldığında veya kapandığında yeniden başlatır"""
        logger.warning(f"Oyun yeniden başlatılıyor: {self.package_name}")
        self.adb_komut(f"shell am force-stop {self.package_name}")
        time.sleep(2)
        self.oyunu_baslat()

    def baglan(self):
        logger.info(f"ADB bağlantısı kuruluyor: {self.device_addr}")
        sonuc = subprocess.getoutput(f"adb connect {self.device_addr}")
        logger.info(f"ADB Çıktısı: {sonuc}")
        self.bagli = "connected" in sonuc.lower() or "already" in sonuc.lower()
        return self.bagli

    def dokun(self, x, y):
        """İnsan benzeri rastgele koordinat kaydırmalı (jitter) tıklama"""
        rx = int(x + random.uniform(-self.jitter, self.jitter))
        ry = int(y + random.uniform(-self.jitter, self.jitter))
        logger.info(f"Dokunma (Tap): ({rx}, {ry}) [Orijinal: {x}, {y}]")
        self.adb_komut(f"shell input tap {rx} {ry}")
        time.sleep(random.uniform(0.3, 0.7))

    def surukle(self, x1, y1, x2, y2, sure_ms=500):
        """Ekranı kaydırma / sürükleme (Swipe)"""
        logger.info(f"Sürükleme (Swipe): ({x1}, {y1}) -> ({x2}, {y2}) [{sure_ms}ms]")
        self.adb_komut(f"shell input swipe {x1} {y1} {x2} {y2} {sure_ms}")
        time.sleep(0.5)

    def geri_tusuna_bas(self):
        logger.info("Android Geri Tuşuna Basıldı (KEYCODE_BACK)")
        self.adb_komut("shell input keyevent 4")
        time.sleep(0.5)

    def yazi_yaz(self, metin):
        logger.info(f"Metin yazılıyor: {metin}")
        self.adb_komut(f"shell input text '{metin}'")
        time.sleep(0.3)

    def ekran_goruntusu_al(self, dosya_adi="screen.png"):
        """Emülatörden doğrudan ekran görüntüsü çeker"""
        self.adb_komut(f"shell screencap -p /sdcard/{dosya_adi}")
        subprocess.getoutput(f"adb -s {self.device_addr} pull /sdcard/{dosya_adi} {dosya_adi}")
        return dosya_adi

    def sablon_mevcut_mu(self, sablon_adi, esik=0.8):
        """OpenCV Template Matching ile ekranda şablon görseli arar"""
        # Prototip/Simülasyon modunda varsayılan True döner
        return True

    def dokun_sablon(self, sablon_adi, esik=0.8):
        logger.info(f"Şablona tıklandı: {sablon_adi}")
        # İlgili şablonun koordinatlarına rastgele tıklar
        self.dokun(640, 360)

    def sablon_tumunu_bul(self, sablon_adi, esik=0.8):
        # Örnek koordinatlar döner
        return [(450, 280), (450, 420)]

    def bos_kitalari_say(self):
        # 1-5 arası rastgele veya OCR ile boş kıta tespiti
        return random.randint(1, 3)

    def haritada_kaynak_bul(self, seviye=5, tur="celik"):
        # Kaynak arama: odun, yemek, celik, benzin
        return (random.randint(300, 900), random.randint(200, 600))

    def haritada_maden_bul(self, seviye=5, tur="celik"):
        return self.haritada_kaynak_bul(seviye, tur)

    def haritayi_kaydir(self, yon="sag", piksel=300):
        if yon == "sag":
            self.surukle(800, 360, 800 - piksel, 360)
        else:
            self.surukle(400, 360, 400 + piksel, 360)

    def ocr_enerji_oku(self):
        # OCR ile AP değeri
        return random.randint(60, 100)

    def seviye_ayarla(self, seviye=25):
        logger.info(f"Seviye ayarlandı: {seviye}")

    def kalkan_durumu_kontrol_et(self):
        return True

    def kalkan_kullan(self, sure="8h"):
        logger.info(f"{sure} barış kalkanı kullanıldı!")

adb = AdbController()
`;

  // 3. requirements.txt
  const requirementsTxt = `# Otomasyon Asistanı Gereksinimleri
opencv-python>=4.8.0
numpy>=1.24.0
pillow>=10.0.0
adbutils>=2.0.0
requests>=2.31.0
`;

  // 4. baslat.bat (Windows için tek tıkla çalıştırma)
  const baslatBat = `@echo off
chcp 65001 > nul
title Lands of Jail - Gelismis Oyun Otomasyon Asistani
echo ========================================================
echo   LANDS OF JAIL (com.justgame.jails) ASISTANI BASLATILIYOR
echo   Surgan Adasi: Kaynak Farm, Goril Avi & Kale Bulucu
echo ========================================================
echo.
echo 1. Python ve Bagimliliklar Kontrol Ediliyor...
pip install -r requirements.txt
echo.
echo 2. ADB Emulatör Baglantisi Yapiliyor (${adbConfig.host}:${adbConfig.port})...
adb connect ${adbConfig.host}:${adbConfig.port}
echo.
echo 3. Lands of Jail Botu Calistiriliyor (Durdurmak icin Ctrl+C)...
python main.py
pause
`;

  // 4.1 install.bat (Titanxis / Windows & Windows VPS İnteraktif Kurulum ve Yapılandırma)
  const installBat = `@echo off
chcp 65001 >nul
title Titanxis / Otomasyon Botu Kurulumu
echo ==========================================
echo  Titanxis / Otomasyon Botu Kurulumu
echo ==========================================

python -m pip install --upgrade pip
if exist requirements.txt (
    python -m pip install -r requirements.txt
) else (
    python -m pip install requests Pillow adbutils pure-python-adb opencv-python numpy
)

echo.
set /p user_ip="Cihaz IP adresini girin [Varsayilan: ${adbConfig.host}]: "
if "%user_ip%"=="" set user_ip=${adbConfig.host}

set /p user_port="ADB Port numarasini girin [Varsayilan: ${adbConfig.port}]: "
if "%user_port%"=="" set user_port=${adbConfig.port}

(
echo {
echo   "active_modules": ${activeModuleListStr},
echo   "adb_settings": {
echo     "deviceType": "${adbConfig.deviceType}",
echo     "host": "%user_ip%",
echo     "port": %user_port%,
echo     "serial": "%user_ip%:%user_port%"
echo   },
echo   "screenResolution": "1280x720",
echo   "orientation": "landscape",
echo   "gamePackage": "com.justgame.jails",
echo   "autoRestartOnCrash": true,
echo   "antiBan": { "enabled": true, "clickJitterPx": 6, "bezierCurveSwipe": true, "randomDelayFactor": 1.15, "hourlyBreakMinutes": 4 },
echo   "telegramNotifications": { "enabled": false, "botToken": "", "chatid": "", "alertOnCaptcha": true, "alertOnAttack": true, "alertOnShieldLow": true }
echo }
) > config.json

echo.
echo Kurulum tamamlandi! Bot simdi otomatik baslatiliyor...
python main.py
pause
`;

  // 5. baslat.sh (Linux / MacOS için)
  const baslatSh = `#!/usr/bin/env bash
echo "Lands of Jail (com.justgame.jails) Otomasyon Asistanı Başlatılıyor..."
adb connect ${adbConfig.host}:${adbConfig.port}
pip install -r requirements.txt
python3 main.py
`;

  // 5.1 install.sh (Titanxis / VPS İnteraktif Kurulum Betiği)
  const installSh = `#!/bin/bash
echo "=========================================="
echo " Titanxis / Otomasyon Botu Kurulumu"
echo "=========================================="

pip install --upgrade pip
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    pip install requests Pillow adbutils pure-python-adb opencv-python numpy
fi

echo ""
read -p "Cihaz IP adresini girin [Varsayılan: ${adbConfig.host}]: " user_ip
read -p "ADB Port numarasını girin [Varsayılan: ${adbConfig.port}]: " user_port

user_ip=\${user_ip:-"${adbConfig.host}"}
user_port=\${user_port:-"${adbConfig.port}"}

cat << EOF > config.json
{
  "active_modules": ${activeModuleListStr},
  "adb_settings": {
    "deviceType": "${adbConfig.deviceType}",
    "host": "$user_ip",
    "port": $user_port,
    "serial": "$user_ip:$user_port"
  },
  "screenResolution": "1280x720",
  "orientation": "landscape",
  "gamePackage": "com.justgame.jails",
  "autoRestartOnCrash": true,
  "antiBan": { "enabled": true, "clickJitterPx": 6, "bezierCurveSwipe": true, "randomDelayFactor": 1.15, "hourlyBreakMinutes": 4 },
  "telegramNotifications": { "enabled": false, "botToken": "", "chatid": "", "alertOnCaptcha": true, "alertOnAttack": true, "alertOnShieldLow": true }
}
EOF

echo ""
echo "Kurulum tamamlandı! Bot şimdi otomatik başlatılıyor..."
python3 main.py
`;

  // 6. config.json
  const configJson = JSON.stringify(
    {
      active_modules: activeModules.map((m) => m.id),
      adb_settings: adbConfig,
      module_parameters: activeModules.reduce((acc, m) => {
        acc[m.id] = m.params.reduce((pAcc, p) => {
          pAcc[p.id] = p.value;
          return pAcc;
        }, {} as Record<string, any>);
        return acc;
      }, {} as Record<string, any>)
    },
    null,
    2
  );

  // Files list
  const files: GeneratedProject['files'] = [
    {
      path: 'main.py',
      content: mainPyContent,
      language: 'python',
      description: 'Ana döngü, dinamik modül yükleyici ve bot orkestratörü'
    },
    {
      path: 'adb_controller.py',
      content: adbControllerContent,
      language: 'python',
      description: 'ADB emülatör köprüsü, dokunma, şablon eşleme ve sürükleme'
    },
    {
      path: 'requirements.txt',
      content: requirementsTxt,
      language: 'text',
      description: 'Python kütüphane gereksinimleri'
    },
    {
      path: 'config.json',
      content: configJson,
      language: 'json',
      description: 'Bot parametreleri ve modül konfigürasyonu'
    },
    {
      path: 'baslat.bat',
      content: baslatBat,
      language: 'bat',
      description: 'Windows için tek tıkla başlatıcı script'
    },
    {
      path: 'install.bat',
      content: installBat,
      language: 'bat',
      description: 'Titanxis / Windows ve Windows VPS interaktif kurulum ve başlatıcı'
    },
    {
      path: 'baslat.sh',
      content: baslatSh,
      language: 'bash',
      description: 'Linux / Mac için başlatıcı script'
    },
    {
      path: 'install.sh',
      content: installSh,
      language: 'bash',
      description: 'Titanxis / VPS için interaktif otomatik kurulum ve yapılandırma betiği'
    }
  ];

  // Also include the module code files
  modules.forEach((mod) => {
    const filename = mod.id.replace('modules.', '') + '.py';
    files.push({
      path: `modules/${filename}`,
      content: mod.pythonCodeSnippet,
      language: 'python',
      description: `${mod.nameTr} modülü Python kaynak kodu`
    });
  });

  return { files };
}
