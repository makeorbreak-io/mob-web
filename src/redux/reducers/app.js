import { combineReducers } from "redux";
import { reducer as form } from "redux-form";

import currentUser from "./current_user";
import jwt from "./jwt";
import multistep from "./multistep";
import notifications from "./notifications";
import posts from "./posts";
import ready from "./ready";
import teams from "./teams";
import toaster from "./toaster";
import users from "./users";
import workshops from "./workshops";
import votingInfoBegin from "./voting_info_begin";
import votingInfoEnd from "./voting_info_end";

import admin from "./admin";

import { LOGOUT } from "action-types";

export default (state, action) => {
  if (action.type === LOGOUT) {
    state = { ready: true };
  }

  return combineReducers({
    form,
    currentUser,
    jwt,
    multistep,
    notifications,
    posts,
    ready,
    teams,
    toaster,
    users,
    workshops,
    votingInfoBegin,
    votingInfoEnd,

    admin,
  })(state, action);
};
