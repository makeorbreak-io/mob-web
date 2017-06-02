import React from "react";
import { Router, Route, IndexRoute, browserHistory } from "react-router";

//
// Top-level components
import App from "components/app";
import Authenticated from "core/authenticated";

import Home from "components/home";
import Login from "components/login";
import Signup from "components/signup";

import AccountSettings from "components/account_settings";
import { AccountTeam } from "components/account";
import Team from "components/team";

import UserOnboarding from "components/user_onboarding";

const router = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>

      <IndexRoute component={Home} />

      <Route path="signup" component={Signup} />
      <Route path="login" component={Login} />

      <Route component={Authenticated}>

        <Route path="welcome" component={UserOnboarding} />

        <Route path="account">
          <Route path="settings" component={AccountSettings} />
          <Route path="team" component={AccountTeam} />
        </Route>

      </Route>

      {/* Public routes */}
      <Route path="team/:id" component={({ location }) => (
        <Team id={location.query.id} />
      )} />

    </Route>
  </Router>
);

export default router;
