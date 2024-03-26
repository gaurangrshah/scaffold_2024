"use client";

import { useCallback, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CookieSwitch } from "./cookie-switch";

import { useConsent, useConsentDispatch } from "../../../consent/context/hooks";
import { categoryDescriptions, tagDetails } from "../../utils/constants";
import { convertTagsToCookies } from "../../utils";
import { cn } from "@/lib/utils";

/**
 * Responsible for building up and syncing the options object from cookies with the consent manager context
 * Delegates GroupedOptions to render out the options and assign functionality.
 *
 * @export
 * @return {*} {React.ReactNode}
 */
export function BannerOptions() {
  const { setHasConsent, handleConsentUpdate } = useConsentDispatch();
  const { tags, hasConsent } = useConsent(); // provide only the options that the user has selected
  const [cookies, setCookies] = useState<Partial<BrowserCookies>>(() =>
    convertTagsToCookies(tags as NecessaryAnalyticsTagsTupleArrays)
  );

  const [NECESSARY, ANALYTICS] = tags;
  const [isChecked, setIsChecked] = useState([
    NECESSARY?.every((tag) => !!cookies[tag as keyof typeof cookies]),
    ANALYTICS?.every((tag) => !!cookies[tag as keyof typeof cookies]),
  ]);

  const updateCookiesState = useCallback(
    (cookies: Partial<BrowserCookies>) => {
      setCookies((prev) => {
        const updatedCookies = { ...prev, ...cookies };

        setIsChecked([
          NECESSARY?.every(
            (tag) => !!updatedCookies[tag as keyof typeof updatedCookies]
          ),
          ANALYTICS?.every(
            (tag) => !!updatedCookies[tag as keyof typeof updatedCookies]
          ),
        ]);
        return updatedCookies;
      });

      handleConsentUpdate(cookies);
    },
    [NECESSARY, ANALYTICS, handleConsentUpdate]
  );

  const renderSwitch = (
    tagGroup: TagArray<NecessaryTags> | TagArray<AnalyticsTags> | undefined,
    index: number
  ) => {
    const category = index ? "Analytics" : "Necessary";
    if (!tagGroup) return null;
    const isDisabled = category === "Necessary";

    return (
      <div key={category} className="p-2">
        <CookieSwitch
          type="category"
          label={category}
          description={
            categoryDescriptions[
              category.toLowerCase() as keyof typeof categoryDescriptions
            ]
          }
          isDisabled={isDisabled}
          cookieName={tagGroup[index]}
          onCheckedChange={(checked) => {
            updateCookiesState(
              tagGroup?.reduce((acc, tag) => {
                acc[tag as keyof typeof acc] = checked;
                return acc;
              }, {} as Partial<BrowserCookies>)
            );
          }}
          isChecked={!!isChecked[index]}
        />
        <Accordion type="single" collapsible>
          <AccordionItem value={category}>
            <AccordionTrigger className="text-xs">
              <p className="ml-auto pr-2">
                Show all {category.toLowerCase()} cookies
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <>
                {Array.isArray(tagGroup) &&
                  tagGroup.map((tag) => {
                    return (
                      <CookieSwitch
                        type="tag"
                        key={tag}
                        className="ml-4"
                        {...tagDetails[tag as keyof typeof tagDetails]}
                        isDisabled={isDisabled}
                        cookieName={tagGroup[index]}
                        onCheckedChange={(checked) => {
                          updateCookiesState({ [tag]: checked });
                        }}
                        isChecked={cookies[tag as keyof typeof cookies]!}
                      />
                    );
                  })}
              </>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  };

  return (
    <div className="grid gap-4 min-w-2xl">
      <div
        className={cn(
          "w-full p-2 bg-background/40 backdrop-blur-md rounded-md z-10 [&:not(:first-child)]:border-t transition-opacity duration-150"
        )}
      >
        {tags.map(renderSwitch)}
      </div>
      <div className="flex flex-row w-full p-1">
        <Button
          type="button"
          size="sm"
          className="ml-auto"
          onClick={() => {
            if (!hasConsent) {
              handleConsentUpdate(cookies);
              setHasConsent(true);
            }
          }}
        >
          Done
        </Button>
      </div>
    </div>
  );
}
