import { DEFAULT_CONFIG, loadConfig } from "../config.js";
import { buildReleaseChangelog } from "../changelog/build-release-changelog.js";
import { createEntryFromPullRequest } from "../changelog/create-entry.js";
import { generateChangelog } from "../changelog/generate-changelog.js";
import { createIssueComment } from "../github/comments.js";
import { getMergedPullRequestsSince } from "../github/pull-requests.js";
import { getLatestRelease } from "../github/releases.js";

export async function handlePullRequestClosed(context) {
  const pullRequest = context.payload.pull_request;

  if (!pullRequest.merged) {
    context.log.info(
      {
        repository: context.payload.repository.full_name,
        pullRequest: pullRequest.number
      },
      "Pull request closed without merge"
    );

    return;
  }

  const config = await safeLoadConfig(context);

  try {
    const releaseChangelog = await buildFullReleaseChangelog(context, config);

    context.log.info(
      {
        repository: context.payload.repository.full_name,
        pullRequest: pullRequest.number,
        changelog: releaseChangelog.changelog,
        latestRelease: releaseChangelog.latestRelease,
        sinceDate: releaseChangelog.sinceDate,
        mergedPullRequestCount: releaseChangelog.mergedPullRequestCount
      },
      "Generated release changelog"
    );

    if (config.commentOnMergedPullRequest) {
      await commentWithReleasePreview(
        context,
        pullRequest,
        config,
        releaseChangelog.changelog
      );
    }
  } catch (error) {
    logHandlerError(context, error);

    const fallbackChangelog = buildSinglePullRequestFallback(
      pullRequest,
      config
    );

    context.log.info(
      {
        repository: context.payload.repository.full_name,
        pullRequest: pullRequest.number,
        changelog: fallbackChangelog
      },
      "Generated fallback changelog for current pull request"
    );

    if (config.commentOnMergedPullRequest) {
      await createIssueComment(
        context,
        pullRequest.number,
        [
          "## ChangelogSmith",
          "",
          "Could not generate the full release changelog, so this is a fallback preview for the current pull request:",
          "",
          fallbackChangelog
        ].join("\n")
      );
    }
  }
}

async function safeLoadConfig(context) {
  try {
    return await loadConfig(context);
  } catch (error) {
    context.log.warn(
      {
        status: error.status,
        message: error.message
      },
      "Falling back to default config"
    );

    return DEFAULT_CONFIG;
  }
}

async function buildFullReleaseChangelog(context, config) {
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
    changelog,
    latestRelease: latestRelease?.tag_name ?? null,
    sinceDate: sinceDate?.toISOString() ?? null,
    mergedPullRequestCount: mergedPullRequests.length
  };
}

function buildSinglePullRequestFallback(pullRequest, config) {
  const entry = createEntryFromPullRequest(pullRequest);

  return generateChangelog([entry], {
    title: config.changelogTitle,
    sectionOrder: config.sectionOrder,
    labelSections: config.labelSections
  });
}

async function commentWithReleasePreview(
  context,
  pullRequest,
  config,
  releaseChangelog
) {
  const singlePullRequestPreview = buildSinglePullRequestFallback(
    pullRequest,
    config
  );

  await createIssueComment(
    context,
    pullRequest.number,
    [
      "## ChangelogSmith",
      "",
      "This pull request would be included in the next changelog as:",
      "",
      singlePullRequestPreview,
      "",
      "---",
      "",
      "Current full release changelog preview:",
      "",
      releaseChangelog
    ].join("\n")
  );
}

function getReleaseChangelogTitle(latestRelease) {
  if (!latestRelease) {
    return "Release Changelog";
  }

  return `Release Changelog since ${latestRelease.tag_name}`;
}

function logHandlerError(context, error) {
  context.log.error(
    {
      repository: context.payload.repository.full_name,
      event: context.name,
      action: context.payload.action,
      pullRequest: context.payload.pull_request?.number,
      errorName: error.name,
      errorMessage: error.message,
      status: error.status,
      requestMethod: error.request?.method,
      requestUrl: error.request?.url
    },
    "Failed to generate full release changelog"
  );
}
