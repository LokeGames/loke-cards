import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.DCz82vOo.js","_app/immutable/chunks/CefW3WW4.js","_app/immutable/chunks/yF9IpEO4.js","_app/immutable/chunks/CybAjIvC.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/BnfXkLE3.js","_app/immutable/chunks/CiMNkfne.js","_app/immutable/chunks/CAKmdX18.js","_app/immutable/chunks/oaR_oenP.js","_app/immutable/chunks/4O88iP2y.js","_app/immutable/chunks/DvVjvEKR.js","_app/immutable/chunks/Cpj98o6Y.js","_app/immutable/chunks/CiABMiT9.js","_app/immutable/chunks/SV0_QZCG.js","_app/immutable/chunks/BW16Smnj.js","_app/immutable/chunks/D2rwkULN.js"];
export const stylesheets = ["_app/immutable/assets/0.DBAr2swR.css"];
export const fonts = [];
