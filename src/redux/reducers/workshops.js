import { omit, clone, reduce } from "lodash";

import {
  SET_WORKSHOPS,
  CREATE_WORKSHOP,
  UPDATE_WORKSHOP,
  DELETE_WORKSHOP,
  JOIN_WORKSHOP,
  LEAVE_WORKSHOP,
} from "action-types";

export default function workshops(state = {}, action) {
  const { type, payload } = action;
  const clonedState = clone(state);

  switch (type) {
    case SET_WORKSHOPS:
      return reduce(payload, (all, ws) => ({ ...all, [ws.slug]: ws }), {});

    case CREATE_WORKSHOP:
      return { ...state, [payload.slug]: payload };

    case UPDATE_WORKSHOP:
      return { ...state, [payload.slug]: payload };

    case DELETE_WORKSHOP:
      return omit(state, payload);

    case JOIN_WORKSHOP:
      clonedState[payload].participants++;
      return clonedState;

    case LEAVE_WORKSHOP:
      clonedState[payload].participants--;
      return clonedState;

    default:
      return state;
  }
}
