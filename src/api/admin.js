import request, { ignoreFailure } from "lib/http";

export const syncInvites = () => {
  return request
  .post("/admin/invites/sync")
  .then(() => Promise.resolve())
  .catch(ignoreFailure);
};

export const createTeamRepo = (id) => {
  return request
  .post(`/admin/teams/${id}/repo`)
  .then(() => Promise.resolve())
  .catch(ignoreFailure);
};

export const addTeamToRepo = (id) => {
  return request
  .post(`/admin/teams/${id}/repo/add_users`)
  .then(() => Promise.resolve())
  .catch(ignoreFailure);
};
