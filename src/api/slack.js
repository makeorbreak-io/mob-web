import request, { submissionFailed } from "util/http";

export const getInviteToSlack = (email) => {
  return request
  .post("/invites/invite_to_slack", { email })
  .then(() => Promise.resolve())
  .catch(submissionFailed);
};
