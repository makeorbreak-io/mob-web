import { LOGOUT } from "action-types";

export default function authentication(state = {}, action) {
  const { type } = action;

  switch (type) {
  case LOGOUT:
    return {};

  default:
    return state;
  }
}
