import { getCookie, setCookie } from "cookies-next";
import { useCallback, useMemo, useState } from "react";
import {
  categorizeOptions,
  mergeCookiesWithTagDetails,
} from "../utils/cookie-conversion-utils";
import { useConsent, useConsentDispatch } from "../context";

/**
 * Manages the browser cookies for the consent component
 * exposes helpers to manage and display cookie consent values and details
 *
 * @export
 * @param {string} cookieName
 * @param {NecessaryAnalyticsTagsTupleArrays} tags
 * @param {string} category
 * @return {*} {currentCategory: Partial<AllOptions>, cookies: BrowserCookies, setCookieValues: (keys: string[], value: boolean) => void}
 */
export function useBrowserCookies(
  cookieName: string,
  // tags: NecessaryAnalyticsTagsTupleArrays,
  category: string
) {
  // @TODO: consume context here and expose results from context
  // manage consent updates from here as well when cookie values are updated
  const [cookies, setCookies] = useState(() => {
    return JSON.parse(getCookie(cookieName) || "{}") as BrowserCookies;
  });

  const { tags } = useConsent();
  const { handleConsentUpdate } = useConsentDispatch();

  const setCookieValues = useCallback(
    (keys: string[], value: boolean) => {
      const newCookies = {} as BrowserCookies;
      for (const key of keys) {
        newCookies[key as keyof typeof newCookies] = value;
      }
      handleConsentUpdate(newCookies);
      setCookies((prev) => ({ ...prev, ...newCookies }));
    },
    [handleConsentUpdate]
  );

  // const { currentCategory, isCategoryChecked } = useMemo(() => {
  //   const categorizedOptions = categorizeOptions(
  //     mergeCookiesWithTagDetails(tags, cookies)
  //   );

  //   const currentCategory =
  //     categorizedOptions[category as keyof typeof categorizedOptions];

  //   const isCategoryChecked =
  //     currentCategory &&
  //     Object.keys(currentCategory).every(
  //       (option) =>
  //         (currentCategory[option as keyof typeof currentCategory] as Option)
  //           ?.checked
  //     );
  //   return { currentCategory, isCategoryChecked };
  // }, [cookies, tags, category]);

  return {
    // currentCategory, isCategoryChecked,
    cookies,
    setCookieValues,
  };
}
