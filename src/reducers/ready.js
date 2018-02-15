import {
  PERFORM_SETUP,
  SET_READY,
} from "action-types";

export default function ready(state = false, action) {
  const { type, payload } = action;

  switch (type) {
  case PERFORM_SETUP:
    return false;

  case SET_READY:
    return payload;

  default:
    return state;
  }
}
