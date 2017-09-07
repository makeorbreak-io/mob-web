import { createAction } from "redux-actions";

import request, { requestFailed, ignoreFailure } from "util/http";

import {
  FETCH_USERS_ADMIN,
  SET_USERS_ADMIN,
  DELETE_USER_ADMIN,
  SET_USER_ROLE_ADMIN,
  SET_USER_CHECKED_IN_ADMIN,
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
    .catch(requestFailed);
  };
};

export const deleteUserAdmin = (id) => {
  return (dispatch) => {
    return request
    .delete(`/admin/users/${id}`)
    .then(() => dispatch(createAction(DELETE_USER_ADMIN)(id)))
    .catch(ignoreFailure);
  };
};

export const setUserRoleAdmin = (id, role) => {
  return (dispatch) => {
    return request
    .put(`/admin/users/${id}`, { user: { role } })
    .then(() => dispatch(createAction(SET_USER_ROLE_ADMIN)({ id, role })))
    .catch(ignoreFailure);
  };
};

const setUserCheckedIn = createAction(SET_USER_CHECKED_IN_ADMIN);
export const checkInUser = (id) => {
  return (dispatch) => {
    return request
    .post(`/admin/checkin/${id}`)
    .then(response => {
      const { data } = response.data;

      dispatch(setUserCheckedIn(data));

      return Promise.resolve(data);
    })
    .catch(ignoreFailure);
  };
};

export const removeUserCheckIn = (id) => {
  return (dispatch) => {
    return request
    .delete(`/admin/checkin/${id}`)
    .then(response => {
      const { data } = response.data;

      dispatch(setUserCheckedIn(data));

      return Promise.resolve(data);
    })
    .catch(ignoreFailure);
  };
};
