import { combineReducers } from "redux";

import users from "./users";
import stats from "./stats";
import votingStatus from "./voting_status";

export default combineReducers({
  users,
  stats,
  votingStatus,
});
