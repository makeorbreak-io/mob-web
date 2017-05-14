import { createAction } from "redux-actions";

import {
  SET_CURRENT_USER,
  CLEAR_CURRENT_USER,
} from "action-types";

export const setCurrentUser = createAction(SET_CURRENT_USER);
export const cleatCurrentUser = createAction(CLEAR_CURRENT_USER);
