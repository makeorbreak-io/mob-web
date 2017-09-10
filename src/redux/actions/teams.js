import { createAction } from "redux-actions";

//
// Util
import request, { requestFailed, submissionFailed } from "util/http";

// 
// Redux
import {
  FETCH_TEAMS,
  SET_TEAMS,
  CLEAR_TEAMS,
  FETCH_TEAM,
  CREATE_TEAM,
  UPDATE_TEAM,
  DELETE_TEAM,
  ADD_TEAM,
  REMOVE_TEAM,
} from "action-types";
import { refreshCurrentUser } from "actions/current_user";

const setTeams = createAction(SET_TEAMS);
const addTeam = createAction(ADD_TEAM);
const removeTeam = createAction(REMOVE_TEAM);

export const fetchTeams = (opts = {}) => {
  const o = { ...{ admin: false }, ...opts };

  return (dispatch) => {
    dispatch(createAction(FETCH_TEAMS)());

    return request
    .get(`${o.admin ? "/admin" : ""}/teams`)
    .then(response => {
      const { data } = response.data;
      dispatch(setTeams(data));

      return Promise.resolve(data);
    })
    .catch(requestFailed);
  };
};

export const clearTeams = createAction(CLEAR_TEAMS);

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
    .catch(requestFailed);
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
    .catch(submissionFailed);
  };
};

export const updateTeam = (id, values, opts = {}) => {
  const o = { ...{ admin: false }, ...opts };

  return (dispatch) => {
    dispatch(createAction(UPDATE_TEAM)());

    return request
    .put(`${o.admin ? "/admin" : ""}/teams/${id}`, { team: values })
    .then(response => {
      const { data } = response.data;
      dispatch(addTeam(data));

      return Promise.resolve(data);
    })
    .catch(submissionFailed);
  };
};

export const deleteTeam = (id, opts = {}) => {
  const o = { ...{ admin: false }, ...opts };

  return (dispatch) => {
    dispatch(createAction(DELETE_TEAM)());

    return request
    .delete(`${o.admin ? "/admin": ""}/teams/${id}`)
    .then(() => {
      dispatch(removeTeam(id));

      return Promise.resolve();
    })
    .catch(submissionFailed);
  };
};

export const disqualifyTeam = (id) => {
  return (dispatch) => {

    return request
    .post(`/admin/teams/${id}/disqualify`)
    .then(response => {
      const { data } = response.data;
      dispatch(addTeam(data));

      return Promise.resolve(data);
    })
    .catch(submissionFailed);
  };
};
