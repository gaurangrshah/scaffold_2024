"use client";

import { Slot } from "@radix-ui/react-slot";

import { Button, ButtonProps } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGTM } from "@/components/cookies/context";
import { background } from "./banner";
import { BannerOptions } from "./banner-options";

import { cn } from "@/lib/utils";

export function ShowMeButton({ btn, ...rest }: { btn?: ButtonProps }) {
  const { tags } = useGTM();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button {...btn} {...rest} onClick={console.log} />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="top"
        className={cn("relative, w-[500px] ", background)}
      >
        <div className="absolute rotate-[270deg] -left-[2.2rem] pt-3 top-[3.5rem] opacity-90 z-0 drop-shadow-md flex gap-2">
          <p>Transparency</p>
        </div>
        <BannerOptions tags={tags} />
      </PopoverContent>
    </Popover>
  );
}

export function BannerTriggerGroup(props: ButtonGroupProps) {
  const ButtonGroupSlot = props.asChild ? Slot : BannerTriggers;
  return (
    <div className="flex flex-col md:flex-row gap-y-2 md:gap-x-2">
      <ButtonGroupSlot {...props}>{props.children}</ButtonGroupSlot>
    </div>
  );
}

const _buttons: BannerTriggersProps["buttons"] = [
  { children: "Show Me", variant: "outline", type: "button", size: "sm" },
  { children: "Got it", variant: "default", type: "submit", size: "sm" },
];

const isPro = !(process.env.NEXT_PUBLIC_FEATURE_PRO === "true");

function BannerTriggers(props: React.PropsWithChildren<BannerTriggersProps>) {
  const { asChild, buttons, children, ...rest } = props;

  let btns = buttons ?? _buttons;
  if (btns && btns.length > 2) {
    btns.length = 2; // removes all buttons after the 2nd
    console.log(btns);
    console.warn("BannerTriggers: Only 2 buttons are supported");
  }

  return asChild ? (
    <Slot>{children}</Slot>
  ) : (
    <>
      {btns
        ? btns.map((btn, i) => {
            if (isPro && i === 0) {
              // only show the feature button if the user has pro subscription
              return <ShowMeButton key={i} {...btn} />;
            }
            return <Button key={i} {...btn} {...rest} />;
          })
        : null}
    </>
  );
}