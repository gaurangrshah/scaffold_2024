"use client";

import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { Cookie } from "lucide-react";

import { cn } from "@/lib/utils";
import { BannerTriggerGroup } from "./banner-buttons";

export const background =
  "bg-muted/20 py-4 px-6 rounded-lg shadow-lg flex items-center justify-between gap-x-4 backdrop-blur-md";

export default function Banner(props: BannerProps) {
  const { asChild, leftElement, buttonGroup, bannerClass, ...rest } = props;

  const ContentSlot = asChild ? Slot : BannerContent;
  const btnGroup = buttonGroup ? buttonGroup : <BannerTriggerGroup />;
  const lefty = leftElement ? leftElement : <Cookie className="w-8 h-8" />;

  return (
    <div className="fixed inset-x-0 bottom-10 max-w-3xl z-10 mx-auto">
      <div className={cn(background, bannerClass)}>
        {lefty}
        <ContentSlot {...rest}>{props.children}</ContentSlot>
        {btnGroup}
      </div>
    </div>
  );
}

function BannerContent(props: BannerContentProps) {
  return (
    <div className="flex flex-col justify-center gap-y-2 mr-2 flex-1 text-sm">
      <strong>{props.heading ?? "Transparency"}</strong>
      <p className="">
        {props.description ?? "We use cookies to improve your experience."} By
        using our site, you agree to our{" "}
        <Link
          href={props.href ?? "/privacy"}
          className="text-primary-500 dark:text-primary-400 hover:underline text-gray-500"
        >
          {props.label ?? "privacy policy"}
        </Link>
        .
      </p>
    </div>
  );
}
