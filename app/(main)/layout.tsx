import React from "react";
import { MenuOptions as Sidebar } from "@/components/scaffold/sidebar";
import { InfoBar } from "@/components/scaffold/infobar";

type Props = { children: React.ReactNode };

const Layout = (props: Props) => {
  return (
    <div className="flex overflow-hidden h-screen">
      <Sidebar />
      <div className="w-full">
        <InfoBar />
        {props.children}
      </div>
    </div>
  );
};

export default Layout;
