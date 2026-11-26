// Installazione in background; una nuova versione si attiva quando le vecchie schede sono chiuse.
if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).catch(error=>console.warn('Offline non disponibile',error));});}
