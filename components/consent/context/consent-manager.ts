import { createContext } from "react";

export const ConsentManager = createContext<
  | {
      consentCookie: string;
      tags: NecessaryAnalyticsTagsTupleArrays;
    }
  | undefined
>(undefined);

export const ConsentDispatch = createContext<{
  handleConsentUpdate: (
    consentUpdate: Partial<Consent["primary" | "secondary"]>
  ) => void;
  sendGTMEvent: (event: string, data: Record<string, string>) => void;
  setHasConsent: (hasConsent: boolean) => void;
}>({
  handleConsentUpdate: () => {},
  sendGTMEvent: () => {},
  setHasConsent: () => {},
});

export const ConsentState = createContext<{
  enabled: boolean;
  hasConsent: boolean;
}>({
  enabled: false,
  hasConsent: false,
});
