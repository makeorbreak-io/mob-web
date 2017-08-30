import { createAction } from "redux-actions";

//
// Util
import request, { submissionFailed } from "util/http";

//
// Redux
import {
  ACCEPT_INVITE,
  REJECT_INVITE,
} from "action-types";

import { refreshCurrentUser } from "actions/current_user";
import { removeNotification } from "actions/notifications";

export const acceptInvite = (id) => {
  return (dispatch) => {
    dispatch(createAction(ACCEPT_INVITE)(id));

    return request
    .put(`/invites/${id}/accept`)
    .then(() => {
      dispatch(refreshCurrentUser());
      dispatch(removeNotification(id));
    })
    .catch(submissionFailed);
  };
};


export const rejectInvite = (id) => {
  return (dispatch) => {
    dispatch(createAction(REJECT_INVITE)(id));

    return request
    .delete(`/invites/${id}`)
    .then(() => {
      dispatch(refreshCurrentUser());
      dispatch(removeNotification(id));
    })
    .catch(submissionFailed);
  };
};
