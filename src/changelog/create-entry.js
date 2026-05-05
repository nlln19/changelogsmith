export function createEntryFromPullRequest(pullRequest) {
  return {
    title: normalizeTitle(pullRequest.title),
    number: pullRequest.number,
    url: pullRequest.html_url,
    author: pullRequest.user?.login ?? "unknown",
    mergedAt: pullRequest.merged_at,
    labels: pullRequest.labels.map((label) => label.name)
  };
}

function normalizeTitle(title) {
  return title.trim().replace(/\s+/g, " ");
}