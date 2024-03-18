"use client";

import { Slot } from "@radix-ui/react-slot";

import { Button } from "../../../ui/button";
import { ShowMeButton } from "./show-me-btn";

import { useConsent, useConsentDispatch } from "../../context/hooks";
import { convertTagsToCookies } from "../../utils";

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
  const { handleConsentUpdate } = useConsentDispatch();
  const { tags } = useConsent();

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
            return (
              <Button
                key={i}
                {...btn}
                {...rest}
                onClick={() => {
                  handleConsentUpdate(convertTagsToCookies(tags));
                }}
              />
            );
          })
        : null}
    </>
  );
}
