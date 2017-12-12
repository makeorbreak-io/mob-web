import {
  SET_MEDIUM_POSTS,
} from "action-types";

export default function(state = {}, action) {
  const { payload, type } = action;

  switch (type) {
    case SET_MEDIUM_POSTS:
      return payload;

    default:
      return state;
  }
}
