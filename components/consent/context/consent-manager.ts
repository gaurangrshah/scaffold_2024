import { createContext } from "react";

export const ConsentManager = createContext<
  | {
      consentCookie: string;
      tags: NecessaryTrackingTagsTupleArrays;
    }
  | undefined
>(undefined);

export const ConsentDispatch = createContext<{
  handleConsentUpdate: (
    consentUpdate: Partial<Consent["primary" | "secondary"]>
  ) => void;
  sendGTMEvent: (event: string, data: Record<string, string>) => void;
}>({
  handleConsentUpdate: () => {},
  sendGTMEvent: () => {},
});

export const ConsentState = createContext<{
  enabled: boolean;
  hasConsent: boolean;
}>({
  enabled: false,
  hasConsent: false,
});
