import {setCookie } from "cookies-next";
import { cookieExpiry } from "./constants";

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
