"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../ui/accordion";
import { Switch } from "../../../ui/switch";
import { Label } from "../../../ui/label";
import { Option } from "./option";

import { cn } from "@/lib/utils";
import { useConsentDispatch } from "../../context/hooks";
import {
  ANALYTICS_TAGS,
  NECESSARY_TAGS,
  convertTagsToCheckedState,
} from "../../utils";
import { useBrowserCookies } from "../../hooks/use-cookies";

/**
 * It will receive the categorized options from the BannerOptions component and renders them
 * with each category toggle and a an accordion, which shows the granular controls.
 *
 * @export
 * @param {GroupedOptionsProps} {
 *   isDisabled?: boolean; className?: string; currentTagGroup: TagArray<NecessaryTags> | TagArray<AnalyticsTags> | undefined; category: string
 * }
 * @return {*} {React.ReactNode}
 */
export function GroupedOptions(props: GroupedOptionsProps) {
  const { isDisabled, className, currentTagGroup, category } = props;
  const { handleConsentUpdate } = useConsentDispatch();
  const categoryDescriptions = {
    Necessary: "These cookies are essential for the website to function",
    Analytics:
      "These cookies help us to improve your experience on our website",
  };

  const { currentCategory } = useBrowserCookies(
    "app-consent", // @TODO: replace with value from consent manager context
    [NECESSARY_TAGS, ANALYTICS_TAGS] as NecessaryAnalyticsTagsTupleArrays,
    category
  );

  const isCategoryChecked =
    currentCategory &&
    Object.keys(currentCategory).every(
      (option) =>
        (currentCategory[option as keyof typeof currentCategory] as Option)
          ?.checked
    );
  return (
    <div
      className={cn(
        isDisabled && "hover:opacity-80 hover:cursor-not-allowed",
        "w-full pl-1 py-2 pt-2 [&:not(:first-child)]:border-t transition-opacity duration-150"
      )}
    >
      <div className={cn(isDisabled ? "hover:opacity-40" : "")}>
        {/* @TODO: show a tooltip around the entire accordion when disabled */}
        <Accordion collapsible type="single">
          <AccordionItem
            value={category}
            className="flex flex-col space-y-2 min-w-2xl p-2 bg-background/50 rounded-md"
          >
            <div className="flex items-center gap-x-4">
              <Switch
                id={category}
                className={cn(
                  "data-[state=checked]:bg-gray-700 data-[state=unchecked]:bg-gray-500",
                  className,
                  "shadow-md dark:shadow-gray-600"
                )}
                thumb={{
                  className:
                    "data-[state=checked]:bg-gray-300 data-[state=unchecked]:bg-gray-400",
                }}
                disabled={isDisabled}
                defaultChecked={isCategoryChecked}
                onCheckedChange={(checked) => {
                  handleConsentUpdate(
                    convertTagsToCheckedState(currentTagGroup!, checked)
                  );
                }}
              />
              <div className="w-full">
                <Label htmlFor={category} className="text-lg leading-9">
                  {category}
                </Label>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  {categoryDescriptions[category as "Necessary" | "Analytics"]}
                </p>
              </div>
            </div>
            <AccordionTrigger>
              <h4 className="w-[400px] text-xs text-right font-semibold text-neutral opacity-70 leading-loose py-1 border rounded pr-2">
                View all {category} cookies
              </h4>
            </AccordionTrigger>
            <AccordionContent className="min-w-2xl pl-9">
              {currentCategory &&
                Object.entries(currentCategory)?.map(([option, details]) => {
                  return (
                    <Option
                      key={option}
                      tag={option}
                      label={details.label}
                      description={details.description}
                      defaultValue={details.checked}
                      isDisabled={isDisabled}
                    />
                  );
                })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
