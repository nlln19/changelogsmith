import { createReleaseChangelogPreview } from "../changelog/create-release-preview.js";
import { createEntryFromPullRequest } from "../changelog/create-entry.js";
import { generateChangelog } from "../changelog/generate-changelog.js";
import { upsertReleasePreviewComment } from "../github/comments.js";

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

  try {
    const preview = await createReleaseChangelogPreview(context);

    context.log.info(
      {
        repository: context.payload.repository.full_name,
        pullRequest: pullRequest.number,
        latestRelease: preview.latestRelease?.tag_name ?? null,
        sinceDate: preview.sinceDate?.toISOString() ?? null,
        mergedPullRequestCount: preview.mergedPullRequests.length,
        changelog: preview.changelog
      },
      "Generated release changelog"
    );

    if (preview.config.commentOnMergedPullRequest) {
      const singleEntry = createEntryFromPullRequest(pullRequest);

      const singlePullRequestPreview = generateChangelog([singleEntry], {
        title: preview.config.changelogTitle,
        sectionOrder: preview.config.sectionOrder,
        labelSections: preview.config.labelSections
      });

      await upsertReleasePreviewComment(
        context,
        pullRequest.number,
        [
          "## ChangelogSmith Preview",
          "",
          "This pull request would be included in the next changelog as:",
          "",
          singlePullRequestPreview,
          "",
          "---",
          "",
          "Current full release changelog preview:",
          "",
          preview.changelog
        ].join("\n")
      );
    }
  } catch (error) {
    context.log.error(
      {
        repository: context.payload.repository.full_name,
        event: context.name,
        action: context.payload.action,
        pullRequest: pullRequest.number,
        errorName: error.name,
        errorMessage: error.message,
        status: error.status,
        requestUrl: error.request?.url
      },
      "Failed to generate full release changelog"
    );

    const fallbackEntry = createEntryFromPullRequest(pullRequest);

    const fallbackChangelog = generateChangelog([fallbackEntry], {
      title: "Changelog Preview",
      sectionOrder: [
        "Breaking Changes",
        "Features",
        "Fixes",
        "Documentation",
        "Maintenance",
        "Other"
      ],
      labelSections: {
        breaking: "Breaking Changes",
        "breaking-change": "Breaking Changes",
        feature: "Features",
        enhancement: "Features",
        bug: "Fixes",
        fix: "Fixes",
        docs: "Documentation",
        documentation: "Documentation",
        chore: "Maintenance",
        maintenance: "Maintenance",
        refactor: "Maintenance",
        dependencies: "Maintenance",
        deps: "Maintenance"
      }
    });

    context.log.info(
      {
        repository: context.payload.repository.full_name,
        pullRequest: pullRequest.number,
        changelog: fallbackChangelog
      },
      "Generated fallback changelog for current pull request"
    );
  }
}