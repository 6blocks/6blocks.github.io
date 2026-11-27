const CACHE="6blocks-v0.04.9.1";
const FILES=[
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css?v=0.04.9.1",
  "./css/home.css?v=0.04.9.1",
  "./js/app.js?v=0.04.9.1",
  "./js/home.js?v=0.04.9.1",
  "./js/update.js?v=0.04.9.1",
  "./js/game-header.js?v=0.04.9.1",
  "./js/renderer.js",
  "./js/levels.js",
  "./js/config.js",
  "./js/engine.js",
  "./js/storage.js",
  "./js/schema-selector.js",
  "./js/level-manager.js",
  "./levels/levels.json",
  "./levels/intrecci.json",
  "./js/intrecci.js",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/testimonials/testimonial-woman.png",
  "./assets/testimonials/testimonial-man.png",
  "./assets/videos/home-loop.mp4",
  "./assets/videos/home-poster.jpg",
  "./assets/videos/game-header-poster.webp",
  "./assets/videos/game-header-loop.mp4",
  "./assets/branding/logo.png",
  "./assets/branding/family-symbol.png",
  "./assets/backgrounds/background.webp",
  "./assets/backgrounds/splash.webp"
];
const root=new URL('./',self.location.href);
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(FILES.map(path=>new Request(new URL(path,root),{cache:'reload'})));})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('6blocks-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
async function videoRange(request,response){const range=request.headers.get('range');if(!range)return response;const bytes=await response.arrayBuffer(),size=bytes.byteLength;const m=/^bytes=(\d*)-(\d*)$/.exec(range);let start,end;if(m&&(m[1]||m[2])){if(!m[1]){start=Math.max(0,size-Number(m[2]));end=size-1}else{start=Number(m[1]);end=m[2]?Math.min(Number(m[2]),size-1):size-1}}if(!m||!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=size||start>end)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${size}`}});return new Response(bytes.slice(start,end+1),{status:206,headers:{'Content-Type':'video/mp4','Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':String(end-start+1),'Accept-Ranges':'bytes'}});}
self.addEventListener('fetch',event=>{const r=event.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==root.origin||!u.pathname.startsWith(root.pathname))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);if(r.mode==='navigate'){return await cache.match(new URL('index.html',root))||fetch(r)}const hit=await cache.match(r.url);if(hit){if(u.pathname.endsWith('.mp4'))return videoRange(r,hit);return hit}return fetch(r);})());});
