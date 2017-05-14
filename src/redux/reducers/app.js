import { combineReducers } from "redux";
import { reducer as form } from "redux-form";

import currentUser from "./current_user";
import jwt from "./jwt";

export default combineReducers({
  form,
  currentUser,
  jwt,
});
