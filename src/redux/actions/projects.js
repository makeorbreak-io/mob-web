import { createAction } from "redux-actions";

import request, { requestFailed, submissionFailed } from "util/http";

// 
// Redux
import {
  FETCH_PROJECTS,
  SET_PROJECTS,
  CLEAR_PROJECTS,
  CREATE_PROJECT,
  UPDATE_PROJECT,
  FETCH_PROJECT,
  ADD_PROJECT,
} from "action-types";

const setProjects = createAction(SET_PROJECTS);
const addProject = createAction(ADD_PROJECT);

export const fetchProjects = (opts = {}) => {
  const o = { ...{ admin: false }, ...opts };

  return (dispatch) => {
    dispatch(createAction(FETCH_PROJECTS)());

    return request
    .get(`${o.admin ? "/admin" : ""}/projects`)
    .then(response => {
      const { data } = response.data;
      dispatch(setProjects(data));

      return Promise.resolve(data);
    })
    .catch(requestFailed);
  };
};

export const clearProjects = createAction(CLEAR_PROJECTS);

export const fetchProject = (id) => {
  return (dispatch) => {
    dispatch(createAction(FETCH_PROJECT)());

    return request
    .get(`/projects/${id}`)
    .then(response => {
      const { data } = response.data;
      dispatch(addProject(data));

      return Promise.resolve(data);
    })
    .catch(requestFailed);
  };
};

export const createProject = (values) => {
  return (dispatch) => {
    dispatch(createAction(CREATE_PROJECT)());

    return request
    .post("/projects", { project: values })
    .then(response => {
      const { data } = response.data;
      dispatch(addProject(data));

      return Promise.resolve(data);
    })
    .catch(submissionFailed);
  };
};

export const updateProject = (id, values) => {
  return (dispatch) => {
    dispatch(createAction(UPDATE_PROJECT)());

    return request
    .put(`/projects/${id}`, { project: values })
    .then(response => {
      const { data } = response.data;
      dispatch(addProject(data));

      return Promise.resolve(data);
    })
    .catch(submissionFailed);
  };
};
