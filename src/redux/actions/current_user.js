import { createAction } from "redux-actions";
import Promise from "bluebird";

import request, { processSubmissionError } from "util/http";

import {
  SET_CURRENT_USER,
  CLEAR_CURRENT_USER,
  UPDATE_CURRENT_USER,
} from "action-types";

export const setCurrentUser = createAction(SET_CURRENT_USER);
export const clearCurrentUser = createAction(CLEAR_CURRENT_USER);

export const updateCurrentUser = (id, params) => {
  return (dispatch) => {
    dispatch(createAction(UPDATE_CURRENT_USER)());

    return request.put(`/users/${id}`, {
      user: params,
    })
    .then(response => {
      const user = response.data.data;
      dispatch(setCurrentUser(user));

      return Promise.resolve(user);
    })
    .catch(error => Promise.reject(processSubmissionError(error)));
  };
};
