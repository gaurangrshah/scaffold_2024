"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function DashHeading({ sticky }: { sticky?: boolean }) {
  const pathname = usePathname();
  const title = pathname.split("/").pop();
  return title === "dash" ? (
    <div className="flex flex-col gap-4 relative">
      <h1 className="capitalize text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b">
        {pathname.split("/").pop()}
      </h1>
    </div>
  ) : (
    <div className="flex flex-col gap-4">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        <span>{pathname.split("/").pop()}</span>
      </h1>
    </div>
  );
}
