import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.jtCX0gZa.js","_app/immutable/chunks/DspeRCKW.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/DqDbm2O2.js","_app/immutable/chunks/sGFOQxJo.js","_app/immutable/chunks/ZlGIUv6I.js","_app/immutable/chunks/CwOmCpq2.js","_app/immutable/chunks/B0cH_OIE.js","_app/immutable/chunks/BVb-utnl.js","_app/immutable/chunks/Ciz9RJhc.js","_app/immutable/chunks/CeBdiqT2.js","_app/immutable/chunks/f1wUlcZ-.js","_app/immutable/chunks/CeiRjqS6.js","_app/immutable/chunks/CC1fpq60.js","_app/immutable/chunks/DFlKhOLf.js","_app/immutable/chunks/9O7efVWq.js"];
export const stylesheets = ["_app/immutable/assets/0.DH_QduJ2.css"];
export const fonts = [];
