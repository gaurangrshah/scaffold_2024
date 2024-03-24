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

type GroupedOptionsProps = {
  isDisabled?: boolean;
  className?: string;
  currentTagGroup:
    | TagArray<NecessaryTags>
    | TagArray<AnalyticsTags>
    | undefined;
  category: string;
};

type OptionProps = {
  label: string;
  description: string;
  isDisabled?: boolean;
  defaultValue?: boolean;
  className?: string;
  tag: string;
  isCategoryChecked: boolean;
  setCookieValues: (checked: boolean) => void;
};

type CookieConsentProviderProps = {
  consentCookie?: string;
  necessaryTags: NecessaryTags[];
  analyticsTags?: AnalyticsTags[];
  enabled?: boolean;
  expiry?: number;
  redact?: boolean;
  dataLayerName?: string;
  gtagName?: string;
  banner?: React.ComponentType<BannerProps>;
};

type Categories = "necessary" | "analytics";

type TagOption = {
  label: string;
  description: string;
  checked: boolean;
};

type CategorizedOptions = {
  ["necessary"]: {
    [key in NecessaryTags]: TagOption;
  };
} & {
  ["analytics"]: {
    [key in AnalyticsTags]: TagOption;
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

type AllOptions = {
  [key in NecessaryTags | AnalyticsTags]: TagOption;
};
