import { ANALYTICS_TAGS, NECESSARY_TAGS } from "./constants";

/**
 * Check if the user has opted out of all necessary tags
 * This will return a warning if the user has opted out of all necessary tags
 *
 * @param {NecessaryTags[]} tags
 * @return {*}
 */
export function checkNecessaryTags(tags: NecessaryTags[]) {
  if (!tags.length || !Array.isArray(tags)) {
    console.warn(
      "Analytics and tracking is not enabled. No necessary tags were provided. Please ensure that this was intentional"
    );
    return false;
  }
  return tags.every((tag) => {
    const isNecessaryTag = NECESSARY_TAGS.includes(tag);
    if (!isNecessaryTag) console.warn("Invalid necessary tag provided: ", tag);
    return isNecessaryTag;
  });
}

/**
 * Check if the user has opted out of all tracking tags
 * This will return a warning if the user has opted out of all tracking tags
 *
 * @param {AnalyticsTags[]} tags
 * @return {*}
 */
export function checkTargetingTags(tags: AnalyticsTags[]) {
  if (!tags.length || !Array.isArray(tags)) {
    console.warn(
      "You have opted out of all tracking tags. Please ensure that this was intentional."
    );
    return false;
  }
  return tags.every((tag) => ANALYTICS_TAGS.includes(tag));
}
