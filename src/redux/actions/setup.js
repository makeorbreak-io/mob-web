import { createAction } from "redux-actions";
import { each } from "lodash";

//
// Redux
import { refreshCurrentUser } from "actions/current_user";
import { logout } from "actions/authentication";
import { addNotification } from "actions/notifications";

//
// Util
import { displayName } from "util/user";

//
// Constants
import {
  SET_READY,
  PERFORM_SETUP,
} from "action-types";

//
// Actions
export const setReady = createAction(SET_READY);

export const performSetup = () => {
  return (dispatch) => {
    dispatch(createAction(PERFORM_SETUP)());

    return dispatch(refreshCurrentUser())
    .then((currentUser) => {

      // create initial notifications
      each(currentUser.invitations, i => {
        if (!i.accepted) {
          dispatch(addNotification({
            title: "Pending invitation",
            message: `${displayName(i.host)} has invited you to join <link>${i.team.name}</link>`,
            id: i.id,
            link: "/account/team",
          }));
        }
      });

      dispatch(setReady(true));
    })
    .catch(() => {
      dispatch(logout());
      dispatch(setReady(true));
    });
  };
};
