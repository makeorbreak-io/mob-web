import Promise from "bluebird";
import { createAction } from "redux-actions";

//
// Util
import request, { processSubmissionError } from "util/http";

//
// Redux
import {
  INVITE_MEMBER,
  ADD_MEMBER,
} from "action-types";
import { fetchTeam } from "actions/teams";

export const addMember = createAction(ADD_MEMBER);

export const inviteMember = (userId) => {
  return (dispatch) => {
    dispatch(createAction(INVITE_MEMBER)());

    return request
    .post("/invites", {
      invite: {
        invitee_id: userId,
      },
    })
    .then(response => {
      const { data } = response.data;

      dispatch(fetchTeam(data.team.id));

      return Promise.resolve(data);
    })
    .catch(error => Promise.reject(processSubmissionError(error)));
  };
};
