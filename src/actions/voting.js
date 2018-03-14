import { createAction } from "redux-actions";

import request, { ignoreFailure } from "lib/http";

import {
  FETCH_VOTING_INFO_BEGIN,
  SET_VOTING_INFO_BEGIN,
  FETCH_VOTING_INFO_END,
  SET_VOTING_INFO_END,
} from "action-types";

const setVotingInfoBegin = createAction(SET_VOTING_INFO_BEGIN);

export const infoBegin = () => {
  return dispatch => {
    dispatch(createAction(FETCH_VOTING_INFO_BEGIN)());

    return request
    .get("/voting/info_begin")
    .then(response => {
      dispatch(setVotingInfoBegin(response.data));
      return Promise.resolve(response.data);
    })
    .catch(ignoreFailure);
  };
};

const setVotingInfoEnd = createAction(SET_VOTING_INFO_END);

export const infoEnd = () => {
  return dispatch => {
    dispatch(createAction(FETCH_VOTING_INFO_END)());

    return request
    .get("/voting/info_end")
    .then(response => {
      dispatch(setVotingInfoEnd(response.data));
      return Promise.resolve(response.data);
    })
    .catch(ignoreFailure);
  };
};
