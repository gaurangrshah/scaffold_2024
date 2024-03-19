type BannerProps = React.PropsWithChildren<
  {
    hasConsented: boolean;
    bannerClass?: string;
    asChild?: boolean;
    buttonGroup?: React.ReactNode;
    leftElement?: React.ReactNode;
  } & BannerContentProps
>;

type BannerContentProps = React.PropsWithChildren<{
  heading?: string;
  description?: string;
  href?: string;
  label?: string;
}>;

type BannerTriggersProps = {
  buttons?: ButtonProps[];
  asChild?: boolean;
};

type ButtonGroupProps = React.PropsWithChildren<
  {
    asChild?: boolean;
  } & BannerTriggersProps
>;

type Permission = { [key: string]: boolean };
type PermissionResult = { [key: string]: "granted" | "denied" };

type CookieCategory = "primary" | "secondary";

type NecessaryTags =
  | "functionality_storage"
  | "personalization_storage"
  | "security_storage";

type AnalyticsTags =
  | "ad_storage"
  | "analytics_storage"
  | "ad_personalization"
  | "ad_user_data";

type NecessaryCookies = Record<NecessaryTags, boolean>;
type AnalyticsCookies = Record<AnalyticsTags, boolean>;
type EitherCookiesType = NecessaryCookies | AnalyticsCookies;
type Consent = {
  primary: NecessaryCookies;
  secondary: AnalyticsCookies;
};

type CookieConsent = Record<NecessaryTags | AnalyticsTags, boolean>;

type TagDetails = {
  [key in NecessaryTags | AnalyticsTags]: {
    label: string;
    description: string;
  };
};

// key array expects a tuple of primary and secondary keys
type TagArray<T extends NecessaryTags | AnalyticsTags> = T[]; // Array of type T (either PKeys or SKeys)
type NecessaryAnalyticsTagsTupleArrays = [
  TagArray<NecessaryTags> | undefined,
  TagArray<AnalyticsTags> | undefined,
];

type BrowserCookies = NecessaryCookies & AnalyticsCookies;

type AllOptions = {
  [key in NecessaryTags | AnalyticsTags]: {
    label: string;
    description: string;
    checked: boolean;
  };
};
