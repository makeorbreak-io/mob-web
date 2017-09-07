import { createAction } from "redux-actions";

import request, { ignoreFailure, submissionFailed } from "util/http";

import { refreshCurrentUser } from "actions/current_user";

import {
  FETCH_WORKSHOPS,
  SET_WORKSHOPS,
  JOIN_WORKSHOP,
  LEAVE_WORKSHOP,
  CREATE_WORKSHOP,
  UPDATE_WORKSHOP,
  DELETE_WORKSHOP,
} from "action-types";

export const setWorkshops = createAction(SET_WORKSHOPS);

export const fetchWorkshops = (opts = {}) => {
  const o = { ...{ admin: false }, ...opts };

  return (dispatch) => {
    dispatch(createAction(FETCH_WORKSHOPS)());

    return request
    .get(`${o.admin ? "/admin" : ""}/workshops`)
    .then(response => {
      const workshops = response.data.data;

      dispatch(setWorkshops(workshops));

      return Promise.resolve(workshops);
    })
    .catch(ignoreFailure);
  };
};

export const joinWorkshop = (slug) => {
  return (dispatch) => {

    return request
    .post(`/workshops/${slug}/join`)
    .then(response => {
      const workshop = response.data.data;

      dispatch(createAction(JOIN_WORKSHOP)(slug));
      dispatch(refreshCurrentUser());

      return Promise.resolve(workshop);
    })
    .catch(submissionFailed);
  };
};

export const leaveWorkshop = (slug) => {
  return (dispatch) => {
    return request
    .delete(`/workshops/${slug}/leave`)
    .then(response => {
      const workshop = response.data.data;

      dispatch(createAction(LEAVE_WORKSHOP)(slug));
      dispatch(refreshCurrentUser());

      return Promise.resolve(workshop);
    })
    .catch(ignoreFailure);
  };
};

//
// Admin actions
//
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
    .catch(submissionFailed);
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
    .catch(submissionFailed);
  };
};

export const deleteWorkshop = (slug) => {
  return (dispatch) => {

    return request
    .delete(`/admin/workshops/${slug}`)
    .then(() => {
      dispatch(createAction(DELETE_WORKSHOP)(slug));
    })
    .catch(submissionFailed);
  };
};

//
// check in / presence
export const confirmPresenceInWorkshop = (workshopSlug, userId) => {
  return (dispatch) => {
    return request
    .post(`/admin/workshops/${workshopSlug}/checkin/${userId}`)
    .then(response => {
      const workshop = response.data.data;
      dispatch(createAction(UPDATE_WORKSHOP)(workshop));

      return Promise.resolve(workshop);
    })
    .catch(ignoreFailure);
  };
};

export const removePresenceFromWorkshop = (workshopSlug, userId) => {
  return (dispatch) => {
    return request
    .delete(`/admin/workshops/${workshopSlug}/checkin/${userId}`)
    .then(response => {
      const workshop = response.data.data;
      dispatch(createAction(UPDATE_WORKSHOP)(workshop));

      return Promise.resolve(workshop);
    })
    .catch(ignoreFailure);
  };
};
