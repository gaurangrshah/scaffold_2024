import { SidebarLink } from "@/components/sidebar-items";
import { Cog, Globe, HomeIcon, Notebook } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon },
  { href: "/blog", title: "Blog", icon: Notebook },
  { href: "/settings", title: "Settings", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [];
