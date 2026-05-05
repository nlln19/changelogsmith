import { handlePullRequestClosed } from "./events/pull-request-closed.js";

export default (app) => {
  app.log.info("ChangelogSmith is running.");

  app.on("pull_request.closed", handlePullRequestClosed);
};