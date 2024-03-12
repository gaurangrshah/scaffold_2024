type ConsentType = "primary" | "secondary";

type PrimaryKeys =
  | "functionality_storage"
  | "personalization_storage"
  | "security_storage";

type SecondaryKeys =
  | "ad_storage"
  | "analytics_storage"
  | "ad_personalization"
  | "ad_user_data";

type Consent = {
  primary: Record<PrimaryKeys, boolean>;
  secondary: Record<SecondaryKeys, boolean>;
};

type CookieConsent = {
  [key: PrimaryKeys | SecondaryKeys]: boolean;
};
