import { createAction } from "redux-actions";

//
// Util
import request, { processSubmissionError } from "util/http";

//
// Redux
import {
  INVITE_USER_TO_TEAM,
  INVITE_USER_BY_EMAIL,
  REMOVE_FROM_TEAM,
  REVOKE_INVITE,
} from "action-types";
import { fetchTeam } from "actions/teams";
import { refreshCurrentUser } from "actions/current_user";

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

export const inviteUserByEmail = (email) => {
  return (dispatch) => {
    dispatch(createAction(INVITE_USER_BY_EMAIL)());

    return request
    .post("/invites", {
      invite: {
        email,
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

export const removeFromTeam = (id, teamId) => {
  return (dispatch) => {
    dispatch(createAction(REMOVE_FROM_TEAM)());

    return request
    .delete(`/teams/${teamId}/remove/${id}`)
    .then(() => {
      dispatch(fetchTeam(teamId));
      dispatch(refreshCurrentUser());

      return Promise.resolve();
    })
    .catch(error => Promise.reject(error));
  };
};
