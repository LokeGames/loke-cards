import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.CAavINpN.js","_app/immutable/chunks/B0Uv51C4.js","_app/immutable/chunks/Br-N696v.js","_app/immutable/chunks/BXFeFmkJ.js","_app/immutable/chunks/BG538JTy.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/C0onhL4A.js","_app/immutable/chunks/CiKQ9KvB.js","_app/immutable/chunks/CWcAXP6L.js","_app/immutable/chunks/D9o7MBRo.js"];
export const stylesheets = ["_app/immutable/assets/0.G4lRq71G.css"];
export const fonts = [];
