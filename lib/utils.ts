import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getCookie, setCookie } from "cookies-next";
import { skip } from "node:test";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CONSENT_COOKIE_NAME = "app-consent";
export const DATA_LAYER = "dataLayer";
export const TAG_MANAGER_KEY = "google_tag_manager";

export const defaultCookies = [
  "security_storage",
  "functionality_storage",
  "personalization_storage",
];
export const adCookies = [
  "ad_storage",
  "analytics_storage",
  "ad_personalization",
  "ad_user_data",
];

export const redactionCookie = "ads_data_redaction";

export const cookieExpiry = 60 * 60 * 24 * 7; // Set expiration (1 week)

/**
 * @SEE: Dashboard: https://tagassistant.google.com/
 * @SEE: https://gist.github.com/dobesv/0dba69925b8975e69b3392da46063db2
 * @SEE: https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced
 * Analytics package setups up tag manager on the window as 'google_tag_manager
 * not as 'gtag' as expected by the gtag function.
 * This function is a workaround to set up the gtag function on the window
 *
 * @param {DataLayerName} dataLayerName
 * @param {GtagName} gtagName
 * @return {*}  {((..._args: any[]) => any)}
 */

export type DataLayerName = "dataLayer" | "ga4DataLayer" | "adwordsDataLayer";
export type GtagName =
  | "gtag"
  | "adwordsGtag"
  | "gtmGtag"
  | "google_tag_manager";

export type GTagFn = (
  method: string,
  event?: string,
  params?: Record<string, any>
) => void;

export const gtagFn = (
  dataLayerName: DataLayerName,
  gtagName: GtagName
): ((..._args: any[]) => any) =>
  window[gtagName] ||
  (window[gtagName] = function () {
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
export function getConsent(condition: boolean, nu: boolean = false) {
  return condition ? "granted" : "denied";
}

/**
 * Get cookies based on the cookieList
 * will return a list of cookies with a boolean value based on the consent
 * if skipConsent is true, it will return the cookies without transforming the consent
 *
 * * UNUSED
 *
 * @export
 * @param {string[]} cookieList
 * @param {boolean} [skipConsent]
 * @return {*}
 */
export function getCookies(cookieList: string[], skipConsent?: boolean) {
  if (typeof window !== "undefined" && cookieList?.length) {
    return cookieList.reduce((acc, cookie) => {
      if (skipConsent) {
        // preserve value from cookie
        return { ...acc, [cookie]: !!Number(getCookie(cookie)) };
      } else {
        // transform value to gtm consent
        return { ...acc, [cookie]: getConsent(!!Number(getCookie(cookie))) };
      }
    }, {});
  }
  return [];
}

export function getCookieConsent(appCookie: string) {
  if (typeof window !== "undefined") {
    // parse the app-consent cookie
    const cookies = JSON.parse(getCookie(appCookie) || "{}") as Consent;
    // if the cookie has any keys, transform the values to gtm consent
    if (Object.keys(cookies).length) {
      return Object.entries(cookies)?.reduce((acc, [key, value]) => {
        return { ...acc, [key]: getConsent(!!value) };
      }, {});
    }
  }
}
/**
 * Creates a consent object based on the cookies
 * This will add each cookie and its consent value to the app-consent cookie
 *
 * @export
 * @param {Consent} cookies
 * @param {string} appCookie
 */
export function setConsentCookies(cookies: Consent, appCookie: string) {
  if (typeof window !== "undefined") {
    const consentCookies = Object.assign(
      {},
      cookies?.primary ?? {},
      cookies?.secondary ?? {}
    );
    if (Object.keys(consentCookies).length) {
      setCookie(appCookie, JSON.stringify(consentCookies), {
        maxAge: cookieExpiry,
      });
    }
  }
}

/**
 * Set cookies based on the cookieList
 * will create a cookie with a maxAge of 1 year for each cookie in the list
 *
 * * UNUSED
 * 
 * @export
 * @param {string[]} cookieList
 */
export function setCookies(cookieList: string[], denied?: boolean) {
  if (typeof window !== "undefined" && cookieList?.length) {
    cookieList.forEach((cookie) => {
      setCookie(cookie, !denied ? 1 : 0, { maxAge: cookieExpiry });
    });
  } else {
    console.warn("No cookies to set");
  }
}

/**
 * Consent update event to update the consent based on the user's action
 * This function will set the cookies and update the consent based on the user's action
 * It will also update the consent in the dataLayer
 *
 * @export
 * @param {Record<string, boolean>} consent
 * @param {boolean} [update]
 */
export function consentUpdateEvent(
  consent: Record<string, boolean>,
  update?: boolean
) {
  const gTag = gtagFn("dataLayer", "google_tag_manager");
  if (typeof gTag === "function") {
    Object.entries(consent).forEach(([key, value]) => {
      setCookie("app-consent", true, { maxAge: cookieExpiry });
      setCookie(key, value ? 1 : 0, { maxAge: cookieExpiry });
      gTag("consent", update ? "update" : "default", {
        [key]: getConsent(value),
      });
    });
  } else {
    console.log("gtag not found");
    console.log("cookie not set", consent);
  }
}
