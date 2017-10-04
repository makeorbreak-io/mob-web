import { SubmissionError } from "redux-form";

import request from "util/http";

export const getPasswordRecoveryToken = (email) => {
  return request
  .get(`/users/password/get_token?email=${email}`, { email })
  .catch(() => Promise.resolve()); // assume all emails are valid emails, discard all errors
};

export const recoverPassword = (token, password) => {
  return request
  .post("/users/password/recover", { token, password })
  .catch(error => {
    throw new SubmissionError({ token: error.response.data.errors });
  });
};
