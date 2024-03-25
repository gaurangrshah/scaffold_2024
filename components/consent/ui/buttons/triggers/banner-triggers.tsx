"use client";

import { Slot } from "@radix-ui/react-slot";

import { Button, type ButtonProps } from "../../../../ui/button";
import { ShowMeButton } from "../show-me-btn";

import { useConsent, useConsentDispatch } from "../../../context/hooks";
import { convertTagsToCookies } from "../../../utils";

export type BannerTriggersProps = {
  buttons?: ButtonProps[];
  asChild?: boolean;
};

const _buttons: BannerTriggersProps["buttons"] = [
  { children: "Show Me", variant: "outline", type: "button", size: "sm" },
  { children: "Got it", variant: "default", type: "submit", size: "sm" },
];

const isPro = !(process.env.NEXT_PUBLIC_FEATURE_PRO === "true");

/**
 * This component renders the trigger buttons for the consent banner.
 * It orchestrates the rendering of the default buttons and also allows for the addition of custom buttons.
 * It also allows for the rendering of the buttons directly as children of the component.
 *
 * When rendering default buttons or custom configured buttons the component will assign functionality based on the button's index
 * @export
 * @type {React.PropsWithChildren<BannerTriggersProps>}
 * @param  {BannerTriggerProps} { asChild, buttons: ButtonProps[], children, ...rest }
 * @return {*} {React.ReactNode}
 */
export function BannerTriggers(
  props: React.PropsWithChildren<BannerTriggersProps>
) {
  const { asChild, buttons, children, ...rest } = props;
  const { handleConsentUpdate, setHasConsent } = useConsentDispatch();
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
                  setHasConsent(true);
                  handleConsentUpdate(convertTagsToCookies(tags));
                }}
              />
            );
          })
        : null}
    </>
  );
}
