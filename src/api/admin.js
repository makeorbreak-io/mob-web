import request, { requestFailed } from "util/http";

export const syncInvites = () => {
  return request
  .post("/admin/invites/sync")
  .then(() => Promise.resolve)
  .catch(() => requestFailed);
};
