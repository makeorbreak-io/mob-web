import { createAction } from "redux-actions";

import {
  SET_JWT,
  LOGOUT,
} from "action-types";

export const setJWT = createAction(SET_JWT);
export const logout = createAction(LOGOUT);
