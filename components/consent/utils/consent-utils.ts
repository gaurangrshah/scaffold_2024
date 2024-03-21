import { setCookie } from "cookies-next";
import { cookieExpiry } from "./constants";

/**
 * GTM expected consent format is an enum of 'granted' or 'denied'
 * This is a helper function to get the consent value based on the condition
 *
 * @export
 * @param condition {boolean}
 * @return "granted" | "denied"
 */
export function getConsent(condition: boolean) {
  return condition ? "granted" : "denied";
}

/**
 * Creates a consent object based on the cookies
 * This will add each cookie and its consent value to the app-consent cookie
 *
 * @export
 * @param {ConsentResult} cookies 
 * @param {string} appCookie 
 * @param {number} [customExpiry]
 * @return void {*}
 */
export function setConsentCookies(
  cookies: ConsentResult,
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
 * @param  {string[]} necessaryTags
 * @param  {string[]} userTags
 * @return ConsentResult {*}
 * 
 *
 */
export function getInitialPermissions(
  necessaryTags: string[],
  userTags: string[]
): ConsentResult {
  const consentResult = {} as ConsentResult;

  for (const tag of [...necessaryTags, ...userTags]) {
    consentResult[tag as keyof ConsentResult] =
      necessaryTags.includes(tag) && userTags.includes(tag)
        ? "granted"
        : "denied";
  }

  return consentResult;
}
