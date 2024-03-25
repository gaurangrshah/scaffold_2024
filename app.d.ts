

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
