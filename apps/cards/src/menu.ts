export interface MenuItem {
  label: string;
  href: string;
  icon?: string;
}

export const cardsMenu: MenuItem[] = [
  {
    label: "Cards",
    href: "/cards",
    icon: "📝",
  },
  {
    label: "Scenes",
    href: "/cards/scenes",
    icon: "📄",
  },
  {
    label: "Chapters",
    href: "/cards/chapters",
    icon: "📚",
  },
  {
    label: "Scene Editor",
    href: "/cards/editor",
    icon: "✏️",
  },
  {
    label: "New Scene",
    href: "/cards/scene/new",
    icon: "➕",
  },
  {
    label: "New Chapter",
    href: "/cards/chapter/new",
    icon: "➕",
  },
  {
    label: "Table of Contents",
    href: "/cards/toc",
    icon: "📋",
  },
];
