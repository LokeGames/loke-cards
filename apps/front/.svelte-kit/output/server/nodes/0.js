import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.CPV6Ht6O.js","_app/immutable/chunks/97pmS50C.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/BSZVTExI.js","_app/immutable/chunks/BOBn-JNp.js","_app/immutable/chunks/ZInn0ksZ.js","_app/immutable/chunks/VUbJ2AoM.js","_app/immutable/chunks/D88A_OO5.js","_app/immutable/chunks/CWV3WZP_.js","_app/immutable/chunks/DYI_lUPm.js","_app/immutable/chunks/CBsudzpE.js","_app/immutable/chunks/BQfWZw2H.js","_app/immutable/chunks/DKHEHfnS.js","_app/immutable/chunks/BauaJNm8.js"];
export const stylesheets = ["_app/immutable/assets/0.pFHJaaOj.css"];
export const fonts = [];
