import { createAction } from "redux-actions";
// import { each, isEmpty } from "lodash";

//
// Redux
import { refreshCurrentUser } from "actions/current_user";
import { logout } from "actions/authentication";
// import { addNotification } from "actions/notifications";

//
// Constants
import {
  SET_READY,
  PERFORM_SETUP,
} from "action-types";

// import {
//   TSHIRT_SIZE_NOTIFICATION_ID,
//   PRIZE_ORDER_NOTIFICATION_ID,
//   GITHUB_ACCOUNT_NOTIFICATION_ID,
// } from "constants/notifications";

//
// Actions
export const setReady = createAction(SET_READY);

export const performSetup = () => {
  return (dispatch) => {
    dispatch(createAction(PERFORM_SETUP)());

    return dispatch(refreshCurrentUser())
    .then(currentUser => {
      // // no t-shirt size selected
      // if (isEmpty(currentUser.tshirt_size)) {
      //   dispatch(addNotification({
      //     title: "T-Shirt size",
      //     message: "Make sure you <link>select your t-shirt size</link>!",
      //     id: TSHIRT_SIZE_NOTIFICATION_ID,
      //     link: "/profile",
      //   }));
      // }

      // // no prize preferences set
      // const { team } = currentUser;
      // 
      // if (team && team.applied && isEmpty(team.prize_preference)) {
      //   dispatch(addNotification({
      //     title: "Prize order preference",
      //     message: "Make sure you <link>select your team's prize order preferences</link>!",
      //     id: PRIZE_ORDER_NOTIFICATION_ID,
      //     link: "/account/team",
      //   }));
      // }

      // // no github account present
      // if (team && team.applied && isEmpty(currentUser.github_handle)) {
      //   dispatch(addNotification({
      //     title: "Github username",
      //     message: "Make sure you <link>add your github handle to your profile</link>, so we're able to provide you and your team with a repository for the project.",
      //     id: GITHUB_ACCOUNT_NOTIFICATION_ID,
      //     link: "/profile",
      //   }));
      // }

      dispatch(setReady(true));

      return currentUser;
    })
    .catch(() => {
      dispatch(logout());
      dispatch(setReady(true));
    });
  };
};
