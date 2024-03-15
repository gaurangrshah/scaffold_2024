import {setCookie } from "cookies-next";

export const CONSENT_COOKIE_NAME = "app-consent";
export const DATA_LAYER = "dataLayer";
export const TAG_MANAGER_KEY = "gtag";

export const NECESSARY_TAGS = [
  "security_storage",
  "functionality_storage",
  "personalization_storage",
];

export const ANALYTICS_TAGS = [
  "ad_storage",
  "analytics_storage",
  "ad_personalization",
  "ad_user_data",
];

export const tagDetails: TagDetails = {
  security_storage: {
    label: "Security Related Cookies",
    description: "Cookies necessary for securely authenticating users.",
  },
  functionality_storage: {
    label: "Functionality Related Cookies",
    description: "Cookies for measuring and improving site performance.",
  },
  personalization_storage: {
    label: "Personalization Related Cookies",
    description: "Cookies for enhanced functionality and personalization.",
  },
  ad_storage: {
    label: "Personalized Marketing Related Cookies",
    description: "Cookies for targeted content delivery based on interests.",
  },
  analytics_storage: {
    label: "Analytics Related Cookies",
    description: "Cookies for measuring and improving site performance.",
  },
  ad_personalization: {
    label: "Personalization Related Cookies",
    description: "Cookies for enhanced functionality and personalization.",
  },
  ad_user_data: {
    label: "User Data Related Cookies",
    description: "Cookies for targeted content delivery based on interests.",
  },
};

export const redactionCookie = "ads_data_redaction";

export const cookieExpiry = 60 * 60 * 24 * 7; // Set expiration (1 week)

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
  } as Record<NecessaryTags | TrackingTags, "granted" | "denied">;
}

/**
 * Check if the user has opted out of all necessary tags
 * This will return a warning if the user has opted out of all necessary tags
 *
 * @param {NecessaryTags[]} tags
 * @return {*}
 */
export function checkNecessaryTags(tags: NecessaryTags[]) {
  if (!tags.length || !Array.isArray(tags)) {
    console.warn(
      "Analytics and tracking is not enabled. No necessary tags were provided. Please ensure that this was intentional"
    );
    return false;
  }
  return tags.every((tag) => {
    const isNecessaryTag = NECESSARY_TAGS.includes(tag);
    if (!isNecessaryTag) console.warn("Invalid necessary tag provided: ", tag);
    return isNecessaryTag;
  });
}

/**
 * Check if the user has opted out of all tracking tags
 * This will return a warning if the user has opted out of all tracking tags
 *
 * @param {TrackingTags[]} tags
 * @return {*}
 */
export function checkTargetingTags(tags: TrackingTags[]) {
  if (!tags.length || !Array.isArray(tags)) {
    console.warn(
      "You have opted out of all tracking tags. Please ensure that this was intentional."
    );
    return false;
  }
  return tags.every((tag) => ANALYTICS_TAGS.includes(tag));
}

type Permission = { [key: string]: boolean };
/**
 * Convert the user provided tags into a cookie object
 *
 * @param tags  NecessaryTags | TrackingTags
 * @return {*}  {Permission}
 */
export function convertTagsToCookies(
  selectedTags: NecessaryTrackingTagsTupleArrays
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

/**
 * @SEE: Dashboard: https://tagassistant.google.com/
 * @SEE: https://gist.github.com/dobesv/0dba69925b8975e69b3392da46063db2
 * @SEE: https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced
 * Analytics package setups up tag manager on the window as 'google_tag_manager
 * not as 'gtag' as expected by the gtag function.
 * This function is a workaround to set up the gtag function on the window
 *
 * @param {string} dataLayerName
 * @param {string} gtagName
 * @return {*}  {((..._args: any[]) => any)}
 */

export type GTagFn = (
  method: string,
  event?: string,
  params?: Record<string, any>
) => void;

export const gtagFn = (
  dataLayerName: string | undefined,
  gtagName: string | undefined
): ((..._args: any[]) => any) =>
  //@ts-ignore
  window[gtagName] ||
  // @ts-ignore
  (window[gtagName] = function () {
    //@ts-ignore
    (window[dataLayerName] || (window[dataLayerName] = [])).push(arguments);
  });

/**
 * GTM expected consent format is an enum of 'granted' or 'denied'
 * This is a helper function to get the consent value based on the condition
 *
 * @export
 * @param {boolean} condition
 * @return {*}
 */
export function getConsent(condition: boolean) {
  return condition ? "granted" : "denied";
}

/**
 * Creates a consent object based on the cookies
 * This will add each cookie and its consent value to the app-consent cookie
 *
 * @export
 * @param {Consent} cookies
 * @param {string} appCookie
 */
export function setConsentCookies(
  cookies: Record<string, "granted" | "denied">,
  appCookie: string,
  customExpiry?: number
) {
  if (typeof window !== "undefined") {
    setCookie(appCookie, JSON.stringify(cookies), {
      maxAge: customExpiry ?? cookieExpiry,
    });
  }
}

type PermissionResult = { [key: string]: "granted" | "denied" };
/**
 * Compare the necessary tags with the user tags
 * This will return an object with the necessary tags as keys
 * and the value as either "granted" or "denied"
 * based on the user's consent
 *
 * @export
 * @param {string[]} necessaryTags
 * @param {string[]} userTags
 * @return {*}
 * @example
 * getInitialPermissions(
 *  ["security_storage", "functionality_storage"],
 * ["security_storage", "functionality_storage"]
 * )
 *  returns
 * {
 * security_storage: "granted",
 * functionality_storage: "granted"
 * }
 *
 */
export function getInitialPermissions(
  necessaryTags: string[],
  userTags: string[]
): PermissionResult {
  const permissionResult: PermissionResult = {};

  for (const tag of [...necessaryTags, ...userTags]) {
    permissionResult[tag] =
      necessaryTags.includes(tag) && userTags.includes(tag)
        ? "granted"
        : "denied";
  }

  return permissionResult;
}
