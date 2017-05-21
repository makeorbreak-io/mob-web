import Promise from "bluebird";
import { createAction } from "redux-actions";

import request, { processSubmissionError } from "util/http";

// 
// Redux
import {
  CREATE_TEAM,
  UPDATE_TEAM,
  FETCH_TEAM,
  SET_TEAM,
} from "action-types";

const setTeam = createAction(SET_TEAM);

export const fetchTeam = (id) => {
  return (dispatch) => {
    dispatch(createAction(FETCH_TEAM)());

    return request
    .get(`/teams/${id}`)
    .then(response => {
      const { data } = response.data;
      dispatch(setTeam(data));

      return Promise.resolve(data);
    })
    .catch(error => Promise.reject(processSubmissionError(error)));
  }
}

export const createTeam = (values) => {
  return (dispatch) => {
    dispatch(createAction(CREATE_TEAM)());

    return request
    .post("/teams", { team: values })
    .then(response => {
      const { data } = response.data;
      dispatch(setTeam(data));

      return Promise.resolve(data);
    })
    .catch(error => Promise.reject(processSubmissionError(error)));
  }
}

export const updateTeam = (id, values) => {
  return (dispatch) => {
    dispatch(createAction(UPDATE_TEAM)());

    return request
    .put(`/teams/${id}`, { team: values })
    .then(response => {
      const { data } = response.data;
      dispatch(setTeam(data));

      return Promise.resolve(data)
    })
    .catch(error => Promise.reject(processSubmissionError(error)));
  }
}