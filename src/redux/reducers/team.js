import { SET_TEAM } from "action-types";

export default function(state = null, action) {
  const { payload, type } = action;

  switch (type) {
  case SET_TEAM:
    return payload;

  default:
    return state;
  }
}
