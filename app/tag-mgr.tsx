"use client";

import {
  adCookies,
  defaultCookies,
  setCookies,
  getCookies,
  gtagFn,
  CONSENT_COOKIE_NAME,
} from "@/lib/utils";
import { GoogleTagManager, sendGTMEvent } from "@next/third-parties/google";
import { getCookie } from "cookies-next";
import { PropsWithChildren, useEffect, useLayoutEffect, useState } from "react";



export default function GoogleTagManagerWrapper({
  consentCookie = CONSENT_COOKIE_NAME, // the name of the cookie that stores the user's consent
  defaultConsent = defaultCookies,
  secondaryConsent = adCookies,
  children,
}: PropsWithChildren<{
  consentCookie?: string;
  defaultConsent?: string[];
  secondaryConsent?: string[];
}>) {
  // starts off true, but will be set to false if the user has not given consent
  // this will prevent the GoogleTagManager component from being mounted
  // and allows us to fire the consent event before the GoogleTagManager component is mounted
  const [isEnabled, setIsEnabled] = useState(true);

  useLayoutEffect(() => {
    // use Layout Effect to ensure that the gtag function is available
    // before the GoogleTagManager component is mounted
    // This is important because the GoogleTagManager component uses the gtag function
    // to send import { getCookies } from '@/lib/analytics/utils';
    // the initial consent to Google Tag Manager and most fire before any other tags are read

    // check if the user has already given consent
    const consent = !!getCookie(consentCookie);
    if (!consent) {
      setCookies([...defaultConsent]);
      setCookies([...secondaryConsent], true);
    }
    if (typeof window !== "undefined") {
      // if the user has not given consent, send the default consent to Google Tag Manager
      const gTag = gtagFn("dataLayer", "google_tag_manager");
      if (gTag) {
        gTag("consent", "default", {
          ...getCookies([...defaultCookies, ...adCookies]),
        });
      }
    }
    // set the isEnabled state based on the consent
    setIsEnabled(consent);
    // This ensures that the consent event is fired before the GoogleTagManager component is mounted
    // This is important because the GoogleTagManager component uses the gtag function
    // to send the initial consent to Google Tag Manager and must fire before any other tags are read
  }, [consentCookie, defaultConsent, secondaryConsent]);

  return (
    <>
      {isEnabled ? (
        <GoogleTagManager
          gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID!}
        />
      ) : null}
      {children}
    </>
  );
}
