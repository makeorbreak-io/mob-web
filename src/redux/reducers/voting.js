import {
  FETCH_VOTING_INFO_BEGIN,
  SET_VOTING_INFO_BEGIN,
} from "action-types";

export default function voting(state = {}, action) {
  const { type, payload } = action;

  switch (type) {
  case SET_VOTING_INFO_BEGIN:
    return payload;

  case FETCH_VOTING_INFO_BEGIN:
  default:
    return state;
  }
}
