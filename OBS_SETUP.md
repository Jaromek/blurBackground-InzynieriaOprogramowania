# 🎥 Integracja z OBS Studio - Instrukcja

## 📋 Wymagania

### 1. Zainstaluj oprogramowanie
- **OBS Studio** - pobierz z [obsproject.com](https://obsproject.com/)
- **Python 3.8+** z zainstalowanymi pakietami

### 2. Zainstaluj pyvirtualcam
```bash
pip install pyvirtualcam
```

## 🚀 Jak to działa?

Aplikacja ma teraz **dwa tryby pracy**:

### Tryb 1: Przeglądarka (bez OBS)
- Otwórz aplikację w przeglądarce
- Kontroluj efekty (blur, kolor, obraz tła)
- Podgląd na żywo w przeglądarce

### Tryb 2: Przeglądarka + OBS (synchronizacja)
- Otwórz aplikację w przeglądarce
- Kliknij przycisk **OBS** (zielony przycisk z ikoną play)
- Efekty zmieniane w przeglądarce są **automatycznie stosowane w OBS**
- Kontroluj wszystko z jednego miejsca!

## 📝 Instrukcja krok po kroku

### Krok 1: Uruchom backend
```bash
cd backend
python server.py
```

### Krok 2: Uruchom frontend (React)
```bash
cd blr
npm start
```

### Krok 3: Otwórz aplikację w przeglądarce
- Adres: `http://localhost:3000`
- Zaakceptuj zgodę na użycie kamery
- Naciśnij **Play** aby uruchomić stream

### Krok 4: Uruchom wirtualną kamerę OBS
W interfejsie aplikacji:
1. Znajdź przycisk **OBS** (z prawej strony panelu kontrolnego)
2. Kliknij aby uruchomić wirtualną kamerę
3. Zobaczysz czerwony wskaźnik **"OBS LIVE"** w prawym górnym rogu

### Krok 5: Skonfiguruj OBS Studio
1. Otwórz **OBS Studio**
2. W sekcji **Sources** kliknij **"+"**
3. Wybierz **"Video Capture Device"**
4. Z listy urządzeń wybierz:
   - **"OBS Virtual Camera"** (Windows/Mac)
   - lub **"OBS-Camera"** (Linux)
5. Gotowe! Obraz z aplikacji pojawi się w OBS

## 🎨 Kontrola efektów

Wszystkie efekty kontrolowane z przeglądarki działają **automatycznie w OBS**:

| Przycisk | Efekt |
|----------|-------|
| 👤 Blur | Rozmycie tła |
| 🎨 Color | Kolor tła (wybierasz z palety) |
| 🖼️ Upload | Własny obraz jako tło |
| ⚙️ Reset | Powrót do oryginalnego obrazu |
| ⏯️ OBS | Start/Stop wirtualnej kamery OBS |

## 🔧 Konfiguracja kamery

### Zmiana domyślnej kamery
Jeśli chcesz użyć innej kamery niż domyślna:

1. Otwórz `backend/server.py`
2. Znajdź linię:
   ```python
   camera_index = 1  # Numer kamery
   ```
3. Zmień na:
   - `0` = domyślna kamera (wbudowana)
   - `1` = druga kamera (np. zewnętrzna USB)
   - `2` = trzecia kamera, itd.

Lub zmień przez API (w React):
```javascript
await fetch(`${SERVER_URL}/obs/start`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ camera_index: 2 }) // Użyj kamery #2
});
```

## 🐛 Rozwiązywanie problemów

### Problem: "OBS not available"
**Rozwiązanie:**
```bash
pip install pyvirtualcam
```

### Problem: "Nie można otworzyć kamery"
**Rozwiązanie:**
- Zamknij inne aplikacje używające kamery (Zoom, Teams, Skype)
- Sprawdź numer kamery w ustawieniach
- Uruchom `python virtualCamera.py` aby zobaczyć dostępne kamery

### Problem: "Nie widzę obrazu w OBS"
**Rozwiązanie:**
1. Upewnij się że wirtualna kamera jest uruchomiona (czerwony wskaźnik "OBS LIVE")
2. W OBS wybierz właściwe urządzenie wideo
3. Sprawdź czy backend działa (`http://localhost:5000/status`)

### Problem: "Efekty nie działają w OBS"
**Rozwiązanie:**
- Efekty są synchronizowane automatycznie
- Upewnij się że wirtualna kamera jest uruchomiona PRZED zastosowaniem efektu
- Restart wirtualnej kamery: Stop OBS → zmień efekt → Start OBS

## 📡 API Endpoints

Backend udostępnia następujące endpointy dla OBS:

```
POST /obs/start          - Uruchom wirtualną kamerę
POST /obs/stop           - Zatrzymaj wirtualną kamerę  
GET  /obs/status         - Status wirtualnej kamery
```

Przykład odpowiedzi `/obs/status`:
```json
{
  "available": true,
  "running": true,
  "camera_index": 1
}
```

## 💡 Wskazówki

1. **Wydajność**: Jeśli aplikacja działa wolno, zmniejsz rozdzielczość w `server.py` (TARGET_WIDTH)
2. **Jakość**: Zwiększ `JPEG_QUALITY` w `server.py` dla lepszej jakości (kosztem wydajności)
3. **Stream**: Możesz streamować do OBS i oglądać w przeglądarce **jednocześnie**
4. **Kontrola**: Wszystkie zmiany w przeglądarce są natychmiastowo widoczne w OBS

## 🎬 Gotowe do użycia!

Teraz możesz:
- ✅ Kontrolować efekty z przeglądarki
- ✅ Streamować do OBS z efektami
- ✅ Zmieniać tło w czasie rzeczywistym
- ✅ Używać w Zoom, Teams, Discord (przez OBS Virtual Camera)

Miłego streamowania! 🚀
