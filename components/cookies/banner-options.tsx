"use client";

import { getCookie } from "cookies-next";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useGTMDispatch } from "@/components/cookies/context";

import { cn } from "@/lib/utils";
import { NECESSARY_TAGS, ANALYTICS_TAGS, tagDetails } from "./utils/consent-utils";

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
            category={titles[index]}
          />
        );
      })}
    </div>
  );
}
export function GroupedOptions({
  isDisabled,
  className,
  tagGroup,
  category,
  options,
}: {
  isDisabled?: boolean;
  className?: string;
  tagGroup: TagArray<NecessaryTags> | TagArray<TrackingTags> | undefined;
  category: string;
  options: AllOptions;
}) {
  const categoryDescriptions = {
    Necessary: "These cookies are essential for the website to function",
    Analytics:
      "These cookies help us to improve your experience on our website",
  };

  const isCategoryChecked = tagGroup?.every((tag) => options[tag].checked);
  return (
    <div
      className={cn(
        isDisabled && "hover:opacity-80 hover:cursor-not-allowed",
        "w-full pl-1 py-2 pt-2 [&:not(:first-child)]:border-t transition-opacity duration-150"
      )}
    >
      <div className={cn(isDisabled ? "hover:opacity-40" : "")}>
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
                Show all {category} Cookies
              </h4>
            </AccordionTrigger>
            <AccordionContent className="min-w-2xl pl-9">
              {tagGroup?.map((tag: NecessaryTags | TrackingTags) => {
                const details = options[tag];
                return (
                  <Option
                    key={tag}
                    tag={tag}
                    label={details.label}
                    description={details.description}
                    defaultValue={details.checked}
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

export function Option({
  label,
  description,
  isDisabled,
  defaultValue,
  className,
  tag,
}: {
  label: string;
  description: string;
  isDisabled?: boolean;
  defaultValue?: boolean;
  className?: string;
  tag: string;
}) {
  const { handleConsentUpdate } = useGTMDispatch();
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
        defaultChecked={defaultValue}
        onCheckedChange={(checked) => {
          handleConsentUpdate({ [tag]: checked });
        }}
      />
      <div className={cn(isDisabled ? "hover:opacity-40" : "")}>
        <Label htmlFor={label} className="text-sm leading-9">
          {label}
        </Label>
        <p className="text-gray-500 dark:text-gray-400 text-xs">
          {description}
        </p>
      </div>
    </div>
  );
}
