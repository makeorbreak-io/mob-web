import { createAction } from "redux-actions";

import request, { processSubmissionError } from "util/http";

// 
// Redux
import {
  CREATE_PROJECT,
  UPDATE_PROJECT,
  FETCH_PROJECT,
  ADD_PROJECT,
} from "action-types";

const addProject = createAction(ADD_PROJECT);

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
    .catch(error => Promise.reject(processSubmissionError(error)));
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
    .catch(error => Promise.reject(processSubmissionError(error)));
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
    .catch(error => Promise.reject(processSubmissionError(error)));
  };
};
