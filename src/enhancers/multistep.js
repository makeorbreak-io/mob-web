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

import { connect } from "react-redux";

import store from "store";

import {
  addFlow,
  removeFlow,
  flowNextStep,
  flowPrevStep,
  flowSetSteps,
  flowStart,
  flowEnd,
} from "actions/multistep";

export default function(opts = {}) {
  const { name } = opts;

  if (!store.getState().multistep[name]) {
    store.dispatch(addFlow(opts));
  }

  return connect(({ multistep }) => {
    const flow = multistep[name] || {};

    return {
      initFlow: () => store.dispatch(addFlow(opts)),
      next: () => store.dispatch(flowNextStep(name)),
      prev: () => store.dispatch(flowPrevStep(name)),
      setSteps: (steps) => store.dispatch(flowSetSteps({ name, steps })),
      start: () => store.dispatch(flowStart(name)),
      end: () => store.dispatch(flowEnd(name)),
      discard: () => store.dispatch(removeFlow(name)),
      steps: flow.steps,
      currentStep: flow.currentStep || 0,
    };
  });
}
