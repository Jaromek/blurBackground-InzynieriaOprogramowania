# 🎥 SZYBKI START - Integracja z OBS w 3 kroki

## Krok 1️⃣: Instalacja pyvirtualcam
```bash
pip install pyvirtualcam
```

## Krok 2️⃣: Uruchom aplikację
```powershell
.\start_with_obs.ps1
```
Lub ręcznie:
```bash
# Terminal 1 - Backend
cd backend
py -3.11 server.py

# Terminal 2 - Frontend  
cd blr
npm start
```

## Krok 3️⃣: Używanie

### W przeglądarce (`http://localhost:3000`):
1. ✅ Zaakceptuj zgodę na kamerę
2. ▶️ Kliknij **Play**
3. 🔴 Kliknij przycisk **OBS** (zielony) aby uruchomić wirtualną kamerę
4. 🎨 Zmieniaj efekty - będą widoczne od razu w OBS!

### W OBS Studio:
1. 🎬 Otwórz **OBS Studio**
2. ➕ Sources → **Video Capture Device**
3. 📹 Wybierz **"OBS Virtual Camera"** z listy
4. ✅ Gotowe!

---

## 🎮 Kontrolki

| Przycisk | Co robi |
|----------|---------|
| ⏯️ | Włącz/wyłącz podgląd |
| 👤 | **Rozmyj tło** |
| 🎨 | **Zmień kolor tła** |
| 🖼️ | **Upload własnego obrazu jako tło** |
| ⚙️ | Reset (bez efektów) |
| 🔴 | **Start/Stop OBS Virtual Camera** |

---

## 🐛 Problemy?

### "OBS not available"
```bash
pip install pyvirtualcam
```

### "Nie można otworzyć kamery"
- Zamknij Zoom/Teams/Skype
- Zmień `camera_index` w `backend/server.py`

### "Nie widzę wirtualnej kamery w OBS"
1. Upewnij się że backend działa
2. Kliknij zielony przycisk OBS w aplikacji
3. Poczekaj na wskaźnik **"OBS LIVE"** (czerwony, prawy górny róg)

---

## 📚 Więcej informacji

📖 [README.md](README.md) - Pełna dokumentacja  
📖 [OBS_SETUP.md](OBS_SETUP.md) - Szczegółowa instrukcja OBS

---

**Gotowe! Teraz kontrolujesz OBS z przeglądarki! 🚀**
