import request, { submissionFailed } from "lib/http";

export const getInviteToSlack = (email) => {
  return request
  .post("/invites/invite_to_slack", { email })
  .catch(submissionFailed);
};
