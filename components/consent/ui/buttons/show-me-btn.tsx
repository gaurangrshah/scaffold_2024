import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import { Button, ButtonProps } from "../../../ui/button";
import { background } from "./../banner";
import { BannerOptions } from "./../options";

import { cn } from "@/lib/utils";

export function ShowMeButton({ btn, ...rest }: { btn?: ButtonProps }) {
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
        <BannerOptions />
      </PopoverContent>
    </Popover>
  );
}
