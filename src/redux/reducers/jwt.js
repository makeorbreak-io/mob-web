import { SET_JWT, LOGOUT } from "action-types";

export default function jwt(state = null, action) {
  const { type, payload } = action;

  switch (type) {
  case SET_JWT:
    return payload;

  case LOGOUT:
    return null;

  default:
    return state;
  }
}
