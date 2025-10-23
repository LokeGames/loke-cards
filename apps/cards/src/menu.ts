import FileText from "@loke/ui/icons/FileText.svelte";
import File from "@loke/ui/icons/File.svelte";
import BookOpen from "@loke/ui/icons/BookOpen.svelte";
import List from "@loke/ui/icons/List.svelte";

export interface MenuItem {
  label: string;
  href: string;
  icon?: any; // Lucide Svelte component
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
    label: "Table of Contents",
    href: "/cards/toc",
    icon: List,
  },
];
