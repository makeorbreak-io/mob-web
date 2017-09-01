import { createAction } from "redux-actions";

import request, { ignoreFailure } from "util/http";

import {
  FETCH_VOTING_INFO_BEGIN,
  SET_VOTING_INFO_BEGIN,
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
