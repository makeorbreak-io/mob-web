import uuid from "uuid";
import { createAction } from "redux-actions";

import {
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  CLEAR_NOTIFICATIONS,
} from "action-types";

export const addNotification = createAction(ADD_NOTIFICATION, (params = {}) => {
  return {
    // defaults
    title: "",
    message: "",
    link: null,
    sticky: false,
    id: uuid.v4(),

    // user options
    ...params,
  };
});
export const removeNotification = createAction(REMOVE_NOTIFICATION);
export const clearNotifications = createAction(CLEAR_NOTIFICATIONS);

