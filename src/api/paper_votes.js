import request, { requestFailed, submissionFailed } from "lib/http";

export const createPaperVote = (category) => {
  return request
  .post("/admin/paper_vote", { category_name: category })
  .then(response => Promise.resolve(response.data))
  .catch(requestFailed);
};

export const redeemPaperVote = (id, memberId, teamId) => {
  return request
  .post(`/admin/paper_vote/${id}/redeem`, {
    member_id: memberId,
    team_id: teamId,
  })
  .then(response => Promise.resolve(response.data))
  .catch(submissionFailed);
};

export const annulPaperVote = (id) => {
  return request
  .post(`/admin/paper_vote/${id}/annul`)
  .then(response => Promise.resolve(response))
  .catch(requestFailed);
};
