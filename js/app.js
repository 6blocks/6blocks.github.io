import {createIntrecci,validState} from './intrecci.js';
import {S} from './config.js';
import {loadArchive} from './levels.js';
import {canFit,canExit,step} from './engine.js';
import {readSession,writeSession} from './storage.js';
import {createManager,restoreSnapshot} from './level-manager.js';
import {markup} from './renderer.js';
async function boot(){const LEVELS=await loadArchive();const response=await fetch(new URL('../levels/intrecci.json',import.meta.url),{cache:'no-cache'});if(!response.ok)throw Error('Archivio Intrecci non disponibile');const archive=await response.json();const ropeLevels=archive.levels.map(s=>({...s,id:s.level,schemaId:s.schema_id}));LEVELS.push(...ropeLevels);
const saved=readSession(), manager=createManager(LEVELS,saved);let active=false;
let levelIndex=0, level=LEVELS[0], W=level.width,H=level.height,initial=level.blocks,gates=level.gates;
const svg=document.querySelector('#svg'),msg=document.querySelector('#msg'),movesEl=document.querySelector('#moves'),remaining=document.querySelector('#remaining'),undo=document.querySelector('#undo');let pieces=[],moves=0,history=[],drag=null;const clone=a=>a.map(p=>({...p}));
const currentState=()=>({pieces,W,H,gates});
function fits(p,x,y){return canFit(currentState(),p,x,y)}
function exit(p,dx,dy){return canExit(currentState(),p,dx,dy)}
let previousVisual=[];
const resetBtn=document.querySelector("#reset"),home=document.querySelector('#home'),game=document.querySelector('#game'),play=document.querySelector('#play'),homeBtn=document.querySelector('#home-btn'),success=document.querySelector('#success'),restartAll=document.querySelector('#restart-all');
let celebrating=false;const ropeSvg=document.querySelector('#intrecci-svg'),remainingLabel=document.querySelector('#remaining-label');
const isRope=()=>level.mode==='intrecci';
const ropeGame=createIntrecci(archive,{onSave:()=>persist(),onComplete:()=>{if(level.id<6)loadLevel(level.id+1);else completeCycle();}});
function completeCycle(){active=false;persist();showHome();document.querySelector('#completed-cycle').showModal();}
const compact=ps=>ps.map(({id,x,y})=>({id,x,y}));
function persist(){const ok=writeSession({used:manager.used,game:active?(isRope()?{schemaId:level.schemaId,ropeState:ropeGame.snapshot()}:{schemaId:level.schemaId,pieces:compact(pieces),moves,history:history.map(compact)}):null});if(!ok)msg.textContent='Salvataggio locale non disponibile.';}
function label(){play.querySelector('span').firstChild.textContent=active?'Continua':'Gioca subito';}
function showHome(){game.hidden=true;home.hidden=false;window.setLivingHomeActive?.(true);label();}
function showSuccess(){if(pieces.length||drag||!active)return;if(level.id<6){loadLevel(level.id+1);return;}completeCycle();}
play.onclick=()=>{if(!active)loadLevel(1);home.hidden=true;game.hidden=false;window.setLivingHomeActive?.(false);label();};
homeBtn.onclick=()=>{if(drag||(isRope()&&ropeGame.locked()))return;persist();showHome();};
restartAll.hidden=true;success.hidden=true;
function render(){svg.innerHTML=markup({W,H,gates,pieces,drag,previousVisual});previousVisual=clone(pieces);movesEl.textContent=moves;remaining.textContent=pieces.length;undo.disabled=!history.length||!!drag||celebrating;const complete=!pieces.length&&!drag;svg.parentElement.classList.toggle('is-complete',complete);
resetBtn.disabled=!!drag||celebrating;homeBtn.disabled=!!drag;resetBtn.textContent='↻ Ricomincia';}
function resizeBoard(){svg.setAttribute("viewBox",`-32 -32 ${W*S+64} ${H*S+64}`);svg.parentElement.style.aspectRatio=`${W*S+64}/${H*S+64}`;svg.setAttribute("aria-label",`Tabellone ${W} colonne per ${H} righe`);}
function setLevel(next){level=next;svg.hidden=isRope();ropeSvg.hidden=!isRope();remainingLabel.textContent=isRope()?'Corde: ':'Blocchi: ';svg.parentElement.classList.remove('is-complete');if(isRope()){svg.parentElement.style.aspectRatio='400/500';document.querySelector('#heading').textContent=`6 Blocks · Livello ${level.id}`;return;}levelIndex=level.id-1;W=level.width;H=level.height;initial=level.blocks;gates=level.gates;document.querySelector('#heading').textContent=`6 Blocks · Livello ${level.id}`;resizeBoard();}
function loadLevel(number){if(drag)return;setLevel(manager.choose(number));active=true;if(isRope()){ropeGame.load(level);persist();}else reset();label();}
resizeBoard();
// Input e transazioni
function point(e){const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())}
svg.addEventListener('pointerdown',e=>{if(isRope()||celebrating||drag||e.button!==0||!e.isPrimary)return;let el=e.target.closest('[data-id]');if(!el)return;let p=pieces.find(p=>p.id===+el.dataset.id),a=point(e);drag={id:p.id,a,baseX:p.x,baseY:p.y,snapshot:clone(pieces),changed:false,removed:false};svg.setPointerCapture(e.pointerId);drag.pointer=e.pointerId;undo.disabled=true;resetBtn.disabled=true;homeBtn.disabled=true;el.classList.add("is-selected");e.preventDefault()});
svg.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pointer||drag.removed)return;const p=pieces.find(p=>p.id===drag.id),a=point(e);let tx=drag.baseX+Math.round((a.x-drag.a.x)/S),ty=drag.baseY+Math.round((a.y-drag.a.y)/S);for(let i=0;i<20;i++){let dx=tx-p.x,dy=ty-p.y;if(!dx&&!dy)break;let dirs=Math.abs(dx)>=Math.abs(dy)?[[Math.sign(dx),0],[0,Math.sign(dy)]]:[[0,Math.sign(dy)],[Math.sign(dx),0]];let ok=false;for(let [u,v] of dirs){if(!u&&!v)continue;const result=step(currentState(),p,u,v);if(result){ok=true;drag.changed=true;if(result==='removed'){drag.removed=true;msg.textContent='Blocco liberato!'}break}}if(!ok||drag.removed)break}render()});
function finish(e,cancel){if(!drag||e.pointerId!==drag.pointer)return;let d=drag;drag=null;if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId);if(cancel){pieces=d.snapshot;msg.textContent='Movimento annullato.'}else if(d.removed||pieces.some(p=>p.id===d.id&&(p.x!==d.baseX||p.y!==d.baseY))){history.push(d.snapshot);moves++;if(!d.removed)msg.textContent='Continua così!'}if(!cancel&&!pieces.length){showSuccess();return;}render();if(!cancel)persist()}
svg.addEventListener('pointerup',e=>finish(e,false));svg.addEventListener('pointercancel',e=>finish(e,true));svg.addEventListener('lostpointercapture',e=>finish(e,true));
function reset(){if(drag)return;previousVisual=[];pieces=clone(initial);moves=0;history=[];msg.textContent='Trascina un blocco oltre il bordo della sua uscita.';render();persist()}resetBtn.onclick=()=>isRope()?ropeGame.reset():reset();undo.onclick=()=>{if(isRope()){ropeGame.undo();return;}if(drag||celebrating||!history.length)return;pieces=history.pop();moves--;msg.textContent='Ultima mossa annullata.';render();persist()};const restoredLevel=manager.find(saved?.game?.schemaId), restored=restoredLevel?.mode==='incastri'?restoreSnapshot(restoredLevel,saved?.game):null;if(restoredLevel?.mode==='intrecci'&&validState(restoredLevel,saved.game.ropeState)){setLevel(restoredLevel);active=true;ropeGame.load(level,saved.game.ropeState);if(!saved.game.ropeState.ropes.length){if(level.id<6)loadLevel(level.id+1);else completeCycle();}}else if(restored){setLevel(restoredLevel);active=true;({pieces,moves,history}=restored);msg.textContent='Partita ripristinata.';render();}else{active=false;persist();}label();play.disabled=false;document.querySelector('#loading').hidden=true;

}
boot().catch(e=>{document.querySelector('#loading').textContent='Errore: '+e.message+' — apri il gioco tramite GitHub Pages o server locale.';});
