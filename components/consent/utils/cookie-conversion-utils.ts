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

export function convertTagsToCheckedState(
  tags: TagArray<NecessaryTags | AnalyticsTags>,
  checked: boolean
) {
  const permissionResult: Permission = {};

  for (const tag of tags) {
    permissionResult[tag] = checked;
  }
  return permissionResult;
}

export function categorizeCookies(cookies: Consent) {
  const primary = {} as Record<NecessaryTags, boolean>;
  const secondary = {} as Record<AnalyticsTags, boolean>;

  for (const cookie in cookies) {
    if (NECESSARY_TAGS.includes(cookie)) {
      // @ts-ignore
      primary[cookie as keyof typeof primary] = cookies[cookie];
    } else {
      // @ts-ignore
      secondary[cookie as keyof typeof secondary] = cookies[cookie];
    }
  }

  console.log({primary, secondary})

  return { primary, secondary } as Consent;
}
