import { PropsWithChildren } from "react";
import CookieConsentProvider from "@/components/consent/consent-manager";
import Banner from "../components/consent/ui/banner";

export default function Providers({ children }: PropsWithChildren<{}>) {
  return (
    <>
      {children}
      <CookieConsentProvider
        consentCookie="app-consent"
        necessaryTags={[
          "security_storage",
          "functionality_storage",
          // "personalization_storage",
        ]}
        analyticsTags={[
          "ad_storage",
          "analytics_storage",
          "ad_personalization",
          // "ad_user_data",
        ]}
        banner={Banner}
      />
    </>
  );
}
