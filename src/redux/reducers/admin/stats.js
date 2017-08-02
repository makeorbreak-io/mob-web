import {
  FETCH_STATS_ADMIN,
  SET_STATS_ADMIN,
} from "action-types";

export default function(state = {}, action) {
  const { payload, type } = action;

  switch (type) {
  case SET_STATS_ADMIN:
    return payload;

  case FETCH_STATS_ADMIN:
  default:
    return state;
  }
}
