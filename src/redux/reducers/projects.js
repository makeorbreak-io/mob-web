import { reduce, omit } from "lodash";

import {
  SET_PROJECTS,
  CLEAR_PROJECTS,
  ADD_PROJECT,
  REMOVE_PROJECT,
} from "action-types";

export default function(state = {}, action) {
  const { payload, type } = action;

  switch (type) {
  case SET_PROJECTS:
    return reduce(payload, (projects, project) => ({ ...projects, [project.id]: project }), {});

  case CLEAR_PROJECTS:
    return {};

  case ADD_PROJECT:
    return { ...state, [payload.id]: payload };

  case REMOVE_PROJECT:
    return omit(state, payload.id);

  default:
    return state;
  }
}
