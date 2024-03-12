import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

type CookieOption = {
  label: string;
  description: string;
};

export function BannerOptions({ options }: { options: CookieOption[] }) {
  return (
    <div className="grid gap-4 p-2 min-w-2xl bg-background/40 backdrop-blur-md rounded-md z-10">
      {options?.length
        ? options.map((option, i) => {
            const isDisabled = i === 0;
            return (
              <Option
                key={option.label}
                {...option}
                disabled={isDisabled}
                className="disabled:opacity-40 disabled:hover:opacity-20"
              />
            );
          })
        : null}
    </div>
  );
}

function Option({
  label,
  description,
  disabled,
  className,
}: {
  label: string;
  description: string;
  disabled?: boolean;
  className?: string;
}) {

  
  return (
    <div className="pl-1 py-1 flex items-center space-x-4 pt-2 [&:not(:first-child)]:border-t">
      <Switch
        id={label}
        className={cn(
          "data-[state=checked]:bg-gray-700 data-[state=unchecked]:bg-gray-500",
          className
        )}
        thumb={{
          className:
            "data-[state=checked]:bg-gray-300 data-[state=unchecked]:bg-gray-400",
        }}
        disabled={disabled}
      />
      <div>
        <Label htmlFor={label} className="text-sm leading-5">
          {label}
        </Label>
        <p className="text-gray-500 dark:text-gray-400 text-xs">
          {description}
        </p>
      </div>
    </div>
  );
}
