import { createReleaseChangelogPreview } from "../changelog/create-release-preview.js";
import { upsertReleasePreviewComment } from "../github/comments.js";

const PREVIEW_COMMANDS = ["/changelogsmith preview", "/cs preview"];

export async function handleIssueCommentCreated(context) {
  const commentBody = context.payload.comment.body.trim();

  if (!isPreviewCommand(commentBody)) {
    return;
  }

  const issue = context.payload.issue;

  if (!issue.pull_request) {
    await safeUpsertReleasePreviewComment(
      context,
      issue.number,
      [
        "## ChangelogSmith",
        "",
        "This command currently works on pull requests only."
      ].join("\n")
    );

    return;
  }

  try {
    const preview = await createReleaseChangelogPreview(context);

    await safeUpsertReleasePreviewComment(
      context,
      issue.number,
      formatPreviewComment(preview)
    );

    context.log.info(
      {
        repository: context.payload.repository.full_name,
        issue: issue.number,
        latestRelease: preview.latestRelease?.tag_name ?? null,
        sinceDate: preview.sinceDate?.toISOString() ?? null,
        mergedPullRequestCount: preview.mergedPullRequests.length
      },
      "Created release changelog preview from comment command"
    );
  } catch (error) {
    context.log.error(
      {
        repository: context.payload.repository.full_name,
        issue: issue.number,
        errorName: error.name,
        errorMessage: error.message,
        status: error.status,
        requestUrl: error.request?.url
      },
      "Failed to create release changelog preview from comment command"
    );

    await safeUpsertReleasePreviewComment(
      context,
      issue.number,
      [
        "## ChangelogSmith",
        "",
        "Failed to generate the release changelog preview.",
        "",
        "```txt",
        error.message,
        "```"
      ].join("\n")
    );
  }
}

async function safeUpsertReleasePreviewComment(context, issueNumber, body) {
  try {
    await upsertReleasePreviewComment(context, issueNumber, body);
  } catch (error) {
    context.log.error(
      {
        repository: context.payload.repository.full_name,
        issue: issueNumber,
        errorName: error.name,
        errorMessage: error.message,
        status: error.status,
        requestUrl: error.request?.url
      },
      "ChangelogSmith could not write a comment. Check GitHub App permissions."
    );
  }
}

function isPreviewCommand(commentBody) {
  const normalized = commentBody.toLowerCase();

  return PREVIEW_COMMANDS.includes(normalized);
}

function formatPreviewComment(preview) {
  const releaseInfo = preview.latestRelease
    ? `Latest release: \`${preview.latestRelease.tag_name}\``
    : "Latest release: _none found_";

  const sinceInfo = preview.sinceDate
    ? `Changes since: \`${preview.sinceDate.toISOString()}\``
    : "Changes since: _beginning of repository_";

  return [
    "## ChangelogSmith Preview",
    "",
    releaseInfo,
    sinceInfo,
    `Merged pull requests: \`${preview.mergedPullRequests.length}\``,
    "",
    "---",
    "",
    preview.changelog
  ].join("\n");
}