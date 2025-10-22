
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
		RouteId(): "/" | "/cards" | "/cards/editor" | "/cards/scenes" | "/chapters" | "/chapter" | "/chapter/new" | "/graph" | "/graph/chapter" | "/graph/chapter/[id]" | "/graph/global" | "/scenes" | "/scene" | "/scene/new" | "/settings" | "/toc";
		RouteParams(): {
			"/graph/chapter/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/cards": Record<string, never>;
			"/cards/editor": Record<string, never>;
			"/cards/scenes": Record<string, never>;
			"/chapters": Record<string, never>;
			"/chapter": Record<string, never>;
			"/chapter/new": Record<string, never>;
			"/graph": { id?: string };
			"/graph/chapter": { id?: string };
			"/graph/chapter/[id]": { id: string };
			"/graph/global": Record<string, never>;
			"/scenes": Record<string, never>;
			"/scene": Record<string, never>;
			"/scene/new": Record<string, never>;
			"/settings": Record<string, never>;
			"/toc": Record<string, never>
		};
		Pathname(): "/" | "/cards" | "/cards/" | "/cards/editor" | "/cards/editor/" | "/cards/scenes" | "/cards/scenes/" | "/chapters" | "/chapters/" | "/chapter" | "/chapter/" | "/chapter/new" | "/chapter/new/" | "/graph" | "/graph/" | "/graph/chapter" | "/graph/chapter/" | `/graph/chapter/${string}` & {} | `/graph/chapter/${string}/` & {} | "/graph/global" | "/graph/global/" | "/scenes" | "/scenes/" | "/scene" | "/scene/" | "/scene/new" | "/scene/new/" | "/settings" | "/settings/" | "/toc" | "/toc/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/manifest.json" | string & {};
	}
}