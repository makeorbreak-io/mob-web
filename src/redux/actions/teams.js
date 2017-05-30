import { createAction } from "redux-actions";

//
// Util
import request, { processSubmissionError } from "util/http";

// 
// Redux
import {
  CREATE_TEAM,
  UPDATE_TEAM,
  FETCH_TEAM,
  ADD_TEAM,
} from "action-types";
import { refreshCurrentUser } from "actions/current_user";

const addTeam = createAction(ADD_TEAM);

export const fetchTeam = (id) => {
  return (dispatch) => {
    dispatch(createAction(FETCH_TEAM)());

    return request
    .get(`/teams/${id}`)
    .then(response => {
      const { data } = response.data;
      dispatch(addTeam(data));

      return Promise.resolve(data);
    })
    .catch(error => Promise.reject(processSubmissionError(error)));
  };
};

export const createTeam = (values) => {
  return (dispatch) => {
    dispatch(createAction(CREATE_TEAM)());

    return request
    .post("/teams", { team: values })
    .then(response => {
      const { data } = response.data;

      dispatch(addTeam(data));
      dispatch(refreshCurrentUser());

      return Promise.resolve(data);
    })
    .catch(error => Promise.reject(processSubmissionError(error)));
  };
};

export const updateTeam = (id, values) => {
  return (dispatch) => {
    dispatch(createAction(UPDATE_TEAM)());

    return request
    .put(`/teams/${id}`, { team: values })
    .then(response => {
      const { data } = response.data;
      dispatch(addTeam(data));

      return Promise.resolve(data);
    })
    .catch(error => Promise.reject(processSubmissionError(error)));
  };
};
