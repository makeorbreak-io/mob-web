import { createAction } from "redux-actions";
import { isEmpty } from "lodash";

import request, { submissionFailed, ignoreFailure } from "util/http";

import { removeNotification } from "actions/notifications";

import {
  SET_CURRENT_USER,
  CLEAR_CURRENT_USER,
  UPDATE_CURRENT_USER,
  REFRESH_CURRENT_USER,
} from "action-types";

import { TSHIRT_SIZE_NOTIFICATION_ID } from "constants/notifications";

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
      dispatch(refreshCurrentUser());

      if (!isEmpty(response.data.data.tshirt_size)) {
        dispatch(removeNotification(TSHIRT_SIZE_NOTIFICATION_ID));
      }

      return Promise.resolve(data);
    })
    .catch(submissionFailed);
  };
};

export const refreshCurrentUser = () => {
  return (dispatch) => {
    dispatch(createAction(REFRESH_CURRENT_USER)());

    return request
    .get("/me")
    .then(response => {
      const { data } = response.data;
      dispatch(setCurrentUser(data));

      return Promise.resolve(data);
    })
    .catch(ignoreFailure);
  };
};
