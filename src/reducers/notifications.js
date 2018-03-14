import { reject } from "lodash";

import {
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  CLEAR_NOTIFICATIONS,
} from "action-types";

export default function notifications(state = [], action) {
  const { type, payload } = action;

  switch (type) {
  case ADD_NOTIFICATION:
    return [ ...state, payload ];

  case REMOVE_NOTIFICATION:
    return reject(state, { id: payload });

  case CLEAR_NOTIFICATIONS:
    return [];

  default:
    return state;
  }
}

