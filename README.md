# STP Data Digitizer - Netlify Demo

**Statyczna wersja demonstracyjna** narzędzia do digitalizacji historycznych danych testów sprawnościowych.

---

## 🌐 Deploy na Netlify

### Automatyczny deploy (zalecane):

1. **Wejdź na Netlify:** https://app.netlify.com
2. **Kliknij:** "Add new site" → "Import an existing project"
3. **Wybierz:** GitHub
4. **Znajdź repo:** `skaner_bada-_motoryka`
5. **Branch:** `netlify-demo` (lub main)
6. **Build settings:**
   - Build command: (zostaw puste)
   - Publish directory: `.` (kropka)
7. **Deploy!**

### Ręczny deploy (drag & drop):

1. **Wejdź na Netlify:** https://app.netlify.com
2. **"Sites"** → **"Add new site"** → **"Deploy manually"**
3. **Przeciągnij cały folder** `prototyp-STP-digitizer-netlify` do okna przeglądarki
4. **Gotowe!** Otrzymasz URL typu `https://random-name.netlify.app`

---

## ✨ Co działa:

✅ **OCR** - Tesseract.js (PDF/JPG)  
✅ **Import** - XLS/CSV (SheetJS + Papa Parse)  
✅ **Edycja** - Tabela z walidacją  
✅ **Eksport** - CSV i Excel  
✅ **Design** - Google Material  

---

## 📁 Struktura (statyczna - bez Node.js):

```
.
├── index.html              # Główna strona
├── styles.css              # Google Material Design
├── app.js                  # Logika główna
├── ocr-engine.js           # Tesseract.js
├── file-parser.js          # XLS/CSV parser
├── data-validator.js       # Walidacja
├── data-store.js           # SessionStorage
├── export-manager.js       # CSV/Excel export
├── netlify.toml            # Konfiguracja Netlify
└── README.md

```

**Wszystkie biblioteki ładowane z CDN** - nie ma node_modules!

---

## 🔧 Biblioteki (CDN):

- Tesseract.js 2.1.5 (OCR)
- pdf.js 3.0.279 (PDF rendering)
- Papa Parse 5.3.2 (CSV)
- SheetJS 0.18.5 (Excel)
- Google Fonts (Roboto)
- Material Icons

---

## 📞 Wsparcie

**Sportpredictor Sp. z o.o.**  
Projekt: POIR.01.03.01-00-0083  
© 2022

---

**STP Data Digitizer - Netlify Demo v1.0**  
28.12.2022
