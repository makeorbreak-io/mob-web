import { createAction } from "redux-actions";

import request, { processSubmissionError } from "util/http";

import {
  SET_CURRENT_USER,
  CLEAR_CURRENT_USER,
  UPDATE_CURRENT_USER,
  REFRESH_CURRENT_USER,
} from "action-types";

export const setCurrentUser = createAction(SET_CURRENT_USER);
export const clearCurrentUser = createAction(CLEAR_CURRENT_USER);

export const updateCurrentUser = (id, params) => {
  return (dispatch) => {
    dispatch(createAction(UPDATE_CURRENT_USER)());

    return request
    .put(`/users/${id}`, {
      user: params,
    })
    .then(response => {
      const { data } = response.data;
      dispatch(setCurrentUser(data));

      return Promise.resolve(data);
    })
    .catch(error => Promise.reject(processSubmissionError(error)));
  };
};

export const refreshCurrentUser = () => {
  return (dispatch) => {
    dispatch(createAction(REFRESH_CURRENT_USER)());

    return request
    .get("/me")
    .then(response => {
      const user = response.data;
      dispatch(setCurrentUser(user));

      return Promise.resolve(user);
    });
  };
};
