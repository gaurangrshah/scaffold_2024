"use client";

import { GroupedOptions } from "./grouped-options";
import { Button } from "@/components/ui/button";

import { useConsent, useConsentDispatch } from "../../../consent/context/hooks";

import { NECESSARY_TAGS } from "../../utils/constants";

/**
 * Responsible for building up and syncing the options object from cookies with the consent manager context
 * Delegates GroupedOptions to render out the options and assign functionality.
 *
 * @export
 * @return {*} {React.ReactNode}
 */
export function BannerOptions() {
  const { setHasConsent } = useConsentDispatch();
  const { tags } = useConsent();
  const titles = ["Necessary", "Analytics"]; // @TODO: add support for 3rd party tags

  return (
    <div className="grid gap-4 min-w-2xl p-2 bg-background/40 backdrop-blur-md rounded-md z-10">
      {tags.map((tagGroup, index) => {
        return (
          <GroupedOptions
            key={index}
            currentTagGroup={tagGroup}
            category={titles[index].toLowerCase()}
            isDisabled={tagGroup && NECESSARY_TAGS.includes(tagGroup[0])}
          />
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
  );
}
