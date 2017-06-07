import { createAction } from "redux-actions";
import { each } from "lodash";

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

//
// Actions
export const setReady = createAction(SET_READY);

export const performSetup = () => {
  return (dispatch) => {
    dispatch(createAction(PERFORM_SETUP)());

    return dispatch(refreshCurrentUser())
    .then(currentUser => {

      // create initial notifications
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

      dispatch(setReady(true));

      return Promise.resolve(currentUser);
    })
    .catch((error) => {
      dispatch(logout());
      dispatch(setReady(true));

      return Promise.reject(error);
    });
  };
};
