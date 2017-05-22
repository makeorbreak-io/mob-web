import { omit } from "lodash";

import {
  ADD_PROJECT,
  REMOVE_PROJECT,
} from "action-types";

export default function(state = {}, action) {
  const { payload, type } = action;

  switch (type) {
  case ADD_PROJECT:
    return { ...state, [payload.id]: payload };

  case REMOVE_PROJECT:
    return omit(state, payload.id);

  default:
    return state;
  }
}
