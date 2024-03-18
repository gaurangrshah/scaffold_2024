"use client";

import { getCookie } from "cookies-next";

import { GroupedOptions } from "./grouped-options";

import { useConsent } from "../../../consent/context/hooks";
import {
  NECESSARY_TAGS,
  ANALYTICS_TAGS,
  tagDetails,
} from "../../utils/constants";

export function BannerOptions() {
  const { tags } = useConsent();
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
