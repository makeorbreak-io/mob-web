import {
  SET_VOTING_STATUS,
} from "action-types";

export default function(state = false, action) {
  const { payload, type } = action;

  switch (type) {
    case SET_VOTING_STATUS:
      return payload;

    default:
      return state;
  }
}
