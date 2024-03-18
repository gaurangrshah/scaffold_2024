import { getConsent } from "./consent-utils";
import { NECESSARY_TAGS } from "./constants";

/**
 * Convert the cookie object to a consent object
 *
 * @export
 * @param {CookieConsent} cookie
 * @return {*}
 */
export function convertCookieToConsent(cookie: CookieConsent) {
  return {
    ...Object.fromEntries(
      Object.entries(cookie).map(([key, value]) => [key, getConsent(value)])
    ),
  } as Record<NecessaryTags | AnalyticsTags, "granted" | "denied">;
}


/**
 * Convert the user provided tags into a cookie object
 *
 * @param tags  NecessaryTags | TrackingTags
 * @return {*}  {Permission}
 */
export function convertTagsToCookies(
  selectedTags: NecessaryAnalyticsTagsTupleArrays
): Permission {
  const permissionResult: Permission = {};

  for (const tags of selectedTags) {
    if (tags?.length) {
      for (const tag of tags) {
        permissionResult[tag] = NECESSARY_TAGS.includes(tag);
      }
    }
  }
  return permissionResult;
}