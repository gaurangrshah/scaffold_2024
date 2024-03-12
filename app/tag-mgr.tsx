"use client";

import { PropsWithChildren, useState, createContext, useContext } from "react";
import { getCookie } from "cookies-next";
import { GoogleTagManager } from "@next/third-parties/google";

import {
  getCookieConsent,
  gtagFn,
  CONSENT_COOKIE_NAME,
  setConsentCookies,
  TAG_MANAGER_KEY,
  DATA_LAYER,
} from "@/lib/google-tag-manager/utils";

const DEFAULT_CONSENT = {
  primary: {
    security_storage: true,
    functionality_storage: true,
    personalization_storage: true,
  },
  secondary: {
    ad_storage: false,
    analytics_storage: false,
    ad_personalization: false,
    ad_user_data: false,
  },
};

// Create a new contexts
const GoogleTagManagerContext = createContext<Consent | undefined>(undefined);
const GoogleTagManagerDispatch = createContext<
  React.Dispatch<Consent> | undefined
>(undefined);

export default function GoogleTagManagerProvider({
  consentCookie = CONSENT_COOKIE_NAME, // the name of the cookie that stores the user's consent
  defaultConsent = DEFAULT_CONSENT.primary,
  secondaryConsent = DEFAULT_CONSENT.secondary,
  children,
}: PropsWithChildren<{
  consentCookie?: string;
  defaultConsent?: Consent["primary"];
  secondaryConsent?: Consent["secondary"];
}>) {
  const [biscuits, setBiscuits] = useState<Consent>(() => {
    let _cookies = JSON.parse(getCookie(consentCookie) || "{}");
    _cookies = !!Object.keys(_cookies).length
      ? _cookies // if the user has given consent, set state from the cookie
      : {
          // if the user has not given consent, use the default consent
          primary: defaultConsent ?? DEFAULT_CONSENT.primary,
          secondary: secondaryConsent ?? DEFAULT_CONSENT.secondary,
        };

    // set the cookies in the browser
    setConsentCookies(_cookies, consentCookie); // sets default consent
    if (typeof window !== "undefined") {
      // send default consent values to GTM
      const cookieConsent = getCookieConsent(consentCookie);
      const gTag = gtagFn(DATA_LAYER, TAG_MANAGER_KEY);
      if (gTag && typeof gTag === "function") {
        gTag("consent", "default", cookieConsent); // only for initial
        console.log("sent initial consent to GTM");
      }
    }
    return _cookies;
  });

  return (
    <GoogleTagManagerContext.Provider value={biscuits}>
      <GoogleTagManagerDispatch.Provider value={setBiscuits}>
        {Object.keys(biscuits).length ? (
          <GoogleTagManager
            gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID!}
          />
        ) : null}
        {children}
      </GoogleTagManagerDispatch.Provider>
    </GoogleTagManagerContext.Provider>
  );
}

export function useGTM() {
  const context = useContext(GoogleTagManagerContext);
  if (context === undefined) {
    throw new Error(
      "useGoogleTagManager must be used within a GoogleTagManagerProvider"
    );
  }
  return context;
}

export function useGTMDispatch() {
  const context = useContext(GoogleTagManagerDispatch);
  if (context === undefined) {
    throw new Error(
      "useGoogleTagManagerDispatch must be used within a GoogleTagManagerProvider"
    );
  }
  return context;
}
