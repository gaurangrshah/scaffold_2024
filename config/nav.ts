import { SidebarLink } from "@/components/sidebar-items";
import { Cog, Globe, HomeIcon } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon },
  { href: "/settings", title: "Settings", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: "Entities",
    links: [
      {
        href: "/local-google-credential",
        title: "Local Google Credential",
        icon: Globe,
      },
      {
        href: "/workflows",
        title: "Workflows",
        icon: Globe,
      },
      {
        href: "/notion",
        title: "Notion",
        icon: Globe,
      },
      {
        href: "/slack",
        title: "Slack",
        icon: Globe,
      },
      {
        href: "/discord-webhook",
        title: "Discord Webhook",
        icon: Globe,
      },
      {
        href: "/connections",
        title: "Connections",
        icon: Globe,
      },
      {
        href: "/users",
        title: "Users",
        icon: Globe,
      },
    ],
  },

];

