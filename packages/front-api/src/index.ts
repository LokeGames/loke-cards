import type { ComponentType } from "svelte";

export type ModuleViewModule = { default: ComponentType } | ComponentType;

export type FrontModuleViewLoader = () => Promise<ModuleViewModule>;

export interface FrontModuleDefinition {
  id: string;
  label: string;
  icon: ComponentType;
  loadView: FrontModuleViewLoader;
  defaultPath?: string;
  order?: number;
}

export interface FrontModuleNavItem {
  id: string;
  label: string;
  icon: ComponentType;
  href: string;
}

export function defineFrontModule(definition: FrontModuleDefinition): FrontModuleDefinition {
  if (!definition.id.trim()) {
    throw new Error("FrontModuleDefinition.id is required");
  }
  if (!definition.label.trim()) {
    throw new Error("FrontModuleDefinition.label is required");
  }
  if (typeof definition.loadView !== "function") {
    throw new Error("FrontModuleDefinition.loadView must be a function");
  }

  return Object.freeze({
    ...definition,
    order: definition.order ?? 0,
  });
}

export async function resolveModuleView(definition: FrontModuleDefinition): Promise<ComponentType> {
  const module = await definition.loadView();

  if (typeof module === "function") {
    return module as ComponentType;
  }

  if ("default" in module && module.default) {
    return module.default as ComponentType;
  }

  throw new Error(`Front module "${definition.id}" did not return a valid Svelte component`);
}

export function sortFrontModules(modules: FrontModuleDefinition[]): FrontModuleDefinition[] {
  return [...modules].sort((a, b) => {
    const orderDelta = (a.order ?? 0) - (b.order ?? 0);
    if (orderDelta !== 0) {
      return orderDelta;
    }
    return a.label.localeCompare(b.label);
  });
}

export class FrontModuleRegistry {
  #modules = new Map<string, FrontModuleDefinition>();

  register(definition: FrontModuleDefinition): FrontModuleDefinition {
    if (this.#modules.has(definition.id)) {
      throw new Error(`Front module with id "${definition.id}" is already registered`);
    }
    this.#modules.set(definition.id, definition);
    return definition;
  }

  get(id: string): FrontModuleDefinition | undefined {
    return this.#modules.get(id);
  }

  list(): FrontModuleDefinition[] {
    return sortFrontModules([...this.#modules.values()]);
  }
}

export function createFrontModuleRegistry(
  initialModules: FrontModuleDefinition[] = [],
): FrontModuleRegistry {
  const registry = new FrontModuleRegistry();
  initialModules.forEach((module) => {
    registry.register(module);
  });
  return registry;
}
