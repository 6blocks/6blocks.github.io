# 6 Blocks v0.04.3
Pubblicare index.html, css/, js/, levels/ e assets/ nella root di GitHub Pages. Non aprire index.html con file://: i moduli e il JSON richiedono HTTP(S). Per test locale: python -m http.server 8000.

Dimensionamento grafico: css/style.css, variabile --block-scale: 0.90. La griglia e l'area di presa non cambiano. Il tabellone usa la larghezza disponibile fino a 600 px su desktop; su schermi bassi la pagina può scorrere.

Schemi: levels/levels.json conserva il formato originale Level Design v0.04, coordinate 1-based; js/levels.js converte in coordinate 0-based e valida le geometrie. Il motore ammette uscite sufficientemente larghe e rimuove immediatamente il blocco al passaggio del bordo. Le sequenze JSON contengono passi, non mosse minime.

Test senza dipendenze: node tests/verify.js. Tutti i dieci livelli superati. Sintassi moduli verificata con node --check. Test browser locale bloccato dall'ambiente (ERR_BLOCKED_BY_ADMINISTRATOR); collaudo reale PC/iPhone/Android necessario. Correzione touch proposta: pointerup touch/pen e click standard con controllo dello stato; non ancora verificata su Safari.

Assets: directory predisposte con .gitkeep, nessun testimonial o immagine aggiuntiva. Blocchi SVG/CSS generati dinamicamente. Nessuna PWA, rotazione, chiavi o multiplayer introdotti.
