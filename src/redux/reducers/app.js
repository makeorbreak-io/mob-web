import { combineReducers } from "redux";
import { reducer as form } from "redux-form";

import currentUser from "./current_user";
import jwt from "./jwt";
import multistep from "./multistep";
import notifications from "./notifications";
import ready from "./ready";
import teams from "./teams";
import projects from "./projects";
import users from "./users";

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
    ready,
    teams,
    projects,
    users,

    admin,
  })(state, action);
};
