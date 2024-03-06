import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "../ui/button";
import { Slot } from "@radix-ui/react-slot";
import Link from "next/link";
import { Cookie } from "lucide-react";

type BannerProps = React.PropsWithChildren<{
  bannerClass?: string;
  asChild?: boolean;
  buttonGroup?: React.ReactNode;
  leftElement?: React.ReactNode;
} & BannerContentProps>;

export function Banner(props: BannerProps) {
  const { asChild, leftElement, buttonGroup, bannerClass, ...rest } = props;

  const ContentSlot = asChild ? Slot : BannerContent;
  const btnGroup = buttonGroup ? buttonGroup : <BannerTriggerGroup />;
  const lefty = leftElement ? leftElement : <Cookie className="w-8 h-8" />;

  return (
    <div className="fixed inset-x-0 bottom-10 max-w-3xl z-10 mx-auto">
      <div className={cn(
        "bg-muted/20 py-4 px-6 rounded-lg shadow-lg flex items-center justify-between gap-x-4 backdrop-blur-md",
        bannerClass
      )}>
        {lefty}
        <ContentSlot {...rest}>
          {props.children}
        </ContentSlot>
        {btnGroup}
      </div>
    </div>
  )
}

type BannerContentProps = React.PropsWithChildren<{
  heading?: string;
  description?: string;
  href?: string;
  label?: string;
}>

function BannerContent(props: BannerContentProps) {
  return (
    <div className="flex flex-col justify-center gap-y-2 mr-2 flex-1 text-sm">
      <strong>{props.heading ?? "Transparency"}</strong>
      <p className="">
        {props.description ?? "We use cookies to improve your experience."} By using our site, you
        agree to our{" "}
        <Link
          href={props.href ?? "/privacy"}
          className="text-primary-500 dark:text-primary-400"
        >
          {props.label ?? "privacy policy"}
        </Link>
        .
      </p>
    </div>
  )
}


type ButtonGroupProps = React.PropsWithChildren<{
  asChild?: boolean;
} & BannerTriggersProps>

export function BannerTriggerGroup(props: ButtonGroupProps) {
  const ButtonGroupSlot = props.asChild ? Slot : BannerTriggers;
  return (
    <div className="flex flex-col md:flex-row gap-y-2 md:gap-x-2">
      <ButtonGroupSlot {...props}>
        {props.children}
      </ButtonGroupSlot>
    </div>
  )
}

type BannerTriggersProps = {
  buttons?: (ButtonProps)[];
  asChild?: boolean;
}
const _buttons: BannerTriggersProps['buttons'] = [
  { children: "Show Me", variant: "outline", type: "button", size: "sm" },
  { children: "Got it", variant: "default", type: "submit", size: "sm" },
]

function BannerTriggers(props: React.PropsWithChildren<BannerTriggersProps>) {
  const { asChild, buttons, children, ...rest } = props;

  let btns = buttons ?? _buttons;
  if (btns && btns.length > 2) {
    btns.length = 2; // removes all buttons after the 2nd
    console.log(btns)
    console.warn("BannerTriggers: Only 2 buttons are supported");
  }

  return asChild ? (
    <Slot>{children}</Slot>
  ) : (
    <>
      {btns ? btns.map((btn, i) => (
        <Button key={i} {...btn} {...rest} />
      )) : null}
    </>
  );
}
