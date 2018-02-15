import {
  FETCH_USERS,
  SET_USERS,
} from "action-types";

export default function(state = [], action) {
  const { payload, type } = action;

  switch (type) {
  case SET_USERS:
    return payload;

  case FETCH_USERS:
  default:
    return state;
  }
}
