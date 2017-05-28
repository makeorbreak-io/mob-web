import Promise from "bluebird";
import { createAction } from "redux-actions";

//
// Util
import request, { processSubmissionError } from "util/http";

//
// Redux
import {
  INVITE_USER_TO_TEAM,
  REVOKE_INVITE,
} from "action-types";
import { fetchTeam } from "actions/teams";

export const inviteUserToTeam = (userId) => {
  return (dispatch) => {
    dispatch(createAction(INVITE_USER_TO_TEAM)());

    return request
    .post("/invites", {
      invite: {
        invitee_id: userId,
      },
    })
    .then(response => {
      const { data } = response.data;

      return dispatch(fetchTeam(data.team.id))
      .then(() => Promise.resolve(data));
    })
    .catch(error => Promise.reject(processSubmissionError(error)));
  };
};

export const revokeInvite = (id, teamId) => {
  return (dispatch) => {
    dispatch(createAction(REVOKE_INVITE)());

    return request
    .delete(`/invites/${id}`)
    .then(() => dispatch(fetchTeam(teamId)))
    .catch(error => Promise.reject(processSubmissionError(error)));
  };
};
