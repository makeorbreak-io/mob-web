import {
  SET_CURRENT_USER,
  CLEAR_CURRENT_USER,
  LOGOUT,
} from "action-types";

export default function currentUser(state = null, action) {
  const { payload, type } = action;

  switch (type) {
  case SET_CURRENT_USER:
    return payload;

  case CLEAR_CURRENT_USER:
  case LOGOUT:
    return null;

  default:
    return state;
  }
}
