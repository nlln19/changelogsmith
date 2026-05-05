import { loadConfig } from "../config.js";
import { buildReleaseChangelog } from "./build-release-changelog.js";
import { getMergedPullRequestsSince } from "../github/pull-requests.js";
import { getLatestRelease } from "../github/releases.js";

export async function createReleaseChangelogPreview(context) {
  const config = await loadConfig(context);
  const latestRelease = await getLatestRelease(context);

  const sinceDate = latestRelease
    ? new Date(latestRelease.published_at ?? latestRelease.created_at)
    : null;

  const mergedPullRequests = await getMergedPullRequestsSince(context, sinceDate);

  const changelog = buildReleaseChangelog(mergedPullRequests, {
    title: getReleaseChangelogTitle(latestRelease),
    sectionOrder: config.sectionOrder,
    labelSections: config.labelSections
  });

  return {
    config,
    latestRelease,
    sinceDate,
    mergedPullRequests,
    changelog
  };
}

function getReleaseChangelogTitle(latestRelease) {
  if (!latestRelease) {
    return "Release Changelog";
  }

  return `Release Changelog since ${latestRelease.tag_name}`;
}