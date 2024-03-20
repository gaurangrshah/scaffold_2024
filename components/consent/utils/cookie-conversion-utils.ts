import { getConsent } from "./consent-utils";
import { NECESSARY_TAGS } from "./constants";

/**
 * Convert the cookie object to a consent object
 *
 * @export
 * @param {BothCookies} cookie
 * @return {*}
 */
export function convertCookieToConsent(
  cookie: BrowserCookies
): Partial<ConsentResult> {
  return {
    ...Object.fromEntries(
      Object.entries(cookie).map(([key, value]) => [key, getConsent(value)])
    ),
  };
}

/**
 * Convert the user provided tags into a cookie object
 *
 * @param tags  NecessaryTags | TrackingTags
 * @return {*}  {Permission}
 */
export function convertTagsToCookies(
  selectedTags: NecessaryAnalyticsTagsTupleArrays
): Partial<BrowserCookies> {
  const cookies = {} as BrowserCookies;

  for (const tags of selectedTags) {
    if (tags?.length) {
      for (const tag of tags) {
        if (tag in NECESSARY_TAGS) {
          cookies[tag] = NECESSARY_TAGS.includes(tag);
        } else {
          cookies[tag] = false;
        }
      }
    }
  }
  return cookies;
}

export function convertTagsToCheckedState(
  tags: TagArray<NecessaryTags | AnalyticsTags>,
  checked: boolean
) {
  const browserCookies = {} as BrowserCookies;

  for (const tag of tags) {
    browserCookies[tag] = checked;
  }
  return browserCookies;
}

// export function categorizeCookies(cookies: Consent) {
//   const necessary = {} as Record<NecessaryTags, boolean>;
//   const analytics = {} as Record<AnalyticsTags, boolean>;

//   for (const cookie in cookies) {
//     if (NECESSARY_TAGS.includes(cookie)) {
//       // @ts-ignore
//       necessary[cookie as keyof typeof primary] = cookies[cookie];
//     } else {
//       // @ts-ignore
//       analytics[cookie as keyof typeof secondary] = cookies[cookie];
//     }
//   }

//   console.log({ necessary, analytics });

//   return { necessary, analytics } as CategorizedCookie;
// }
