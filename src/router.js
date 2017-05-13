import React from "react";
import { Router, Route, browserHistory } from "react-router";

//
// Top-level components
import App from "components/app";

//
// Registration
import Signup from "components/signup";

const router = (
  <Router history={browserHistory}>
    <Route path="/" component={App} />
    <Route path="/signup" component={Signup} />
  </Router>
);

export default router;
