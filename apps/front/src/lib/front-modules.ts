import { sortFrontModules, type FrontModuleDefinition } from "@loke/front-api";
import { cardsFrontModule } from "@loke/apps-cards";
import { projectsFrontModule } from "./modules/projects-module";

const registeredModules: FrontModuleDefinition[] = [
  projectsFrontModule,
  cardsFrontModule,
];

export const frontModules = sortFrontModules(registeredModules);

export function getFrontModuleById(moduleId: string): FrontModuleDefinition | undefined {
  return frontModules.find((module) => module.id === moduleId);
}
