import type { ComponentType } from "svelte";
import type { Icon as IconType } from "@lucide/svelte";

import type { ComponentType } from "svelte";
import type { Icon as IconType } from "@lucide/svelte";
import { FileText, File, BookOpen, Edit, Plus, List } from "@lucide/svelte";

export interface MenuItem {
  label: string;
  href: string;
  icon?: ComponentType<IconType>;
}

export const cardsMenu: MenuItem[] = [
  {
    label: "Cards",
    href: "/cards",
    icon: FileText,
  },
  {
    label: "Scenes",
    href: "/cards/scenes",
    icon: File,
  },
  {
    label: "Chapters",
    href: "/cards/chapters",
    icon: BookOpen,
  },
  {
    label: "Scene Editor",
    href: "/cards/editor",
    icon: Edit,
  },
  {
    label: "New Scene",
    href: "/cards/scene/new",
    icon: Plus,
  },
  {
    label: "New Chapter",
    href: "/cards/chapter/new",
    icon: Plus,
  },
  {
    label: "Table of Contents",
    href: "/cards/toc",
    icon: List,
  },
];
