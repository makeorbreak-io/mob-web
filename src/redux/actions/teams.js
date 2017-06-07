import { createAction } from "redux-actions";

//
// Util
import request, { processSubmissionError } from "util/http";

// 
// Redux
import {
  FETCH_TEAM,
  CREATE_TEAM,
  UPDATE_TEAM,
  DELETE_TEAM,
  ADD_TEAM,
  REMOVE_TEAM,
} from "action-types";
import { refreshCurrentUser } from "actions/current_user";

const failureCallback = (error) => Promise.reject(processSubmissionError(error));

const addTeam = createAction(ADD_TEAM);
const removeTeam = createAction(REMOVE_TEAM);

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
    .catch(failureCallback);
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
    .catch(failureCallback);
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
    .catch(failureCallback);
  };
};

export const deleteTeam = (id) => {
  return (dispatch) => {
    dispatch(createAction(DELETE_TEAM)());

    return request
    .delete(`/teams/${id}`)
    .then(() => {
      dispatch(removeTeam(id));

      return Promise.resolve();
    })
    .catch(failureCallback);
  };
};
