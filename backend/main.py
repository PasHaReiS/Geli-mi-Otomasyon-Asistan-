from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
import threading

app = FastAPI(title="Gelişmiş Otomasyon Asistanı API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bot_durumu = {"aktif": False, "aktif_gorevler": ["gather", "monster"]}

def bot_calisma_dongusu():
    while bot_durumu["aktif"]:
        print("Bot döngüsü aktif... Görevler taranıyor (ADB / OpenCV).")
        # Buraya ADB ekran görüntüsü ve OpenCV tarama döngüsü eklenecek
        time.sleep(3)

@app.get("/")
def durum_getir():
    return {"status": "success", "bot_durumu": bot_durumu}

@app.post("/bot/baslat")
def botu_baslat():
    if not bot_durumu["aktif"]:
        bot_durumu["aktif"] = True
        t = threading.Thread(target=bot_calisma_dongusu)
        t.daemon = True
        t.start()
        return {"message": "Bot başarıyla başlatıldı."}
    return {"message": "Bot zaten çalışıyor."}

@app.post("/bot/durdur")
def botu_durdur():
    bot_durumu["aktif"] = False
    return {"message": "Bot durduruldu."}
