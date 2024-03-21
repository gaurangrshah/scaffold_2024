"use client";
// directive applied because this gets passed in as a prop to the consent manager.

import { Slot } from "@radix-ui/react-slot";
import { Cookie } from "lucide-react";

import { BannerTriggerGroup } from "./buttons";
import { BannerContent } from "./banner-content";

import { background } from "../utils/constants";
import { cn } from "@/lib/utils";

/**
 *
 * Responsible for rendering the shell and defining the structure of the banner components
 * orchestrates where and how each of the elements are rendered, and is configurable.
 * uses radix-ui's Slot primitive to facilitate this behavior by default as a wrapper around the children
 *
 * @export
 * @param {BannerProps} props: React.PropsWithChildren<{
 *   hasConsented: boolean; bannerClass?: string; asChild?: boolean; buttonGroup?: React.ReactNode; leftElement?: React.ReactNode;
 * }>
 * @return {*} {React.ReactNode}
 */
export default function Banner(props: BannerProps) {
  const {
    asChild,
    leftElement,
    buttonGroup,
    bannerClass,
    hasConsented,
    ...rest
  } = props;

  const ContentSlot = asChild ? Slot : !hasConsented ? BannerContent : Slot;
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
