type BannerContentProps = React.PropsWithChildren<{
  heading?: string;
  description?: string;
  href?: string;
  label?: string;
}>;

type BannerProps = React.PropsWithChildren<
  {
    hasConsented: boolean;
    bannerClass?: string;
    asChild?: boolean;
    buttonGroup?: React.ReactNode;
    leftElement?: React.ReactNode;
  } & BannerContentProps
>;

type BannerTriggersProps = {
  buttons?: ButtonProps[];
  asChild?: boolean;
};

type ButtonGroupProps = React.PropsWithChildren<{
  asChild?: boolean;
}>;

type NecessaryTags =
  | "functionality_storage"
  | "personalization_storage"
  | "security_storage";

type AnalyticsTags =
  | "ad_storage"
  | "analytics_storage"
  | "ad_personalization"
  | "ad_user_data";

type NecessaryCookies = {
  [key in NecessaryTags]: boolean;
};

type AnalyticsCookies = {
  [key in AnalyticsTags]: boolean;
};

type BothCookiesType = NecessaryCookies & AnalyticsCookies;

type BrowserCookies = {
  [key in NecessaryTags | AnalyticsTags]: boolean;
};

type CategorizedCookie = {
  ["necessary"]: {
    [key in NecessaryTags]: boolean;
  };
  ["analytics"]: {
    [key in AnalyticsTags]: boolean;
  };
};

type ConsentResult = {
  [key in NecessaryTags | AnalyticsTags]: "granted" | "denied";
};

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

type AllOptions = {
  [key in NecessaryTags | AnalyticsTags]: {
    label: string;
    description: string;
    checked: boolean;
  };
};
