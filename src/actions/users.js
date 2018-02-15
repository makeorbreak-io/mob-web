import { createAction } from "redux-actions";

import request, { requestFailed } from "lib/http";

import {
  FETCH_USERS,
  SET_USERS,
} from "action-types";

export const setUsers = createAction(SET_USERS);

export const fetchUsers = () => {
  return (dispatch) => {
    dispatch(createAction(FETCH_USERS)());

    return request
    .get("/users")
    .then(response => {
      const { data } = response.data;

      dispatch(setUsers(data));

      return Promise.resolve(data);
    })
    .catch(requestFailed);
  };
};
