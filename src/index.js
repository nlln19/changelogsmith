import { handleIssueCommentCreated } from "./events/issue-comment-created.js";
import { handlePullRequestClosed } from "./events/pull-request-closed.js";

export default (app) => {
  app.log.info("ChangelogSmith is running.");

  app.on("pull_request.closed", handlePullRequestClosed);
  app.on("issue_comment.created", handleIssueCommentCreated);
};