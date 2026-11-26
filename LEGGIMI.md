# 6 Blocks — Identità grafica v1.00
Consegna dalla chat 02 – Identità grafica alla chat 04 – Sviluppo.

## Installazione
Copiare le sottocartelle di `assets/` nella cartella `assets/` esistente del repository. Non eliminare altri file. Verificare i percorsi effettivi prima di aggiornare HTML, manifest e service worker. I percorsi sotto sono relativi alla root del repository; in CSS usare percorsi relativi alla posizione del foglio di stile.

| File | Uso |
|---|---|
| assets/branding/logo.png | Logo trasparente, Home e intestazione partita |
| assets/branding/family-symbol.png | Numero 6 e archetti estratti dall'icona originale di 6 Sudoku; base del marchio |
| assets/icons/icon-512.png | Icona manifest 512×512 |
| assets/icons/icon-192.png | Icona manifest 192×192 |
| assets/icons/apple-touch-icon.png | Icona Apple 180×180, link apple-touch-icon |
| assets/backgrounds/background.webp | Sfondo verticale 1080×1920, background-size: cover |
| assets/backgrounds/splash.webp | Illustrazione verticale di avvio, senza barra fittizia |
| assets/testimonials/testimonial-man.png | Personaggio maschile originale ritagliato, sopra tabellone e Home |
| assets/testimonials/testimonial-woman.png | Personaggio femminile originale ritagliato, sopra tabellone e Home |
| assets/reference/approved-concept.png | Tavola approvata; riferimento visivo, non interfaccia da usare come immagine |
| assets/reference/6sudoku-original.png | Icona sorgente del marchio |
| assets/reference/testimonial-man-sheet.png | Tavola ufficiale pose ed espressioni uomo |
| assets/reference/testimonial-woman-sheet.png | Tavola ufficiale pose ed espressioni donna |

## Integrazione grafica
- Tabellone 8 colonne × 10 righe, celle quadrate, larghezza massima compatibile con il dito. Non usare il mockup come tabellone.
- Cornice blu notte, bordo luminoso azzurro e arancio, sottile, senza sottrarre spazio utile. Celle incassate e contrasto moderato.
- Uscite: aperture effettive della cornice, posizione, ampiezza e colore governati dai dati del livello. Non fissare quattro aperture al centro. Evidenziare le direzioni con frecce verso l'esterno.
- Blocchi: forme ufficiali, superficie continua glossy, colori indipendenti dalle forme, angoli morbidi; non dividere un pezzo in tessere indipendenti. Nessuna modifica alle collisioni o ai trascinamenti.
- Home: logo, testimonial, pulsanti primari arancio e secondari blu. Non aggiungere funzioni non approvate (monete, vite, suggerimenti, ecc.).
- Gameplay: testimonial sopra griglia in formato compatto, ridimensionabili su schermi piccoli, mai sovrapposti alle celle. Mantenere safe area iOS.
- Successo: mostrare i testimonial che festeggiano brevemente, poi avanzare automaticamente al livello successivo senza click. Le pose celebrative trasparenti e le animazioni finali non sono ancora incluse; usare le tavole originali come riferimento per produrle.
- Aggiornare manifest, riferimenti HTML, elenco precache e versione della cache secondo il meccanismo esistente; test PC, iPhone, Android e offline. Non modificare la logica dei livelli né implementare multiplayer ora.

## Stato della consegna
Il concept è approvato. Le risorse separate sono una prima ricostruzione operativa da verificare visivamente: il marchio deriva dal raster originale (non da un vettoriale), lettering e blocchi sono ricostruiti, i testimonial sono ritagliati dalle tavole originali e possono presentare piccoli residui di sfondo o bordi da rifinire. Sfondo e splash sono nuove composizioni. Nessun test nell'app reale è stato eseguito. Le specifiche sopra e la tavola approvata prevalgono su eventuali differenze dei mockup. Non pubblicare prima dell'approvazione dell'integrazione.
