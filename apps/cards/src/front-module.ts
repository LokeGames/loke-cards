import LayoutDashboard from "@loke/ui/icons/LayoutDashboard.svelte";
import { defineFrontModule } from "@loke/front-api";

export const cardsFrontModule = defineFrontModule({
  id: "cards",
  label: "Cards",
  icon: LayoutDashboard,
  defaultPath: "/cards",
  order: 10,
  loadView: () => import("./module/CardsModuleView.svelte"),
});
