import { createAction } from "redux-actions";
// import { each, isEmpty } from "lodash";

//
// Redux
// import { refreshCurrentUser } from "actions/current_user";
// import { logout } from "actions/authentication";
// import { addNotification } from "actions/notifications";

//
// Constants
import {
  SET_READY,
  // PERFORM_SETUP,
} from "action-types";

// import {
//   TSHIRT_SIZE_NOTIFICATION_ID,
//   PRIZE_ORDER_NOTIFICATION_ID,
//   GITHUB_ACCOUNT_NOTIFICATION_ID,
// } from "constants/notifications";

//
// Actions
export const setReady = createAction(SET_READY);

export const performSetup = () => (dispatch) => dispatch(setReady(true));
