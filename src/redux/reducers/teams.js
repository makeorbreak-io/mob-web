import { omit } from "lodash";

import {
  ADD_TEAM,
  REMOVE_TEAM,
} from "action-types";

export default function(state = {}, action) {
  const { payload, type } = action;

  switch (type) {
  case ADD_TEAM:
    return { ...state, [payload.id]: payload };

  case REMOVE_TEAM:
    return omit(state, payload.id);

  default:
    return state;
  }
}
