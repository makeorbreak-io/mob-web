import { createAction } from "redux-actions";
import { noop } from "lodash";

import request, { processSubmissionError } from "util/http";

import {
  FETCH_WORKSHOPS,
  SET_WORKSHOPS,
  CREATE_WORKSHOP,
  UPDATE_WORKSHOP,
  DELETE_WORKSHOP,
} from "action-types";

export const setWorkshops = createAction(SET_WORKSHOPS);

export const fetchWorkshops = () => {
  return (dispatch) => {
    dispatch(createAction(FETCH_WORKSHOPS)());

    return request
    .get("/admin/workshops")
    .then(response => {
      const workshops = response.data.data;

      dispatch(setWorkshops(workshops));

      return Promise.resolve(workshops);
    })
    .catch(noop);
  };
};

export const createWorkshop = (params) => {
  return (dispatch) => {

    return request
    .post("/admin/workshops", {
      workshop: params,
    })
    .then(response => {
      const workshop = response.data.data;
      dispatch(createAction(CREATE_WORKSHOP)(workshop));

      return Promise.resolve(workshop);
    })
    .catch(error => Promise.reject(processSubmissionError(error)));
  };
};

export const updateWorkshop = (slug, params) => {
  return (dispatch) => {

    return request
    .put(`/admin/workshops/${slug}`, {
      workshop: params,
    })
    .then(response => {
      const workshop = response.data.data;
      dispatch(createAction(UPDATE_WORKSHOP)(workshop));

      return Promise.resolve(workshop);
    })
    .catch(error => Promise.reject(processSubmissionError(error)));
  };
};

export const deleteWorkshop = (slug) => {
  return (dispatch) => {

    return request
    .delete(`/admin/workshops/${slug}`)
    .then(() => {
      dispatch(createAction(DELETE_WORKSHOP)(slug));
    })
    .catch(error => Promise.reject(processSubmissionError(error)));
  };
};
