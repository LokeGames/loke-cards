
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
		RouteId(): "/" | "/chapters" | "/chapter" | "/chapter/new" | "/code" | "/scenes" | "/scene" | "/scene/new" | "/scene/[id]" | "/settings" | "/toc" | "/worker-cards-crud" | "/worker-cards" | "/worker-chapters" | "/worker-test";
		RouteParams(): {
			"/scene/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/chapters": Record<string, never>;
			"/chapter": Record<string, never>;
			"/chapter/new": Record<string, never>;
			"/code": Record<string, never>;
			"/scenes": Record<string, never>;
			"/scene": { id?: string };
			"/scene/new": Record<string, never>;
			"/scene/[id]": { id: string };
			"/settings": Record<string, never>;
			"/toc": Record<string, never>;
			"/worker-cards-crud": Record<string, never>;
			"/worker-cards": Record<string, never>;
			"/worker-chapters": Record<string, never>;
			"/worker-test": Record<string, never>
		};
		Pathname(): "/" | "/chapters" | "/chapters/" | "/chapter" | "/chapter/" | "/chapter/new" | "/chapter/new/" | "/code" | "/code/" | "/scenes" | "/scenes/" | "/scene" | "/scene/" | "/scene/new" | "/scene/new/" | `/scene/${string}` & {} | `/scene/${string}/` & {} | "/settings" | "/settings/" | "/toc" | "/toc/" | "/worker-cards-crud" | "/worker-cards-crud/" | "/worker-cards" | "/worker-cards/" | "/worker-chapters" | "/worker-chapters/" | "/worker-test" | "/worker-test/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}