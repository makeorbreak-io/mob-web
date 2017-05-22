import { combineReducers } from "redux";
import { reducer as form } from "redux-form";

import currentUser from "./current_user";
import jwt from "./jwt";
import ready from "./ready";
import teams from "./teams";
import projects from "./projects";

export default combineReducers({
  form,
  currentUser,
  jwt,
  ready,
  teams,
  projects,
});
