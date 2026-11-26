import {S} from './config.js';
import {loadArchive} from './levels.js';
import {canFit,canExit,step} from './engine.js';
import {markup} from './renderer.js';
async function boot(){const LEVELS=await loadArchive();
let levelIndex=0, level=LEVELS[0], W=level.width,H=level.height,initial=level.blocks,gates=level.gates;
const svg=document.querySelector('#svg'),msg=document.querySelector('#msg'),movesEl=document.querySelector('#moves'),remaining=document.querySelector('#remaining'),undo=document.querySelector('#undo');let pieces=[],moves=0,history=[],drag=null;const clone=a=>a.map(p=>({...p}));
const currentState=()=>({pieces,W,H,gates});
function fits(p,x,y){return canFit(currentState(),p,x,y)}
function exit(p,dx,dy){return canExit(currentState(),p,dx,dy)}
let previousVisual=[];
const next=document.querySelector("#next"), resetBtn=document.querySelector("#reset");
function render(){svg.innerHTML=markup({W,H,gates,pieces,drag,previousVisual});previousVisual=clone(pieces);movesEl.textContent=moves;remaining.textContent=pieces.length;undo.disabled=!history.length||!!drag;const complete=!pieces.length&&!drag;svg.parentElement.classList.toggle('is-complete',complete);
next.hidden=!complete;next.disabled=!complete;next.textContent=levelIndex===LEVELS.length-1?'Ricomincia dal livello 1':'Livello successivo →';
resetBtn.disabled=!!drag;resetBtn.textContent=complete?'↻ Ripeti livello':'↻ Ricomincia livello';}
function resizeBoard(){svg.setAttribute("viewBox",`-32 -32 ${W*S+64} ${H*S+64}`);svg.parentElement.style.aspectRatio=`${W*S+64}/${H*S+64}`;svg.setAttribute("aria-label",`Tabellone ${W} colonne per ${H} righe`);}
function loadLevel(index){if(drag||index<0||index>=LEVELS.length)return;level=LEVELS[index];levelIndex=index;W=level.width;H=level.height;initial=level.blocks;gates=level.gates;document.querySelector('#heading').textContent=`6 Blocks · Livello ${level.id}`;resizeBoard();reset();}
function advance(){if(!drag&&!pieces.length){next.disabled=true;loadLevel(levelIndex===LEVELS.length-1?0:levelIndex+1)}}
next.addEventListener('pointerup',e=>{if(e.pointerType==='touch'||e.pointerType==='pen'){e.preventDefault();advance()}});next.addEventListener('click',advance);
resizeBoard();
// Input e transazioni
function point(e){const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())}
svg.addEventListener('pointerdown',e=>{if(drag||e.button!==0||!e.isPrimary)return;let el=e.target.closest('[data-id]');if(!el)return;let p=pieces.find(p=>p.id===+el.dataset.id),a=point(e);drag={id:p.id,a,baseX:p.x,baseY:p.y,snapshot:clone(pieces),changed:false,removed:false};svg.setPointerCapture(e.pointerId);drag.pointer=e.pointerId;undo.disabled=true;resetBtn.disabled=true;el.classList.add("is-selected");e.preventDefault()});
svg.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pointer||drag.removed)return;const p=pieces.find(p=>p.id===drag.id),a=point(e);let tx=drag.baseX+Math.round((a.x-drag.a.x)/S),ty=drag.baseY+Math.round((a.y-drag.a.y)/S);for(let i=0;i<20;i++){let dx=tx-p.x,dy=ty-p.y;if(!dx&&!dy)break;let dirs=Math.abs(dx)>=Math.abs(dy)?[[Math.sign(dx),0],[0,Math.sign(dy)]]:[[0,Math.sign(dy)],[Math.sign(dx),0]];let ok=false;for(let [u,v] of dirs){if(!u&&!v)continue;const result=step(currentState(),p,u,v);if(result){ok=true;drag.changed=true;if(result==='removed'){drag.removed=true;msg.textContent='Blocco liberato!'}break}}if(!ok||drag.removed)break}render()});
function finish(e,cancel){if(!drag||e.pointerId!==drag.pointer)return;let d=drag;drag=null;if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId);if(cancel){pieces=d.snapshot;msg.textContent='Movimento annullato.'}else if(d.removed||pieces.some(p=>p.id===d.id&&(p.x!==d.baseX||p.y!==d.baseY))){history.push(d.snapshot);moves++;if(!d.removed)msg.textContent='Continua così!'}if(!pieces.length)msg.textContent='🎉 Livello completato in '+moves+' mosse!'+(levelIndex===LEVELS.length-1?' Hai completato tutti i livelli!':'');render()}
svg.addEventListener('pointerup',e=>finish(e,false));svg.addEventListener('pointercancel',e=>finish(e,true));svg.addEventListener('lostpointercapture',e=>finish(e,true));
function reset(){if(drag)return;previousVisual=[];pieces=clone(initial);moves=0;history=[];msg.textContent='Trascina un blocco oltre il bordo della sua uscita.';render()}resetBtn.onclick=reset;undo.onclick=()=>{if(drag||!history.length)return;pieces=history.pop();moves--;msg.textContent='Ultima mossa annullata.';render()};reset();document.querySelector("#reset").disabled=false;

}
boot().catch(e=>{document.querySelector('#msg').textContent='Errore: '+e.message+' — apri il gioco tramite GitHub Pages o server locale.';});
