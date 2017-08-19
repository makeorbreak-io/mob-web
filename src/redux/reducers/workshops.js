import { filter } from "lodash";

import {
  SET_WORKSHOPS,
  CREATE_WORKSHOP,
  UPDATE_WORKSHOP,
  DELETE_WORKSHOP,
  JOIN_WORKSHOP,
  LEAVE_WORKSHOP,
} from "action-types";

export default function workshops(state = [], action) {
  const { type, payload } = action;

  switch (type) {
    case SET_WORKSHOPS:
      return payload;

    case CREATE_WORKSHOP:
      return [ ...state, payload ];

    case UPDATE_WORKSHOP:
      return state.map(workshop => {
        return workshop.slug === payload.slug
        ? payload
        : workshop;
      });

    case DELETE_WORKSHOP:
      return filter(state, workshop => workshop.slug !== payload);

    case JOIN_WORKSHOP:
      return state.map(workshop => {
        if (workshop.slug === payload) {
          workshop.participants++;
        }

        return workshop;
      });

    case LEAVE_WORKSHOP:
      return state.map(workshop => {
        if (workshop.slug === payload) {
          workshop.participants--;
        }

        return workshop;
      });

    default:
      return state;
  }
}
