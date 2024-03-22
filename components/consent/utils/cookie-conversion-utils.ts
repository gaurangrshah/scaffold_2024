import { getConsent } from "./consent-utils";
import { NECESSARY_TAGS, tagDetails } from "./constants";

/**
 * Convert the cookie object to a consent object
 *
 * @export
 * @param {BrowserCookies} cookie
 * @return {*} {Partial<ConsentResult>}
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
 * @param {NecessaryAnalyticsTagsTupleArrays} selectedTags
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
/**
 * Convert the user provided tags into a cookie object with the checked state
 *
 * @export
 * @param {(TagArray<NecessaryTags | AnalyticsTags>)} tags
 * @param {boolean} checked
 * @return {*} {BrowserCookies}
 */
export function convertTagsToCheckedState(
  tags: TagArray<NecessaryTags | AnalyticsTags>,
  checked: boolean
):BrowserCookies {
  const browserCookies = {} as BrowserCookies;

  for (const tag of tags) {
    browserCookies[tag] = checked;
  }
  return browserCookies;
}

/**
 * Categorize options based on tag category ('necessary' | 'analytics')
 *
 * @export
 * @param {Partial<AllOptions>} cookies
 * @return {*}
 */
export function categorizeOptions(
  options: Partial<AllOptions>  | BrowserCookies
): CategorizedOptions {
  const necessary = {} as CategorizedOptions["necessary"];
  const analytics = {} as CategorizedOptions["analytics"];

  for (const [key, value] of Object.entries(options)) {
    if (NECESSARY_TAGS.includes(key)) {
      necessary[key as keyof typeof necessary] = value;
    } else {
      analytics[key as keyof typeof analytics] = value;
    }
  }

  return { necessary, analytics };
}

/**
 * Merge the cookie object with the tag details object
 *
 * @export
 * @param {NecessaryAnalyticsTagsTupleArrays} tags
 * @param {BrowserCookies} cookies
 * @return {*}  {Partial<AllOptions>}
 */
export function mergeCookiesWithTagDetails(
  tags: NecessaryAnalyticsTagsTupleArrays,
  cookies: BrowserCookies
): Partial<AllOptions> {
  let options = {} as Partial<AllOptions>;
  for (const tagGroup of tags) {
    options = {
      ...options,
      ...tagGroup?.reduce((acc, tag) => {
        acc[tag as keyof typeof acc] = {
          ...tagDetails[tag as keyof typeof tagDetails],
          // checked: !!cookies[tag as keyof typeof cookies],
        };
        return acc;
      }, {} as AllOptions),
    };
  }

  return options;
}
