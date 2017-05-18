import { combineReducers } from "redux";
import { reducer as form } from "redux-form";

import currentUser from "./current_user";
import jwt from "./jwt";
import ready from "./ready";
import team from "./team";

export default combineReducers({
  form,
  currentUser,
  jwt,
  ready,
  team,
});
