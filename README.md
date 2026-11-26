# 6 Blocks v0.04.5
Living Home v1.02 + PWA. Copiare tutto nella root del repository, mantenendo .git. Commit e Push tramite GitHub Desktop.
Home: video originale integrale, poster statico, impostazione persistente, pausa in partita/background. Funzioni future mostrano Prossimamente. Testi separati dal video, italiano attuale. Motore, renderer e livelli invariati rispetto alla 0.04.4. Successo preliminare con avanzamento automatico conservato.
Offline: primo caricamento online completo necessario; service worker precache delle risorse operative, gestione Range MP4. Nuova cache attivata dopo chiusura delle schede della vecchia versione. Riaprire l'app per applicare un aggiornamento; nessun reload automatico. Se il browser elimina i dati offline, è necessario ricaricare online.
Test motore: node tests/verify.js. Collaudo iPhone/Android reale richiesto.
