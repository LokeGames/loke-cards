
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
		RouteId(): "/" | "/cards" | "/cards/chapters" | "/cards/chapter" | "/cards/chapter/new" | "/cards/editor" | "/cards/scenes" | "/cards/scene" | "/cards/scene/new" | "/cards/toc" | "/settings";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/cards": Record<string, never>;
			"/cards/chapters": Record<string, never>;
			"/cards/chapter": Record<string, never>;
			"/cards/chapter/new": Record<string, never>;
			"/cards/editor": Record<string, never>;
			"/cards/scenes": Record<string, never>;
			"/cards/scene": Record<string, never>;
			"/cards/scene/new": Record<string, never>;
			"/cards/toc": Record<string, never>;
			"/settings": Record<string, never>
		};
		Pathname(): "/" | "/cards" | "/cards/" | "/cards/chapters" | "/cards/chapters/" | "/cards/chapter" | "/cards/chapter/" | "/cards/chapter/new" | "/cards/chapter/new/" | "/cards/editor" | "/cards/editor/" | "/cards/scenes" | "/cards/scenes/" | "/cards/scene" | "/cards/scene/" | "/cards/scene/new" | "/cards/scene/new/" | "/cards/toc" | "/cards/toc/" | "/settings" | "/settings/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/manifest.json" | string & {};
	}
}