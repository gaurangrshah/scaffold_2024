export const CONSENT_COOKIE_NAME = "app-consent";
export const DATA_LAYER = "dataLayer";
export const TAG_MANAGER_KEY = "gtag";

export const background =
  "bg-muted/20 py-4 px-6 rounded-lg shadow-lg flex items-center justify-between gap-x-4 backdrop-blur-md";

export const NECESSARY_TAGS = [
  "security_storage",
  "functionality_storage",
  "personalization_storage",
];

export const ANALYTICS_TAGS = [
  "ad_storage",
  "analytics_storage",
  "ad_personalization",
  "ad_user_data",
];

export const tagDetails: TagDetails = {
  security_storage: {
    label: "Security Related Cookies",
    description: "Cookies necessary for securely authenticating users.",
  },
  functionality_storage: {
    label: "Functionality Related Cookies",
    description: "Cookies for measuring and improving site performance.",
  },
  personalization_storage: {
    label: "Personalization Related Cookies",
    description: "Cookies for enhanced functionality and personalization.",
  },
  ad_storage: {
    label: "Personalized Marketing Related Cookies",
    description: "Cookies for targeted content delivery based on interests.",
  },
  analytics_storage: {
    label: "Analytics Related Cookies",
    description: "Cookies for measuring and improving site performance.",
  },
  ad_personalization: {
    label: "Personalization Related Cookies",
    description: "Cookies for enhanced functionality and personalization.",
  },
  ad_user_data: {
    label: "User Data Related Cookies",
    description: "Cookies for targeted content delivery based on interests.",
  },
};

export const categoryDescriptions = {
  Necessary: "These cookies are essential for the website to function",
  Analytics:
    "These cookies help us to improve your experience on our website",
};

export const titles = ["Necessary", "Analytics"]; // @TODO: add support for 3rd party tags


export const redactionCookie = "ads_data_redaction";

export const cookieExpiry = 60 * 60 * 24 * 7; // Set expiration (1 week)
