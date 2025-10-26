export interface MenuItem {
  label: string;
  href: string;
  icon?: string;
}

export const graphMenu: MenuItem[] = [
  {
    label: "Graph Overview",
    href: "/graph",
    icon: "🔗",
  },
  {
    label: "Global Graph",
    href: "/graph/global",
    icon: "🌐",
  },
  {
    label: "Chapter Graphs",
    href: "/graph/chapter",
    icon: "📖",
  },
];
