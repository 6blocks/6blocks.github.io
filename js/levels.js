import {palette} from './config.js';
export function normalizeLevel(raw) {
  if(raw.width!==8 || raw.height!==10) throw Error('Dimensioni livello non valide');
  const ids=new Set(), occupied=new Set();
  const blocks=raw.blocks.map(p=>{
    if(ids.has(p.id)||!palette[p.c]||!Number.isInteger(p.x)||!Number.isInteger(p.y)) throw Error('Blocco non valido');
    ids.add(p.id);
    if(!p.cells&&(!Number.isInteger(p.w)||!Number.isInteger(p.h)||p.w<1||p.h<1||p.w>raw.width||p.h>raw.height)) throw Error('Forma non valida');
    const cells=p.cells?p.cells.map(c=>c.slice()):Array.from({length:p.w*p.h},(_,i)=>[i%p.w,Math.floor(i/p.w)]);
    if(!cells.length) throw Error('Forma vuota');
    for(const [u,v] of cells){const x=p.x+u,y=p.y+v,k=x+','+y;if(!Number.isInteger(u)||!Number.isInteger(v)||u<0||v<0||x<0||y<0||x>=raw.width||y>=raw.height||occupied.has(k)) throw Error('Celle sovrapposte o fuori tabellone');occupied.add(k);}
    return {...p,cells,w:Math.max(...cells.map(c=>c[0]))+1,h:Math.max(...cells.map(c=>c[1]))+1};
  });
  const gates=raw.gates.map(g=>{const vertical=['top','bottom'].includes(g.side);if(!vertical&&!['left','right'].includes(g.side)||!palette[g.c]||!Number.isInteger(g.start)||!Number.isInteger(g.len)||g.start<0||g.len<1||g.start+g.len>(vertical?raw.width:raw.height)) throw Error('Uscita non valida');return {...g};});
  return {...raw,blocks,gates};
}

const sides={alto:'top',basso:'bottom',sinistra:'left',destra:'right'};
const colors={blu:'blue',ambra:'amber',verde:'green',viola:'purple',rosso:'red',turchese:'teal',rosa:'pink',ardesia:'slate',arancio:'orange',oliva:'olive'};
const shapes=new Set(['1x1','2x1','3x1','1x2','1x3','2x2']);
export function convertArchive(data){if(!Array.isArray(data.levels)||!data.levels.length)throw Error('Archivio vuoto');const ids=new Set();return data.levels.map(l=>{if(!Number.isInteger(l.level)||typeof l.schema_id!=='string'||!l.schema_id||ids.has(l.schema_id)||l.mode!=='incastri')throw Error('ID livello non valido');ids.add(l.schema_id);const gates=l.exits.map(g=>({side:sides[g.side],start:g.start-1,len:g.width,c:colors[g.color]}));const blocks=l.blocks.map((p,i)=>{if(!shapes.has(`${p.width}x${p.height}`))throw Error('Forma non autorizzata');return {id:i+1,sourceId:p.id,x:p.col-1,y:p.row-1,w:p.width,h:p.height,c:colors[p.color]}});if(new Set(blocks.map(p=>p.sourceId)).size!==blocks.length)throw Error('ID blocco duplicato');const result=normalizeLevel({id:l.level,schemaId:l.schema_id,mode:l.mode,width:l.columns,height:l.rows,blocks,gates});for(let i=0;i<gates.length;i++)for(let j=0;j<i;j++){const a=gates[i],b=gates[j];if(a.side===b.side&&a.start<b.start+b.len&&b.start<a.start+a.len)throw Error('Uscite sovrapposte')}for(const p of result.blocks)if(!gates.some(g=>g.c===p.c&&g.len>=(['top','bottom'].includes(g.side)?p.w:p.h)))throw Error('Uscita mancante');return result}).sort((a,b)=>a.id-b.id)}
export async function loadArchive(){const response=await fetch(new URL('../levels/levels.json',import.meta.url),{cache:'no-cache'});if(!response.ok)throw Error('Impossibile caricare gli schemi: '+response.status);return convertArchive(await response.json())}
