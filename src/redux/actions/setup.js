import { createAction } from "redux-actions";
import { isNull } from "lodash";

//
// Redux
import { setCurrentUser } from "actions/current_user";
import { logout } from "actions/authentication";

//
// Constants
import {
  SET_READY,
  PERFORM_SETUP,
} from "action-types";

//
// Util
import request from "util/http";

//
// Actions
export const setReady = createAction(SET_READY);

export const performSetup = () => {
  return (dispatch) => {
    dispatch(createAction(PERFORM_SETUP)());

    return request
    .get("/me")
    .then(response => {
      const { data } = response.data;

      if (isNull(data))
        dispatch(logout());
      else
        dispatch(setCurrentUser(data));

      dispatch(setReady(true));
    })
    .catch(() => {
      dispatch(logout());
      dispatch(setReady(true));
    });
  };
};
