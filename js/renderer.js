import {S,palette} from './config.js';
const glossDefs=`<defs><linearGradient id="frame" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffb34e"/><stop offset=".25" stop-color="#42cfff"/><stop offset=".7" stop-color="#1277ce"/><stop offset="1" stop-color="#ff9a35"/></linearGradient><linearGradient id="cellshade" x2="0" y2="1"><stop stop-color="#071b35"/><stop offset="1" stop-color="#153c64"/></linearGradient><linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="white" stop-opacity=".34"/><stop offset=".23" stop-color="white" stop-opacity=".10"/><stop offset=".48" stop-color="white" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".24"/></linearGradient></defs>`;
function outline(p){
  const cells=new Set(p.cells.map(([x,y])=>x+','+y)), edges=new Map();
  function add(x,y,a,b){const k=x+','+y;if(!edges.has(k))edges.set(k,[]);edges.get(k).push([a,b]);}
  for(const [x,y] of p.cells){if(!cells.has(x+','+(y-1)))add(x,y,x+1,y);if(!cells.has((x+1)+','+y))add(x+1,y,x+1,y+1);if(!cells.has(x+','+(y+1)))add(x+1,y+1,x,y+1);if(!cells.has((x-1)+','+y))add(x,y+1,x,y);}
  let d='';while(edges.size){const k=edges.keys().next().value;let [x,y]=k.split(',').map(Number),cur=k;d+=`M${x*S} ${y*S}`;do{const arr=edges.get(cur);if(!arr||!arr.length)break;const [a,b]=arr.pop();if(!arr.length)edges.delete(cur);d+=`L${a*S} ${b*S}`;cur=a+','+b;}while(cur!==k);d+='Z';}return d;
}
function blockMarkup(p,cls=''){
 const [c,d]=palette[p.c],w=p.w*S,h=p.h*S;
 return `<g class="piece ${cls}" data-id="${p.id}" transform="translate(${p.x*S} ${p.y*S})"><rect width="${w}" height="${h}" fill="transparent" pointer-events="all"/><g class="piece-art"><rect width="${w}" height="${h}" rx="8" fill="${c}" stroke="${d}" stroke-width="1.4"/><rect width="${w}" height="${h}" rx="8" fill="url(#gloss)"/><rect width="${w}" height="${h}" rx="8" class="body" fill="none" stroke="${d}" stroke-width="1.4"/></g></g>`;
}
export function markup({W,H,gates,pieces,drag,previousVisual}){let out=glossDefs+`<rect x="-5" y="-5" width="${W*S+10}" height="${H*S+10}" rx="10" fill="var(--board)"/>`;for(let y=0;y<H;y++)for(let x=0;x<W;x++)out+=`<rect x="${x*S+1}" y="${y*S+1}" width="48" height="48" rx="3" fill="url(#cellshade)" stroke="#285477" stroke-width=".7"/>`;
// Draw frame segments only where no gate is defined.
for(const side of ['top','bottom','left','right']){const vertical=side==='top'||side==='bottom',n=vertical?W:H;let start=0;const openings=gates.filter(g=>g.side===side).sort((a,b)=>a.start-b.start);for(const g of [...openings,{start:n,len:0}]){if(g.start>start){const a=start*S,b=g.start*S,x=vertical?0:side==='left'?-5:W*S+5,y=vertical?(side==='top'?-5:H*S+5):0;out+=`<path d="M${vertical?a:x} ${vertical?y:a} L${vertical?b:x} ${vertical?y:b}" stroke="#125082" stroke-width="12" stroke-linecap="butt"/><path d="M${vertical?a:x} ${vertical?y:a} L${vertical?b:x} ${vertical?y:b}" stroke="url(#frame)" stroke-width="4" stroke-linecap="round"/>`;}start=g.start+g.len;}}
for(const g of gates){let v=g.side==='top'||g.side==='bottom',x=v?g.start*S:g.side==='left'?-29:W*S,y=v?(g.side==='top'?-29:H*S):g.start*S,w=v?g.len*S:29,h=v?29:g.len*S;out+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${palette[g.c][0]}" stroke="${palette[g.c][1]}" stroke-width="2"/><rect x="${x+2}" y="${y+2}" width="${w-4}" height="${h-4}" rx="4" fill="url(#gloss)"/><text x="${x+w/2}" y="${y+h/2+7}" text-anchor="middle" font-size="23" font-weight="bold" fill="white">${{top:'↑',bottom:'↓',left:'←',right:'→'}[g.side]}</text>`}

for(const p of pieces)out+=blockMarkup(p,drag&&drag.id===p.id?(drag.changed?'is-dragged':'is-selected'):'');
const vanished=drag&&drag.removed?previousVisual.find(p=>p.id===drag.id):null;
if(vanished)out+=blockMarkup(vanished,'is-exiting').replace('data-id="'+vanished.id+'"','aria-hidden="true"');
return out;}
