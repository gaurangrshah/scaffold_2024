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

// key array expects a tuple of primary and secondary keys
type TagArray<T extends NecessaryTags | AnalyticsTags> = T[]; // Array of type T (either PKeys or SKeys)
type NecessaryAnalyticsTagsTupleArrays = [
  TagArray<NecessaryTags> | undefined,
  TagArray<AnalyticsTags> | undefined,
];

type BrowserCookies = {
  [key in NecessaryTags | AnalyticsTags]: boolean;
};
