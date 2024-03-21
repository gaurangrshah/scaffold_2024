import { getCookie, setCookie } from "cookies-next";
import { useCallback, useState } from "react";
import {
  categorizeOptions,
  mergeCookiesWithTagDetails,
} from "../utils/cookie-conversion-utils";

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
  tags: NecessaryAnalyticsTagsTupleArrays,
  category: string
) {
  // @TODO: consume context here and expose results from context
  // manage consent updates from here as well when cookie values are updated
  const [cookies, setCookies] = useState(() => {
    return JSON.parse(getCookie(cookieName) || "{}") as BrowserCookies;
  });

  const setCookieValues = useCallback(
    (keys: string[], value: boolean) => {
      const newCookies = { ...cookies };
      for (const key of keys) {
        newCookies[key as keyof typeof newCookies] = value;
      }
      setCookie(cookieName, JSON.stringify(newCookies), {
        maxAge: 365 * 24 * 60 * 60,
      });
      setCookies(newCookies);
    },
    [cookieName, cookies]
  );

  const categorizedOptions = categorizeOptions(
    mergeCookiesWithTagDetails(tags, cookies)
  );

  const currentCategory =
    categorizedOptions[category as keyof typeof categorizedOptions];

  return { currentCategory, cookies, setCookieValues };
}
