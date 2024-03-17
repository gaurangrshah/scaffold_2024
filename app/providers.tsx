import { PropsWithChildren } from "react";
import GoogleTagManagerProvider from "@/components/cookies/tag-mgr";
import Banner from "../components/cookies/banner";

export default function Providers({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <GoogleTagManagerProvider
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
      >
        {children}
      </GoogleTagManagerProvider>
    </>
  );
}
