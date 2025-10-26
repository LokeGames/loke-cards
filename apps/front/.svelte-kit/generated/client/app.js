export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/cards": [3],
		"/cards/chapters": [4],
		"/cards/chapters/edit/[id]": [5],
		"/cards/chapters/new": [6],
		"/cards/scenes": [7],
		"/cards/scenes/edit/[id]": [8],
		"/cards/scenes/new": [9],
		"/cards/states": [10],
		"/cards/states/edit/[id]": [11],
		"/cards/states/new": [12],
		"/cards/toc-graph-test": [15],
		"/cards/toc-graph": [14],
		"/cards/toc": [13],
		"/projects": [16],
		"/settings": [17]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';