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
import { useConsent, useConsentDispatch } from "../../context/hooks";
import {
  ANALYTICS_TAGS,
  NECESSARY_TAGS,
  categorizeOptions,
  categoryDescriptions,
  convertTagsToCheckedState,
  mergeCookiesWithTagDetails,
} from "../../utils";
import { useBrowserCookies } from "../../hooks/use-cookies";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { getCookie } from "cookies-next";

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
  const { consentCookie, tags } = useConsent();
  const { handleConsentUpdate } = useConsentDispatch();

  const [_cookies, _setCookies] = useState(() => {
    return JSON.parse(getCookie(consentCookie) || "{}") as BrowserCookies;
  });
  const categorizedOptions = categorizeOptions(
    mergeCookiesWithTagDetails(tags, _cookies)
  );

  const currentCategory =
    categorizedOptions[category as keyof typeof categorizedOptions];

  const [isCategoryChecked, setIsCategoryChecked] = useState(() => {
    return (
      currentCategory &&
      Object.values(
        categorizeOptions(_cookies)[category as keyof typeof categorizedOptions]
      ).every((value) => !!value)
    );
  });

  useEffect(() => {
    setIsCategoryChecked(
      !!Object.values(
        categorizeOptions(_cookies)[category as keyof typeof categorizedOptions]
      ).every((value) => !!value)
    );
  }, [_cookies, category]);

  const setCookieValues = useCallback(
    (keys: string[], value: boolean) => {
      const newCookies = {} as BrowserCookies;
      for (const key of keys) {
        newCookies[key as keyof typeof newCookies] = value;
      }
      handleConsentUpdate(newCookies);
      _setCookies((prev) => {
        Object.values(
          categorizeOptions({ ...prev, ...newCookies })[
            category as keyof typeof categorizedOptions
          ]
        ).every((value) => !!value);
        console.log("newCookies", newCookies);
        return { ...prev, ...newCookies };
      });
    },
    [handleConsentUpdate, category]
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
                  setCookieValues(currentTagGroup!, checked);
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
            <NestedOptions
              key={JSON.stringify(_cookies)}
              currentCategory={currentCategory}
              category={category}
              isDisabled={isDisabled}
              isCategoryChecked={isCategoryChecked}
              setCookieValues={setCookieValues}
              _cookies={_cookies}
            />
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

function NestedOptions({
  currentCategory,
  category,
  isDisabled,
  isCategoryChecked,
  setCookieValues,
  _cookies,
}: {
  currentCategory: CategorizedOptions["necessary" | "analytics"] | undefined;
  category: string;
  isDisabled?: boolean;
  isCategoryChecked: boolean;
  setCookieValues: (keys: string[], value: boolean) => void;
  _cookies: BrowserCookies;
}) {
  return (
    <>
      <AccordionTrigger>
        <h4 className="w-[400px] text-xs text-right font-semibold text-neutral opacity-70 leading-loose py-1 border rounded pr-2">
          View all {category} cookies
        </h4>
      </AccordionTrigger>
      <AccordionContent className="min-w-2xl pl-9">
        {currentCategory
          ? Object.entries(currentCategory)?.map(([option, details]) => {
              return (
                <Option
                  key={option}
                  // key={`${option}-${isCategoryChecked}`} // used to trigger the re-render when the checked state changes
                  tag={option}
                  label={details.label}
                  description={details.description}
                  defaultValue={_cookies[option as keyof typeof _cookies]}
                  isDisabled={isDisabled}
                  isCategoryChecked={isCategoryChecked}
                  setCookieValues={setCookieValues}
                />
              );
            })
          : null}
      </AccordionContent>
    </>
  );
}
