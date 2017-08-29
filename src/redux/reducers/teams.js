import { reduce, omit } from "lodash";

import {
  SET_TEAMS,
  CLEAR_TEAMS,
  ADD_TEAM,
  REMOVE_TEAM,
} from "action-types";

export default function(state = {}, action) {
  const { payload, type } = action;

  switch (type) {
  case SET_TEAMS:
    return reduce(payload, (teams, team) => ({ ...teams, [team.id]: team }), {});

  case CLEAR_TEAMS:
    return {};

  case ADD_TEAM:
    return { ...state, [payload.id]: payload };

  case REMOVE_TEAM:
    return omit(state, payload);

  default:
    return state;
  }
}
