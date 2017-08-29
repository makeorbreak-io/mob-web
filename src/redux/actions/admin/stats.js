import { createAction } from "redux-actions";

import request, { processSubmissionError } from "util/http";

import {
  FETCH_STATS_ADMIN,
  SET_STATS_ADMIN,
} from "action-types";

export const setStats= createAction(SET_STATS_ADMIN);

export const fetchStats = () => {
  return (dispatch) => {
    dispatch(createAction(FETCH_STATS_ADMIN)());

    return request
    .get("/admin/stats")
    .then(response => {
      const { data } = response.data;

      dispatch(setStats(data));

      return Promise.resolve(data);
    })
    .catch(error => Promise.reject(processSubmissionError(error)));
  };
};
