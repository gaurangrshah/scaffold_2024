"use client";

import {
  PropsWithChildren,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import { getCookie } from "cookies-next";
import { sendGTMEvent, GoogleTagManager } from "@next/third-parties/google";

import {
  CONSENT_COOKIE_NAME,
  setConsentCookies,
  TAG_MANAGER_KEY,
  DATA_LAYER,
  NECESSARY_TAGS,
  ANALYTICS_TAGS,
  cookieExpiry,
  gtagFn,
  getInitialPermissions,
  redactionCookie,
  convertCookieToConsent,
  checkNecessaryTags,
  checkTargetingTags,
  convertTagsToCookies,
} from "@/components/cookies/utils";
import {
  GoogleTagManagerContext,
  GoogleTagManagerDispatch,
} from "@/components/cookies/context";
import dynamic from "next/dynamic";

const DynamicBanner = dynamic(() => import("@/components/cookies/banner"), {
  ssr: false,
});

// type AdditionalTags<T extends string> = T[]; // @TODO: add support for additional tags

export default function GoogleTagManagerProvider<T>({
  consentCookie = CONSENT_COOKIE_NAME, // the name of the cookie that stores the user's consent
  necessaryTags,
  analyticsTags,
  // additionalTags, // @TODO: add support for additional tags
  enabled = true,
  expiry = cookieExpiry,
  redact = true,
  dataLayerName = DATA_LAYER,
  gtagName = TAG_MANAGER_KEY,

  children,
}: PropsWithChildren<{
  consentCookie: string;
  necessaryTags: NecessaryTags[];
  analyticsTags?: TrackingTags[];
  // additionalTags?: AdditionalTags<string>; // @TODO: add support for additional tags
  enabled?: boolean;
  expiry?: number;
  redact?: boolean;
  dataLayerName?: string;
  gtagName?: string;
}>) {
  // has consent starts off as true. If the user has not provided initialConsent, then the
  // we use the layoutEffect
  const cookies = JSON.parse(getCookie(consentCookie) || "{}");
  const [hasConsent, setHasConsent] = useState<boolean>(
    enabled && !!Object.keys(cookies).length
  );
  const [selectedKeys] = useState<NecessaryTrackingTagsTupleArrays>(() => {
    const hasNecessaryTags = necessaryTags && checkNecessaryTags(necessaryTags);
    const hasAnalyticsTags = analyticsTags && checkTargetingTags(analyticsTags);

    return [
      hasNecessaryTags ? necessaryTags : [], // necessary tags should never be empty
      hasAnalyticsTags ? analyticsTags : [], // analytics tags can be empty
    ];
  });

  useLayoutEffect(() => {
    const gtag = gtagFn(DATA_LAYER, TAG_MANAGER_KEY);
    if (typeof gtag === "function") {
      // set the default consent based on the user provided initialConsent
      // if the user has not provided any initialConsent, then the default consent will be set to 'denied' for all tags
      const defaultConsent = getInitialPermissions(necessaryTags, [
        ...NECESSARY_TAGS,
        ...ANALYTICS_TAGS,
      ]);
      gtag("consent", "default", defaultConsent);
      redact && gtag("set", redactionCookie, true);

      setHasConsent(!!Object.keys(cookies).length);
    } else {
      throw new Error("Transparency: GTM requires gtag function to be defined");
    }
    // layout effect should only run when these dependencies change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, necessaryTags, redact]);

  const updateGTMConsent = useCallback(
    (consent: Record<NecessaryTags | TrackingTags, "granted" | "denied">) => {
      const gTag = gtagFn(dataLayerName, gtagName);
      if (typeof gTag === "function") {
        gTag("consent", "update", consent);
      } else console.warn("Transparency: gtag not found2");
    },
    [dataLayerName, gtagName]
  );

  const handleConsentUpdate = useCallback(
    (consentUpdate: Partial<Consent["primary" | "secondary"]>) => {
      setHasConsent(true);
      const _cookies = JSON.parse(getCookie(consentCookie) || "{}");

      const _updatedCookie = {
        ...convertTagsToCookies(selectedKeys),
        ..._cookies,
        ...consentUpdate,
      };

      // update the consent cookie
      setConsentCookies(_updatedCookie, consentCookie, expiry);
      // transform_updatedCookie  to consent
      const consent = convertCookieToConsent(_updatedCookie);
      // update the consent in GTM
      updateGTMConsent(consent);
    },
    [consentCookie, expiry, updateGTMConsent, selectedKeys]
  );

  return (
    <GoogleTagManagerContext.Provider
      value={{ tags: selectedKeys, consentCookie }}
    >
      <GoogleTagManagerDispatch.Provider
        value={{ handleConsentUpdate, sendGTMEvent }}
      >
        {children}
        {enabled && hasConsent ? (
          <GoogleTagManager
            gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID!}
            dataLayerName={dataLayerName}
          />
        ) : (
          <DynamicBanner />
        )}
      </GoogleTagManagerDispatch.Provider>
    </GoogleTagManagerContext.Provider>
  );
}
/**
 * @TODO:
 * Add 3rd party tag support (use generics to support unknown tags, but still keep type-safety)
 */
