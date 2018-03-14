import { createAction } from "redux-actions";
import { parse, isBefore } from "date-fns";
// import { each, isEmpty } from "lodash";

//
// Redux
// import { refreshCurrentUser } from "actions/current_user";
// import { logout } from "actions/authentication";
import { addNotification } from "actions/notifications";

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

export const performSetup = () => (dispatch) => {

  // MoB session March 15, 2018
  if (isBefore(new Date(), parse("2018-03-15T19:00:00"))) {
    dispatch(addNotification({
      title: "MoB Session, March 15th, 18:00",
      message: "Don't miss our first ever MoB Session, March 15, at Blip. Doors open at 6p.m. and entrance is free (no application needed).\nMore info at <link>https://www.facebook.com/events/154653598682051</link>",
      link: "https://www.facebook.com/events/154653598682051",
    }));
  }

  dispatch(setReady(true));
};
