# 6 Blocks v0.04.5
Living Home v1.02 + PWA. Copiare tutto nella root del repository, mantenendo .git. Commit e Push tramite GitHub Desktop.
Home: video originale integrale, poster statico, impostazione persistente, pausa in partita/background. Funzioni future mostrano Prossimamente. Testi separati dal video, italiano attuale. Motore, renderer e livelli invariati rispetto alla 0.04.4. Successo preliminare con avanzamento automatico conservato.
Offline: primo caricamento online completo necessario; service worker precache delle risorse operative, gestione Range MP4. Nuova cache attivata dopo chiusura delle schede della vecchia versione. Riaprire l'app per applicare un aggiornamento; nessun reload automatico. Se il browser elimina i dati offline, è necessario ricaricare online.
Test motore: node tests/verify.js. Collaudo iPhone/Android reale richiesto.


## v0.04.6
Living Game Header statico provvisorio: immagine fornita, rifilata solo nei margini blu verticali e ottimizzata WebP. Header responsive; Home, motore e livelli invariati. Cache aggiornata. Video header definitivo non incluso.

## v0.04.6.1
Sfondo gameplay uniforme #011E64; Home, header, motore e livelli invariati. Cache aggiornata.

## v0.04.7 — Living Game Header animato
Video originale H.264 720×178, 24 fps, senza audio. Poster originale invariato; il video è sovrapposto senza alterare la geometria del layout. Preferenza indipendente `6blocks.game.motion` (attiva di default), con priorità a `prefers-reduced-motion`. Sospensione fuori dalla schermata di gioco e in background; nessun riavvio ai cambi livello. Cache v0.04.7 con video e modulo dedicato. Il motore, i livelli e la grafica Home sono conservati. Test su dispositivi reali necessari, in particolare loop e riproduzione offline iOS.
