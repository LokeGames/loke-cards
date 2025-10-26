import Folder from "@loke/ui/icons/Folder.svelte";
import { defineFrontModule } from "@loke/front-api";

export const projectsFrontModule = defineFrontModule({
  id: "projects",
  label: "Projects",
  icon: Folder,
  defaultPath: "/",
  order: 5, // Before cards (order: 10)
  loadView: () => import("./ProjectsModuleView.svelte"),
});
