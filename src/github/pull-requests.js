export async function getMergedPullRequestsSince(context, sinceDate) {
  const { owner, repo } = context.repo();

  try {
    const pullRequests = await context.octokit.paginate(
      context.octokit.rest.pulls.list,
      {
        owner,
        repo,
        state: "closed",
        sort: "updated",
        direction: "desc",
        per_page: 100
      }
    );

    return pullRequests
      .filter((pullRequest) => pullRequest.merged_at)
      .filter((pullRequest) => {
        if (!sinceDate) {
          return true;
        }

        return new Date(pullRequest.merged_at) > sinceDate;
      })
      .sort((a, b) => {
        return (
          new Date(a.merged_at).getTime() - new Date(b.merged_at).getTime()
        );
      });
  } catch (error) {
    context.log.error(
      {
        status: error.status,
        message: error.message,
        requestUrl: error.request?.url
      },
      "Failed to list pull requests"
    );

    throw error;
  }
}