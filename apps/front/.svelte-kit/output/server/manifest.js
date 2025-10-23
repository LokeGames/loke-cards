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
		client: {start:"_app/immutable/entry/start.DMtw6X5o.js",app:"_app/immutable/entry/app.tzKCrP5O.js",imports:["_app/immutable/entry/start.DMtw6X5o.js","_app/immutable/chunks/CiwgAdwy.js","_app/immutable/chunks/VUbJ2AoM.js","_app/immutable/chunks/BOBn-JNp.js","_app/immutable/chunks/BQfWZw2H.js","_app/immutable/entry/app.tzKCrP5O.js","_app/immutable/chunks/DKHEHfnS.js","_app/immutable/chunks/BOBn-JNp.js","_app/immutable/chunks/CWV3WZP_.js","_app/immutable/chunks/VUbJ2AoM.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/D88A_OO5.js","_app/immutable/chunks/CBsudzpE.js","_app/immutable/chunks/BQfWZw2H.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js'))
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
				id: "/cards",
				pattern: /^\/cards\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/cards/chapters",
				pattern: /^\/cards\/chapters\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/cards/chapters/edit/[id]",
				pattern: /^\/cards\/chapters\/edit\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/cards/chapters/new",
				pattern: /^\/cards\/chapters\/new\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/cards/scenes",
				pattern: /^\/cards\/scenes\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/cards/scenes/edit/[id]",
				pattern: /^\/cards\/scenes\/edit\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/cards/scenes/new",
				pattern: /^\/cards\/scenes\/new\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/cards/states",
				pattern: /^\/cards\/states\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/cards/states/edit/[id]",
				pattern: /^\/cards\/states\/edit\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/cards/states/new",
				pattern: /^\/cards\/states\/new\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/cards/toc",
				pattern: /^\/cards\/toc\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
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
