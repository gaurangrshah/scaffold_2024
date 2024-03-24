"use client";

import { AccordionContent, AccordionTrigger } from "../../../ui/accordion";
import { Option } from "./option";
/**
 * Iterates over the current category and renders the nested options
 *
 * @export
 * @param {props} <{
 *   currentCategory: CategorizedOptions["necessary" | "analytics"] | undefined;
 *   category: string;
 *   isDisabled?: boolean;
 *   isCategoryChecked: boolean;
 *   setCookieValues: (updatedCookies: Partial<BrowserCookies>) => void;
 * }> 
 * @return {*} 
 */
export function NestedOptions({
  currentCategory,
  category,
  isDisabled,
  isCategoryChecked,
  setCookieValues,
}: {
  currentCategory: CategorizedOptions["necessary" | "analytics"] | undefined;
  category: string;
  isDisabled?: boolean;
  isCategoryChecked: boolean;
  setCookieValues: (tag: string) => (checked: boolean) => void;
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
                  tag={option}
                  label={details.label}
                  description={details.description}
                  defaultValue={details.checked}
                  isDisabled={isDisabled}
                  isCategoryChecked={isCategoryChecked}
                  setCookieValues={setCookieValues(option)}
                />
              );
            })
          : null}
      </AccordionContent>
    </>
  );
}
