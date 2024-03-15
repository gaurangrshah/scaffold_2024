import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { Cookie } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "../ui/button";

import { GroupedOptions, ShowMeButton } from "./banner-options";
import { getCookie } from "cookies-next";
import { ANALYTICS_TAGS, NECESSARY_TAGS, tagDetails } from "./utils";

type BannerProps = React.PropsWithChildren<
  {
    bannerClass?: string;
    asChild?: boolean;
    buttonGroup?: React.ReactNode;
    leftElement?: React.ReactNode;
  } & BannerContentProps
>;

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

type BannerContentProps = React.PropsWithChildren<{
  heading?: string;
  description?: string;
  href?: string;
  label?: string;
}>;

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

type ButtonGroupProps = React.PropsWithChildren<
  {
    asChild?: boolean;
  } & BannerTriggersProps
>;

export function BannerTriggerGroup(props: ButtonGroupProps) {
  const ButtonGroupSlot = props.asChild ? Slot : BannerTriggers;
  return (
    <div className="flex flex-col md:flex-row gap-y-2 md:gap-x-2">
      <ButtonGroupSlot {...props}>{props.children}</ButtonGroupSlot>
    </div>
  );
}

type BannerTriggersProps = {
  buttons?: ButtonProps[];
  asChild?: boolean;
};

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

export function BannerOptions({
  tags,
}: {
  tags: NecessaryTrackingTagsTupleArrays;
}) {
  const titles = ["Necessary", "Analytics"]; // @TODO: add support for 3rd party tags
  const cookies = JSON.parse(
    getCookie("app-consent") || "{}"
  ) as BrowserCookies;

  const options = {
    ...NECESSARY_TAGS.reduce((acc: any, tag: string) => {
      acc[tag as keyof typeof acc] = {
        ...tagDetails[tag as keyof typeof tagDetails],
        checked: cookies[tag as keyof typeof cookies],
      };
      return acc as AllOptions;
    }, {}),
    ...ANALYTICS_TAGS.reduce((acc: any, tag: string) => {
      acc[tag as keyof typeof acc] = {
        ...tagDetails[tag as keyof typeof tagDetails],
        checked: cookies[tag as keyof typeof cookies],
      };
      return acc as AllOptions;
    }, {}),
  };
  return (
    <div className="grid gap-4 min-w-2xl p-2 bg-background/40 backdrop-blur-md rounded-md z-10">
      {tags.map((tagGroup, index) => {
        return (
          <GroupedOptions
            key={index}
            tagGroup={tagGroup}
            options={options}
            description=""
            tags={tags}
            category={titles[index]}
          />
        );
      })}
    </div>
  );
}
