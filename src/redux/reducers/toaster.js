import { reject } from "lodash";

import {
  ADD_TOAST,
  REMOVE_TOAST,
  CLEAR_TOASTS,
} from "action-types";

export default function toaster(state = [], action) {
  const { type, payload } = action;

  switch(type) {
  case ADD_TOAST:
    return [ ...state, payload ];

  case REMOVE_TOAST:
    return reject(state, { id: payload });

  case CLEAR_TOASTS:
    return [];

  default:
      return state;
  }
}
