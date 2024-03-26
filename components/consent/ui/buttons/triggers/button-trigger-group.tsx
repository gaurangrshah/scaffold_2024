import { Slot } from "@radix-ui/react-slot";
import { BannerTriggers } from "./banner-triggers";

type ButtonGroupProps = React.PropsWithChildren<{
  asChild?: boolean;
}>;

/**
 * Used as a default button group wrapper around the consent banner's interaction buttons
 * uses radix-ui's Slot primitive to allow this behavior by default as a wrapper around the children
 *
 * @export
 * @param {ButtonGroupProps} {asChild?: boolean | undefined, children: React.ReactNode}
 * @return {*}
 */
export function BannerTriggerGroup({ asChild, children }: ButtonGroupProps) {
  const ButtonGroupSlot = asChild ? Slot : BannerTriggers;
  return (
    <div className="flex flex-col md:flex-row gap-y-2 md:gap-x-2">
      <ButtonGroupSlot>{children}</ButtonGroupSlot>
    </div>
  );
}
