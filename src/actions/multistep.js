import { createAction } from "redux-actions";

import {
  ADD_FLOW,
  REMOVE_FLOW,
  FLOW_NEXT_STEP,
  FLOW_PREV_STEP,
  FLOW_SET_STEPS,
  FLOW_START,
  FLOW_END,
} from "action-types";

export const addFlow = createAction(ADD_FLOW);
export const removeFlow = createAction(REMOVE_FLOW);
export const flowNextStep = createAction(FLOW_NEXT_STEP);
export const flowPrevStep = createAction(FLOW_PREV_STEP);
export const flowSetSteps = createAction(FLOW_SET_STEPS);
export const flowStart = createAction(FLOW_START);
export const flowEnd = createAction(FLOW_END);
