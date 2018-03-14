import { filter, map } from "lodash";

import {
  FETCH_USERS_ADMIN,
  SET_USERS_ADMIN,
  DELETE_USER_ADMIN,
  SET_USER_ROLE_ADMIN,
  SET_USER_CHECKED_IN_ADMIN,
} from "action-types";

export default function(state = [], action) {
  const { payload, type } = action;

  switch (type) {
  case SET_USERS_ADMIN:
    return payload;

  case DELETE_USER_ADMIN:
    return filter(state, (user) => user.id !== payload);

  case SET_USER_ROLE_ADMIN:
    return map(state, (user) => {
      if (user.id === payload.id) user.role = payload.role;

      return user;
    });

  case SET_USER_CHECKED_IN_ADMIN:
    return map(state, (user) => {
      if (user.id === payload.id) user.checked_in = payload.checked_in;

      return user;
    });

  case FETCH_USERS_ADMIN:
  default:
    return state;
  }
}
