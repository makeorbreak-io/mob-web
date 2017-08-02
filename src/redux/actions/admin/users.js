import { createAction } from "redux-actions";
import { noop } from "lodash";

import request, { processSubmissionError } from "util/http";

import {
  FETCH_USERS_ADMIN,
  SET_USERS_ADMIN,
  DELETE_USER_ADMIN,
  SET_USER_ROLE_ADMIN,
} from "action-types";

export const setUsersAdmin = createAction(SET_USERS_ADMIN);

export const fetchUsersAdmin = () => {
  return (dispatch) => {
    dispatch(createAction(FETCH_USERS_ADMIN)());

    return request
    .get("/admin/users")
    .then(response => {
      const { data } = response.data;

      dispatch(setUsersAdmin(data));

      return Promise.resolve(data);
    })
    .catch(error => Promise.reject(processSubmissionError(error)));
  };
};

export const deleteUserAdmin = (id) => {
  return (dispatch) => {
    return request
    .delete(`/admin/users/${id}`)
    .then(() => dispatch(createAction(DELETE_USER_ADMIN)(id)))
    .catch(noop);
  };
};

export const setUserRoleAdmin = (id, role) => {
  return (dispatch) => {
    return request
    .put(`/admin/users/${id}`, { user: { role } })
    .then(() => dispatch(createAction(SET_USER_ROLE_ADMIN)({ id, role })))
    .catch(noop);
  };
};
