"use client";

import { NestedOptions } from "./nested-options";
import { Button } from "@/components/ui/button";

import { useConsent, useConsentDispatch } from "../../../consent/context/hooks";

import { NECESSARY_TAGS, categoryDescriptions } from "../../utils/constants";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { categorizeOptions, mergeCookiesWithTagDetails } from "../../utils";
import { Option } from "./option";

function validateCheckedCategories(categorizedOptions: CategorizedOptions) {
  return Object.keys(categorizedOptions).reduce(
    (acc, category) => {
      acc[category] = Object.values(
        categorizedOptions[category as keyof typeof categorizedOptions]
      ).every((value) => !!value.checked);
      return acc;
    },
    {} as Record<string, boolean>
  );
}

/**
 * Responsible for building up and syncing the options object from cookies with the consent manager context
 * Delegates GroupedOptions to render out the options and assign functionality.
 *
 * @export
 * @return {*} {React.ReactNode}
 */
export function BannerOptions() {
  const { setHasConsent, handleConsentUpdate } = useConsentDispatch();
  const { tags, consentCookie } = useConsent(); // provide only the options that the user has selected
  const [cookies, setCookies] = useState<BrowserCookies>(
    JSON.parse(getCookie(consentCookie) ?? "{}")
  );
  const [isCategoryChecked, setIsCategoryChecked] = useState<
    Record<string, boolean>
  >(() => {
    const categorizedOptions = categorizeOptions(
      mergeCookiesWithTagDetails(tags, cookies)
    );
    return validateCheckedCategories(categorizedOptions);
  });

  useEffect(() => {
    const categorizedOptions = categorizeOptions(
      mergeCookiesWithTagDetails(tags, cookies)
    );
    const newIsCategoryChecked = validateCheckedCategories(categorizedOptions);
    setIsCategoryChecked(newIsCategoryChecked);
  }, [cookies, tags]);

  return (
    <div className="grid gap-4 min-w-2xl p-2 bg-background/40 backdrop-blur-md rounded-md z-10">
      <div
        className={cn(
          "w-full pl-1 py-2 pt-2 [&:not(:first-child)]:border-t transition-opacity duration-150"
        )}
      >
        {tags.map((tagGroup, index) => {
          const isDisabled =
            tagGroup && NECESSARY_TAGS.includes(tagGroup[index]);
          const categorizedOptions = categorizeOptions(
            mergeCookiesWithTagDetails(tags, cookies)
          );
          const category = Object.keys(categorizedOptions)[index];

          return (
            <Accordion
              collapsible
              type="single"
              key={category}
            >
              {/* @TODO: show a tooltip around the entire accordion when disabled */}
              <AccordionItem
                value={category}
                className="flex flex-col space-y-2 min-w-2xl p-2 bg-background/50 rounded-md"
              >
                <div className="gap-x-4 flex items-center">
                  <Option
                    tag={category}
                    label={category}
                    description={
                      categoryDescriptions[
                        category as "necessary" | "analytics"
                      ]
                    }
                    defaultValue={
                      isCategoryChecked[
                        category as keyof typeof isCategoryChecked
                      ]
                    }
                    isCategoryChecked={
                      isCategoryChecked[
                        category as keyof typeof isCategoryChecked
                      ]
                    }
                    isDisabled={isDisabled}
                    setCookieValues={(checked: boolean) => {
                      const updates = tagGroup?.reduce((acc, tag) => {
                        acc[tag] = checked;
                        return acc;
                      }, {} as BrowserCookies);
                      handleConsentUpdate(updates!);
                      setCookies((prev) => ({ ...prev, ...updates }));
                    }}
                  />
                </div>
                <NestedOptions
                  currentCategory={
                    categorizedOptions[
                      category as keyof typeof categorizeOptions
                    ]
                  }
                  category={category}
                  isDisabled={isDisabled}
                  isCategoryChecked={
                    isCategoryChecked[
                      category as keyof typeof isCategoryChecked
                    ]
                  }
                  setCookieValues={(tag: string) => (checked: boolean) => {
                    const update = {
                      [tag]: checked,
                    } as Partial<BrowserCookies>;

                    handleConsentUpdate(update);
                    setCookies((prev) => ({ ...prev, ...update }));
                  }}
                />
              </AccordionItem>
            </Accordion>
          );
        })}
        <div className="flex flex-row w-full">
          <Button
            type="button"
            size="sm"
            className="ml-0"
            onClick={() => setHasConsent(true)}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
