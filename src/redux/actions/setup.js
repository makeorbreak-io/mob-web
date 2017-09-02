import { createAction } from "redux-actions";
import { each, isEmpty } from "lodash";

//
// Redux
import { refreshCurrentUser } from "actions/current_user";
import { logout } from "actions/authentication";
import { addNotification } from "actions/notifications";

//
// Constants
import {
  SET_READY,
  PERFORM_SETUP,
} from "action-types";

import {
  TSHIRT_SIZE_NOTIFICATION_ID,
  PRIZE_ORDER_NOTIFICATION_ID,
} from "constants/notifications";

//
// Actions
export const setReady = createAction(SET_READY);

export const performSetup = () => {
  return (dispatch) => {
    dispatch(createAction(PERFORM_SETUP)());

    return dispatch(refreshCurrentUser())
    .then(currentUser => {
      const { team } = currentUser;

      // pending invitations
      each(currentUser.invitations, i => {
        if (!i.accepted) {
          dispatch(addNotification({
            title: "Pending invitation",
            message: `${i.host.display_name} has invited you to join <link>${i.team.name}</link>`,
            id: i.id,
            link: "/account/team",
          }));
        }
      });

      // no t-shirt size selected
      if (isEmpty(currentUser.tshirt_size)) {
        dispatch(addNotification({
          title: "T-Shirt size",
          message: "Make sure you <link>select your t-shirt size</link>!",
          id: TSHIRT_SIZE_NOTIFICATION_ID,
          link: "/profile",
        }));
      }

      if (team && team.applied && isEmpty(team.prize_preference)) {
        dispatch(addNotification({
          title: "Prize order preference",
          message: "Make sure you <link>select your team's prize order preferences</link>!",
          id: PRIZE_ORDER_NOTIFICATION_ID,
          link: "/account/team",
        }));
      }

      dispatch(setReady(true));

      return Promise.resolve(currentUser);
    })
    .catch(() => {
      dispatch(logout());
      dispatch(setReady(true));
    });
  };
};
