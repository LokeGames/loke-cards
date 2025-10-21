

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.B05YqU1o.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/C5HDdxh5.js","_app/immutable/chunks/B8En_kGa.js"];
export const stylesheets = [];
export const fonts = [];
