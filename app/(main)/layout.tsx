import React from "react";
import { MenuOptions as Sidebar } from "@/components/scaffold/sidebar";
import { InfoBar } from "@/components/scaffold/infobar";
import { ClerkProvider } from "@clerk/nextjs";

type Props = { children: React.ReactNode };

const Layout = (props: Props) => {
  return (
    <ClerkProvider>
      <div className="flex overflow-hidden h-screen">
        <Sidebar />
        <div className="w-full">
          <InfoBar />
          {props.children}
        </div>
      </div>
    </ClerkProvider>
  );
};

export default Layout;
