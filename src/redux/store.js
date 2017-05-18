import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import persistState from "redux-localstorage";

import appReducer from "redux-root/reducers/app";

const store = createStore(appReducer, compose(
  persistState("jwt"),
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

export default store;
