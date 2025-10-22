

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/cards/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.BCBYDxfW.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/C1hX3fOc.js","_app/immutable/chunks/DiLIMQ14.js"];
export const stylesheets = [];
export const fonts = [];
