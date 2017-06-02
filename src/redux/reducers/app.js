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

export default combineReducers({
  form,
  currentUser,
  jwt,
  multistep,
  notifications,
  ready,
  teams,
  projects,
  users,
});
