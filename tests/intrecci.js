import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeEngine,validState} from '../js/intrecci.js';
import {chooseSchema} from '../js/schema-selector.js';
const archive=JSON.parse(readFileSync(new URL('../levels/intrecci.json',import.meta.url)));
let moves=0;for(const s of archive.levels){const e=makeEngine(s);assert.equal(e.free().length,4);assert.equal(new Set(s.layer_order).size,s.ropes.length);for(const m of s.solution){assert(e.isFreeAbove(m.from));assert(e.allowed(m.from).includes(m.to));const before=e.snapshot();const result=e.move(m.rope_id,m.from,m.to);assert(result);assert.deepEqual(result.removed.sort((a,b)=>a-b),[...m.removed_rope_ids].sort((a,b)=>a-b));assert.equal(e.ropes.length,m.remaining_ropes);const after=e.snapshot();assert(validState(s,after));e.undo();assert.deepEqual(e.snapshot(),before);e.restore(after);moves++;}assert.equal(e.ropes.length,0);e.reset();assert.deepEqual(e.ropes,s.ropes);console.log(s.schema_id,'OK',s.solution.length);}
const levels=archive.levels.map(s=>({...s,id:s.level,schemaId:s.schema_id}));const used={};for(const level of [4,5,6]){let last;for(let i=0;i<30;i++){const ids=Array.from({length:5},()=>chooseSchema(levels,level,used).schemaId);assert.equal(new Set(ids).size,5);assert.notEqual(ids[0],last);last=ids.at(-1)}}console.log('Intrecci: '+moves+' mosse, 90 cicli di estrazione OK');
