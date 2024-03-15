type CookieCategory = "primary" | "secondary";

type NecessaryTags =
  | "functionality_storage"
  | "personalization_storage"
  | "security_storage";

type TrackingTags =
  | "ad_storage"
  | "analytics_storage"
  | "ad_personalization"
  | "ad_user_data";

type NecessaryCookies = Record<NecessaryTags, boolean>;
type TrackingCookies = Record<TrackingTags, boolean>;
type EitherCookiesType = NecessaryCookies | TrackingCookies;
type Consent = {
  primary: NecessaryCookies;
  secondary: TrackingCookies;
};

type CookieConsent = Record<NecessaryTags | TrackingTags, boolean>;

type TagDetails = {
  [key in NecessaryTags | TrackingTags]: {
    label: string;
    description: string;
  };
};

// key array expects a tuple of primary and secondary keys
type TagArray<T extends NecessaryTags | TrackingTags> = T[]; // Array of type T (either PKeys or SKeys)
type NecessaryTrackingTagsTupleArrays = [
  TagArray<NecessaryTags> | undefined,
  TagArray<TrackingTags> | undefined,
];

type BrowserCookies = NecessaryCookies & TrackingCookies;

type AllOptions = {
  [key in NecessaryTags | TrackingTags]: {
    label: string;
    description: string;
    checked: boolean;
  };
};
