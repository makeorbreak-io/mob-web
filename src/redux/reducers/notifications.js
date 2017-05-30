import { reject } from "lodash";

import {
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  CLEAR_NOTIFICATIONS,
} from "action-types";

export default function notifications(state = [], action) {
  switch (action.type) {
  case ADD_NOTIFICATION:
    return [ ...state, action.payload ];
  case REMOVE_NOTIFICATION:
    return reject(state, { id: action.payload });
  case CLEAR_NOTIFICATIONS:
    return [];
  default:
    return state;
  }
}

