import React from "react";
import { Router, Route, IndexRoute, browserHistory } from "react-router";

//
// Top-level components
import App from "components/app";
import Authenticated from "core/authenticated";
import Authorized from "core/authorized";

//
//
import Home from "components/home";
import { StandaloneLogin } from "components/login";
import { StandaloneSignup } from "components/signup";

//
// App-level components
import UserOnboarding from "components/user_onboarding";
import AccountSettings from "components/account_settings";
import { AccountTeam } from "components/account";
import Team from "components/team";

//
// Admin components
import AdminDashboard from "components/admin/dashboard";
import UserList from "components/admin/user_list";

const router = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>

      <IndexRoute component={Home} />

      <Route component={Authenticated}>

        <Route path="welcome" component={UserOnboarding} />

        <Route path="account">
          <Route path="settings" component={AccountSettings} />
          <Route path="team" component={AccountTeam} />
        </Route>

        {/* Admin routes */}
        <Route component={Authorized}>
          <Route path="admin">
            <IndexRoute component={AdminDashboard} />
            <Route path="users" component={UserList} />
          </Route>
        </Route>

      </Route>

      {/* Public routes */}
      <Route path="team/:id" component={({ params }) => (
        <Team id={params.id} />
      )} />

      <Route path="signin" component={StandaloneLogin} />
      <Route path="signup" component={StandaloneSignup} />
    </Route>
  </Router>
);

export default router;
