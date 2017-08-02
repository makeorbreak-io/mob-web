import { combineReducers } from "redux";

import users from "./users";
import stats from "./stats";

export default combineReducers({
  users,
  stats,
});
