
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/cards" | "/cards/chapters" | "/cards/chapters/edit" | "/cards/chapters/edit/[id]" | "/cards/chapters/new" | "/cards/scenes" | "/cards/scenes/edit" | "/cards/scenes/edit/[id]" | "/cards/scenes/new" | "/cards/states" | "/cards/states/edit" | "/cards/states/edit/[id]" | "/cards/states/new" | "/cards/toc-graph-test" | "/cards/toc-graph" | "/cards/toc" | "/projects" | "/settings" | "/toc-graph-standalone";
		RouteParams(): {
			"/cards/chapters/edit/[id]": { id: string };
			"/cards/scenes/edit/[id]": { id: string };
			"/cards/states/edit/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/cards": { id?: string };
			"/cards/chapters": { id?: string };
			"/cards/chapters/edit": { id?: string };
			"/cards/chapters/edit/[id]": { id: string };
			"/cards/chapters/new": Record<string, never>;
			"/cards/scenes": { id?: string };
			"/cards/scenes/edit": { id?: string };
			"/cards/scenes/edit/[id]": { id: string };
			"/cards/scenes/new": Record<string, never>;
			"/cards/states": { id?: string };
			"/cards/states/edit": { id?: string };
			"/cards/states/edit/[id]": { id: string };
			"/cards/states/new": Record<string, never>;
			"/cards/toc-graph-test": Record<string, never>;
			"/cards/toc-graph": Record<string, never>;
			"/cards/toc": Record<string, never>;
			"/projects": Record<string, never>;
			"/settings": Record<string, never>;
			"/toc-graph-standalone": Record<string, never>
		};
		Pathname(): "/" | "/cards" | "/cards/" | "/cards/chapters" | "/cards/chapters/" | "/cards/chapters/edit" | "/cards/chapters/edit/" | `/cards/chapters/edit/${string}` & {} | `/cards/chapters/edit/${string}/` & {} | "/cards/chapters/new" | "/cards/chapters/new/" | "/cards/scenes" | "/cards/scenes/" | "/cards/scenes/edit" | "/cards/scenes/edit/" | `/cards/scenes/edit/${string}` & {} | `/cards/scenes/edit/${string}/` & {} | "/cards/scenes/new" | "/cards/scenes/new/" | "/cards/states" | "/cards/states/" | "/cards/states/edit" | "/cards/states/edit/" | `/cards/states/edit/${string}` & {} | `/cards/states/edit/${string}/` & {} | "/cards/states/new" | "/cards/states/new/" | "/cards/toc-graph-test" | "/cards/toc-graph-test/" | "/cards/toc-graph" | "/cards/toc-graph/" | "/cards/toc" | "/cards/toc/" | "/projects" | "/projects/" | "/settings" | "/settings/" | "/toc-graph-standalone" | "/toc-graph-standalone/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/manifest.json" | string & {};
	}
}