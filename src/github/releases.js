export async function getLatestRelease(context) {
  const { owner, repo } = context.repo();

  try {
    const releases = await context.octokit.paginate(
      context.octokit.rest.repos.listReleases,
      {
        owner,
        repo,
        per_page: 100
      }
    );

    const publishedReleases = releases
      .filter((release) => !release.draft)
      .sort((a, b) => {
        const dateA = new Date(releaseDate(a)).getTime();
        const dateB = new Date(releaseDate(b)).getTime();

        return dateB - dateA;
      });

    return publishedReleases[0] ?? null;
  } catch (error) {
    context.log.error(
      {
        status: error.status,
        message: error.message,
        requestUrl: error.request?.url
      },
      "Failed to list releases"
    );

    throw error;
  }
}

function releaseDate(release) {
  return release.published_at ?? release.created_at;
}