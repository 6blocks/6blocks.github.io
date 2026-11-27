// Independent gameplay header; no interaction with the board renderer.
const game=document.querySelector('#game');
const header=game.querySelector('.living-game-header');
const video=document.querySelector('#game-header-video');
const checkbox=document.querySelector('#game-motion');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const key='6blocks.game.motion';
let enabled=true, suspended=false, requested=false, generation=0, failed=false;
try { enabled=localStorage.getItem(key)!=='off'; } catch {}
checkbox.checked=enabled;
video.muted=true;
function allowed(){return enabled&&!reduced.matches&&!game.hidden&&!document.hidden&&!suspended&&!failed;}
function show(){header.classList.toggle('video-playing',allowed()&&!video.paused&&video.readyState>=2);}
function sync(){
  if(!allowed()) {generation++;requested=false;video.pause();header.classList.remove('video-playing');return;}
  if(requested||!video.paused){show();return;}
  const id=++generation;requested=true;
  video.play().then(()=>{if(id===generation){requested=false;show();}}).catch(()=>{if(id===generation){requested=false;header.classList.remove('video-playing');}});
}
checkbox.addEventListener('change',()=>{enabled=checkbox.checked;try{localStorage.setItem(key,enabled?'on':'off');}catch{}sync();});
new MutationObserver(sync).observe(game,{attributes:true,attributeFilter:['hidden']});
document.addEventListener('visibilitychange',sync);
window.addEventListener('pagehide',()=>{suspended=true;sync();});
window.addEventListener('pageshow',()=>{suspended=false;sync();});
if(reduced.addEventListener)reduced.addEventListener('change',sync);else reduced.addListener(sync);
video.addEventListener('playing',show);
for(const event of ['pause','waiting','emptied'])video.addEventListener(event,()=>header.classList.remove('video-playing'));
function error(){failed=true;sync();}
video.addEventListener('error',error);
video.querySelector('source').addEventListener('error',error);
sync();
