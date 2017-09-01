import { createAction } from "redux-actions";

import request, { ignoreFailure } from "util/http";

import {
  FETCH_VOTING_STATUS,
  SET_VOTING_STATUS,
} from "action-types";

export const setVotingStatus = createAction(SET_VOTING_STATUS);

export const fetchVotingStatus = () => {
  return dispatch => {
    dispatch(createAction(FETCH_VOTING_STATUS)());

    return request
    .get("/admin/competition/status")
    .then(response => {
      dispatch(setVotingStatus(response.data));
      return Promise.resolve(response.data);
    })
    .catch(ignoreFailure);
  };
};

export const openVoting = () => {
  return dispatch => {

    return request
    .post("/admin/competition/start_voting")
    .then(() => {
      dispatch(setVotingStatus(true));
      return Promise.resolve();
    })
    .catch(ignoreFailure);
  };
};

export const closeVoting = () => {
  return dispatch => {

    return request
    .post("/admin/competition/end_voting")
    .then(() => {
      dispatch(setVotingStatus(false));
      return Promise.resolve(false);
    })
    .catch(ignoreFailure);
  };
};
