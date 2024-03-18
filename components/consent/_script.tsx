"use client";

// TODO: Evaluate import 'client only'
// SOURCE: https://github.com/vercel/next.js/blob/canary/packages/third-parties/src/google/gtm.tsx
// Source: https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced
// Source: https://www.simoahava.com/analytics/consent-mode-v2-google-tags/

import Script from "next/script";

type GTMParams = {
  gtmId: string;
  dataLayer?: string[];
  dataLayerName?: string;
  gtagName?: string;
  auth?: string;
  preview?: string;
};

let currDataLayerName: string | undefined = undefined;
let currGtagName: string | undefined = undefined;

export function GoogleTagManager(props: GTMParams) {
  const {
    gtmId,
    dataLayerName = "dataLayer",
    auth,
    preview,
    dataLayer,
    gtagName,
  } = props;

  if (currDataLayerName === undefined) {
    currDataLayerName = dataLayerName;
  }

  if (currGtagName === undefined) {
    currGtagName = gtagName;
  }

  const gtmLayer = dataLayerName !== "dataLayer" ? `&l=${dataLayerName}` : "";
  const gtmAuth = auth ? `&gtm_auth=${auth}` : "";
  const gtmPreview = preview ? `&gtm_preview=${preview}&gtm_cookies_win=x` : "";

  return (
    <>
      <Script
        id="_next-gtm-init"
        dangerouslySetInnerHTML={{
          __html: `
      (function(w,l,g){
        w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
        ${dataLayer ? `w[l].push(${JSON.stringify(dataLayer)})` : ""}
      })(window,'${dataLayerName}');`,
        }}
        strategy="worker"
      />
      <Script
        id="_next-gtm"
        data-ntpc="GTM"
        src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}${gtmLayer}${gtmAuth}${gtmPreview}`}
      />
    </>
  );
}

export const sendGTMEvent = (data: Object) => {
  if (currDataLayerName === undefined) {
    console.warn(`Transparency: GTM has not been initialized`);
    return;
  }

  // @ts-ignore
  if (window[currDataLayerName]) {
    // @ts-ignore
    window[currDataLayerName].push(data);
  } else {
    console.warn(
      `Transparency: GTM dataLayer ${currDataLayerName} does not exist`
    );
  }
};
