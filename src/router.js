import React from "react";
import { Router, Route, IndexRoute, browserHistory } from "react-router";

//
// Top-level components
import App from "components/app";
import Authenticated from "core/authenticated";

import Home from "components/home";
import Signup from "components/signup";

import AccountSettings from "components/account_settings";

const router = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>

      <IndexRoute component={Home} />

      <Route path="signup" component={Signup} />

      <Route component={Authenticated}>
        <Route path="account">
          <Route path="settings" component={AccountSettings} />
        </Route>
      </Route>

    </Route>
  </Router>
);

export default router;
