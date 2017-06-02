import { createAction } from "redux-actions";
import { SubmissionError } from "redux-form";

//
// util
import request, { processSubmissionError } from "util/http";

import {
  LOGIN,
  SIGNUP,
  LOGOUT,
  SET_JWT,
} from "action-types";

import { performSetup } from "actions/setup";

export const setJWT = createAction(SET_JWT);
export const logout = createAction(LOGOUT);

export const login = (email, password) => {
  return (dispatch) => {
    dispatch(createAction(LOGIN)());

    return request
    .post("/login", { email, password })
    .then(response => {
      const { jwt, user } = response.data.data;

      dispatch(setJWT(jwt));
      dispatch(performSetup());

      return Promise.resolve(user);
    })
    .catch(() => Promise.reject(new SubmissionError({ password: "Invalid email / password" })));
  };
};

export const signup = (email, password) => {
  return (dispatch) => {
    dispatch(createAction(SIGNUP)());

    return request
    .post("/users", { user: { email, password }})
    .then(response => {
      const { jwt, user } = response.data.data;

      dispatch(setJWT(jwt));
      dispatch(performSetup());

      return Promise.resolve(user);
    })
    .catch(error => Promise.reject(processSubmissionError(error)));
  };
};
