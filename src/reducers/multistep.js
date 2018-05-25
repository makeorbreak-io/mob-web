import { omit, isEmpty } from "lodash";

import {
  ADD_FLOW,
  REMOVE_FLOW,
  FLOW_NEXT_STEP,
  FLOW_PREV_STEP,
  FLOW_SET_STEPS,
  FLOW_START,
  FLOW_END,
} from "action-types";


export default function(state = {}, action) {
  const { type, payload } = action;
  const flow = state[payload] || {};
  const { steps, currentStep } = flow;

  const changeStep = (newStep) => {
    return {
      [payload]: {
        steps,
        currentStep: newStep,
      },
    };
  };

  switch (type) {
    case ADD_FLOW:
      return {
        ...state,
        ...{
          [payload.name]: {
            steps: payload.steps,
            currentStep: payload.initialStep || 0,
          },
        },
      };

    case REMOVE_FLOW:
      return omit(state, name => name === payload);

    case FLOW_NEXT_STEP:
      if (isEmpty(flow)) return state;

      return {
        ...state,
        ...changeStep(currentStep === steps - 1 ? currentStep : currentStep + 1),
      };

    case FLOW_PREV_STEP:
      if (isEmpty(flow)) return state;

      return {
        ...state,
        ...changeStep(currentStep === 0 ? currentStep : currentStep - 1),
      };

    case FLOW_START:
      if (isEmpty(flow)) return state;

      return {
        ...state,
        ...changeStep(0),
      };

    case FLOW_END:
      if (isEmpty(flow)) return state;

      return {
        ...state,
        ...changeStep(steps - 1),
      };

    case FLOW_SET_STEPS:
      return {
        ...state,
        [payload.name]: {
          ...state[payload.name],
          steps: payload.steps,
        },
      };

    default:
      return state;
  }
}
