# 6 Blocks v0.04.4
Base stabile v0.04.3. Home, identità Moderno Glossy v1.00, logo e testimonial ufficiali, tabellone 8×10 e avanzamento automatico dopo 1500 ms. Ultimo livello: pulsante per ricominciare dal primo. Home conserva la partita solo in memoria durante la sessione. Le pose celebrative definitive non sono disponibili: si usano temporaneamente i due ritagli ufficiali animati in CSS. Manifest e service worker rimandati alla v0.04.6 come concordato. La cartella reference non è caricata dall'app.

Installazione: copiare il contenuto dello ZIP nella root del repository locale, senza eliminare .git o altri asset; commit e push. Aprire tramite GitHub Pages, non file://.

Test: npm test (10 livelli risolti), node --check sui moduli. Motore, loader e JSON identici alla v0.04.3. Test browser locale tentato ma bloccato dalla policy dell'ambiente; collaudo UI e touch su dispositivi reali necessario.
