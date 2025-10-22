import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.BTqPX-7c.js","_app/immutable/chunks/DwqFSiyj.js","_app/immutable/chunks/DiLIMQ14.js","_app/immutable/chunks/DhJ1GmrU.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/C1hX3fOc.js","_app/immutable/chunks/pdyo7SJz.js","_app/immutable/chunks/nymsHo9p.js","_app/immutable/chunks/CD9qo3jc.js","_app/immutable/chunks/P5JXiikX.js","_app/immutable/chunks/Cys0exkC.js","_app/immutable/chunks/PPVm8Dsz.js","_app/immutable/chunks/BsbFul-W.js","_app/immutable/chunks/YxPbAD67.js"];
export const stylesheets = ["_app/immutable/assets/0.BQIvXJix.css"];
export const fonts = [];
