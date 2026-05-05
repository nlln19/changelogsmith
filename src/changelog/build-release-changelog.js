import { createEntryFromPullRequest } from "./create-entry.js";
import { generateChangelog } from "./generate-changelog.js";

export function buildReleaseChangelog(pullRequests, options) {
  const entries = pullRequests.map((pullRequest) =>
    createEntryFromPullRequest(pullRequest)
  );

  return generateChangelog(entries, options);
}
