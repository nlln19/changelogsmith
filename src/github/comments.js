export async function createIssueComment(context, issueNumber, body) {
  const { owner, repo } = context.repo();

  await context.octokit.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body
  });
}