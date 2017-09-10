import {
  FETCH_VOTING_INFO_END,
  SET_VOTING_INFO_END,
} from "action-types";

export default function votingInfoEnd(state = {}, action) {
  const { type, payload } = action;

  switch (type) {
  case SET_VOTING_INFO_END:
    return payload;

  case FETCH_VOTING_INFO_END:
  default:
    return state;
  }
}

