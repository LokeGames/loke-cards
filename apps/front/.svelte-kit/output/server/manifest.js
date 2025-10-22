export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["manifest.json"]),
	mimeTypes: {".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.C7opE3Xp.js",app:"_app/immutable/entry/app.iKn24vVM.js",imports:["_app/immutable/entry/start.C7opE3Xp.js","_app/immutable/chunks/B0tt7mr_.js","_app/immutable/chunks/BXFeFmkJ.js","_app/immutable/chunks/Br-N696v.js","_app/immutable/entry/app.iKn24vVM.js","_app/immutable/chunks/D9o7MBRo.js","_app/immutable/chunks/BXFeFmkJ.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CiKQ9KvB.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
