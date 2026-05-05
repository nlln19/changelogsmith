import { loadConfig } from "../config.js";
import { createEntryFromPullRequest } from "../changelog/create-entry.js";
import { generateChangelog } from "../changelog/generate-changelog.js";
import { createIssueComment } from "../github/comments.js";

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

  const config = await loadConfig(context);
  const entry = createEntryFromPullRequest(pullRequest);

  const changelog = generateChangelog([entry], {
    title: config.changelogTitle,
    sectionOrder: config.sectionOrder,
    labelSections: config.labelSections
  });

  context.log.info(
    {
      repository: context.payload.repository.full_name,
      pullRequest: pullRequest.number,
      changelog
    },
    "Generated changelog preview for merged pull request"
  );

  if (config.commentOnMergedPullRequest) {
    await createIssueComment(
      context,
      pullRequest.number,
      [
        "## ChangelogSmith",
        "",
        "This pull request would be included in the next changelog as:",
        "",
        changelog
      ].join("\n")
    );
  }
}