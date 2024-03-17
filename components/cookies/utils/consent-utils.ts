import {setCookie } from "cookies-next";
import { cookieExpiry } from "./constants";

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
