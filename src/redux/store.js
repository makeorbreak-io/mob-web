import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import persistState from "redux-localstorage";

import appReducer from "redux-root/reducers/app";

const store = createStore(appReducer, { }, compose(
  applyMiddleware(thunkMiddleware),
  persistState("jwt"),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

export default store;
