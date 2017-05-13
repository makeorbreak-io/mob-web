import React from "react";
import { Router, Route, browserHistory } from "react-router";

//
// Top-level components
import App from "components/app";

const router = (
  <Router history={browserHistory}>
    <Route path="/" component={App} />
  </Router>
);

export default router;
