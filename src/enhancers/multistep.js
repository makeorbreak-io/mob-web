//
// multistep({
//   name: "user-onboarding",
//   steps: 3,
// })
//
// provides:
// props
//   .next        // func
//   .prev        // func
//   .start       // func
//   .end         // func
//   .discard     // func, should be called on componentWillUnmount
//   .currentStep // integer

import store from "redux-root/store";
import { connect } from "react-redux";

import {
  addFlow,
  removeFlow,
  flowNextStep,
  flowPrevStep,
  flowStart,
  flowEnd,
} from "actions/multistep";

export default function(opts = {}) {
  const { name } = opts;
  store.dispatch(addFlow(opts));

  return connect(({ multistep }) => {
    const flow = multistep[name] || {};

    return {
      next: () => store.dispatch(flowNextStep(name)),
      prev: () => store.dispatch(flowPrevStep(name)),
      start: () => store.dispatch(flowStart(name)),
      end: () => store.dispatch(flowEnd(name)),
      discard: () => store.dispatch(removeFlow(name)),
      currentStep: flow.currentStep || 0,
    };
  });
}
