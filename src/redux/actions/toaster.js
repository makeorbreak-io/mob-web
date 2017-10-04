import uuid from "uuid";
import { createAction } from "redux-actions";

import {
  ADD_TOAST,
  REMOVE_TOAST,
  CLEAR_TOASTS,
} from "action-types";

export const removeToast = createAction(REMOVE_TOAST);
export const clearToasts = createAction(CLEAR_TOASTS);

export const addToast = (params = {}) => {
  return dispatch => {
    const toast = {
      // defaults
      content: "",
      sticky: false,
      duration: 2000,
      id: uuid.v4(),

      // user options
      ...params,
    };

    dispatch(createAction(ADD_TOAST)(toast));

    window.setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, toast.duration);

    return Promise.resolve();
  };
};
