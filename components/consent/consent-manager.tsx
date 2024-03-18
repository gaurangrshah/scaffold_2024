"use client";

import {
  PropsWithChildren,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import { getCookie } from "cookies-next";
import { sendGTMEvent, GoogleTagManager } from "@next/third-parties/google";

import {
  ConsentManager,
  ConsentDispatch,
} from "@/components/consent/context/consent-manager";
import {
  setConsentCookies,
  gtagFn,
  getInitialPermissions,
  ANALYTICS_TAGS,
  CONSENT_COOKIE_NAME,
  DATA_LAYER,
  NECESSARY_TAGS,
  TAG_MANAGER_KEY,
  cookieExpiry,
  checkNecessaryTags,
  checkTargetingTags,
  convertCookieToConsent,
  convertTagsToCookies,
  redactionCookie,
  handlers,
} from "./utils";

// type AdditionalTags<T extends string> = T[]; // @TODO: add support for additional tags

export default function CookieConsentProvider({
  consentCookie = CONSENT_COOKIE_NAME, // the name of the cookie that stores the user's consent
  necessaryTags,
  analyticsTags,
  enabled = true,
  expiry = cookieExpiry,
  redact = true,
  dataLayerName = DATA_LAYER,
  gtagName = TAG_MANAGER_KEY,
  banner,
  children,
}: PropsWithChildren<{
  consentCookie: string;
  necessaryTags: NecessaryTags[];
  analyticsTags?: AnalyticsTags[];
  enabled?: boolean;
  expiry?: number;
  redact?: boolean;
  dataLayerName?: string;
  gtagName?: string;
  banner?: React.ComponentType<BannerProps>;
}>) {
  const cookies = JSON.parse(getCookie(consentCookie) || "{}"); // used by layoutEffect + hasConsent initializer
  const [hasConsent, setHasConsent] = useState<boolean>(
    enabled
    // has consent starts off as equal to enabled value
    // we use the layoutEffect to check if the user has provided consent.
  );
  const [selectedKeys] = useState<NecessaryAnalyticsTagsTupleArrays>(() => {
    // coerce tags into selectedKeys shape
    const hasNecessaryTags = necessaryTags && checkNecessaryTags(necessaryTags);
    const hasAnalyticsTags = analyticsTags && checkTargetingTags(analyticsTags);

    return [
      hasNecessaryTags ? necessaryTags : [], // necessary tags should never be empty
      hasAnalyticsTags ? analyticsTags : [], // analytics tags can be empty
    ];
  });

  useLayoutEffect(() => {
    if (!enabled) return;
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
      handlers.onSuccess("Transparency: GTM has been initialized");
    } else {
      handlers.onError("Transparency: GTM could not be initialized");
      throw new Error("Transparency: GTM requires gtag function to be defined");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, necessaryTags, redact]);

  const updateGTMConsent = useCallback(
    (consent: Record<NecessaryTags | AnalyticsTags, "granted" | "denied">) => {
      const gTag = gtagFn(dataLayerName, gtagName);
      if (typeof gTag === "function") {
        gTag("consent", "update", consent);
      } else console.warn("Transparency: gtag not found2");
    },
    [dataLayerName, gtagName]
  );

  const handleConsentUpdate = useCallback(
    (consentUpdate: Partial<Consent["primary" | "secondary"]>) => {
      try {
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
        handlers.onSuccess("Transparency: Consent updated");
      } catch (error) {
        handlers.onError("Transparency: Consent could not be updated");
        console.error(error);
      }
    },
    [consentCookie, expiry, updateGTMConsent, selectedKeys]
  );

  const Comp = banner ? banner : Slot;

  return (
    <ConsentManager.Provider value={{ tags: selectedKeys, consentCookie }}>
      <ConsentDispatch.Provider value={{ handleConsentUpdate, sendGTMEvent }}>
        {children}
        {enabled && hasConsent ? (
          <GoogleTagManager
            gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID!}
            dataLayerName={dataLayerName}
          />
        ) : enabled ? (
          <Comp hasConsent={hasConsent} />
        ) : null}
      </ConsentDispatch.Provider>
    </ConsentManager.Provider>
  );
}
/**
 * @TODO:
 * Add 3rd party tag support (use generics to support unknown tags, but still keep type-safety)
 */
