const CHANGELOGSMITH_PREVIEW_MARKER = "<!-- changelogsmith:release-preview -->";

export async function createIssueComment(context, issueNumber, body) {
  const { owner, repo } = context.repo();

  await context.octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body
  });
}

export async function upsertReleasePreviewComment(context, issueNumber, body) {
  const { owner, repo } = context.repo();

  const fullBody = `${CHANGELOGSMITH_PREVIEW_MARKER}\n${body}`;

  const comments = await context.octokit.paginate(
    context.octokit.rest.issues.listComments,
    {
      owner,
      repo,
      issue_number: issueNumber,
      per_page: 100
    }
  );

  const existingComment = comments.find((comment) =>
    comment.body?.includes(CHANGELOGSMITH_PREVIEW_MARKER)
  );

  if (existingComment) {
    await context.octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existingComment.id,
      body: fullBody
    });

    return;
  }

  await context.octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body: fullBody
  });
}