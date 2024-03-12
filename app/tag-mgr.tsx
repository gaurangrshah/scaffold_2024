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

function convertTagsToState(tags: string[], defaultConsent: boolean) {
  return tags.reduce((acc: Record<string, boolean>, tag) => {
    acc[tag] = defaultConsent;
    return acc;
  }, {});
}

export default function GoogleTagManagerProvider({
  consentCookie = CONSENT_COOKIE_NAME, // the name of the cookie that stores the user's consent
  necessaryTags,
  analyticsTags,
  children,
}: PropsWithChildren<{
  consentCookie?: string;
  necessaryTags?: PrimaryKeys[];
  analyticsTags?: SecondaryKeys[];
}>) {
  const [cookies, setCookies] = useState<Consent>(() => {
    let _cookies = JSON.parse(getCookie(consentCookie) || "{}");
    _cookies = !!Object.keys(_cookies).length
      ? _cookies // if the user has given consent, set state from the cookie
      : {
          // if the user has not given consent, use the default consent
          primary: necessaryTags?.length
            ? convertTagsToState(necessaryTags, true) // convert the default tags to state
            : DEFAULT_CONSENT.primary,
          secondary: analyticsTags?.length
            ? convertTagsToState(analyticsTags, false) // convert the secondary tags to state
            : DEFAULT_CONSENT.secondary,
        };

    // set the cookies in the browser
    setConsentCookies(_cookies, consentCookie); // sets default consent
    if (typeof window !== "undefined") {
      // send default consent values to GTM
      const cookieConsent = getCookieConsent(consentCookie);
      const gTag = gtagFn(DATA_LAYER, TAG_MANAGER_KEY);
      if (gTag && typeof gTag === "function") {
        gTag("consent", "default", cookieConsent); // only for initial
        // console.log("sent initial consent to GTM");
      }
    }
    return _cookies;
  });

  return (
    <GoogleTagManagerContext.Provider value={cookies}>
      <GoogleTagManagerDispatch.Provider value={setCookies}>
        {Object.keys(cookies).length ||
        process.env.NEXT_PUBLIC_CURRENT_ENV === "dev" ? (
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
