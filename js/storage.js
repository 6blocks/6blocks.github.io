const KEY='6blocks.session.v1';
export function readSession(storage){try{return JSON.parse((storage??globalThis.localStorage).getItem(KEY))||null}catch{return null}}
export function writeSession(value,storage){try{(storage??globalThis.localStorage).setItem(KEY,JSON.stringify(value));return true}catch{return false}}
