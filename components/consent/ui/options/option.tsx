"use client";

import { Switch } from "../../../ui/switch";
import { Label } from "../../../ui/label";

import { cn } from "@/lib/utils";
/**
 * Responsible for rendering the individual granular options and assigning the functionality to sync
 * with consent-manager context
 *
 * @export
 * @param {OptionProps} <{
 *   label: string;
 *   description: string;
 *   isDisabled?: boolean;
 *   defaultValue?: boolean;
 *   className?: string;
 *   isCategoryChecked: boolean;
 *   setCookieValue: (cookieUpdates: Partial<BrowserCookies>) => void
 * }>
 * @return {*} {React.ReactNode}
 */
export function Option(
  props: OptionProps
) {
  const {
    label,
    description,
    isDisabled,
    defaultValue,
    className,
    isCategoryChecked,
    setCookieValues,
  } = props;

  return (
    <div
      className={cn(
        isDisabled && "hover:opacity-80 hover:cursor-not-allowed",
        "pl-1 py-2 flex items-center space-x-4 pt-2 [&:not(:first-child)]:border-t transition-opacity duration-150"
      )}
    >
      <Switch
        id={label}
        className={cn(
          "data-[state=checked]:bg-gray-700 data-[state=unchecked]:bg-gray-500",
          className,
          // "disabled:opacity-80 disabled:hover:opacity-40",
          "shadow-md dark:shadow-gray-600"
        )}
        thumb={{
          className:
            "data-[state=checked]:bg-gray-300 data-[state=unchecked]:bg-gray-400",
        }}
        disabled={isDisabled}
        defaultChecked={isCategoryChecked ?? defaultValue}
        onCheckedChange={setCookieValues}
      />
      <div className={cn(isDisabled ? "hover:opacity-40" : "")}>
        <Label htmlFor={label} className="text-sm leading-9 capitalize">
          {label}
        </Label>
        <p className="text-gray-500 dark:text-gray-400 text-xs">
          {description}
        </p>
      </div>
    </div>
  );
}
