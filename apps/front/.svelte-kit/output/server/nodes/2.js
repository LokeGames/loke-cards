

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.DM3RrfOZ.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/BnfXkLE3.js","_app/immutable/chunks/yF9IpEO4.js"];
export const stylesheets = [];
export const fonts = [];
