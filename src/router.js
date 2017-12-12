import React from "react";
import { Router, Route, IndexRoute, browserHistory } from "react-router";

//
// Top-level components
import App from "components/app";
import Authenticated from "core/authenticated";
import Authorized from "core/authorized";

//
// Public components
import Landing from "components/landing";
import Dashboard from "components/dashboard";
import { StandaloneLogin } from "components/login";
import { StandaloneSignup } from "components/signup";
import RecoverPassword from "components/recover_password";
import ResetPassword from "components/reset_password";

//
// Participant components
import UserOnboarding from "components/user_onboarding";
import UserChrome from "components/user_chrome";
import { AccountTeam } from "components/account";
import Team from "components/team";
import ParticipationCertificate from "components/participation_certificate";
// import VotingBooth from "components/voting_booth";

//
// Admin components
import AdminDashboard from "components/admin/dashboard";
import AdminUsers from "components/admin/users";
import AdminWorkshops from "components/admin/workshops";
import AdminEditWorkshop from "components/admin/workshops/edit";
import AdminTeams from "components/admin/teams";
import CheckIn from "components/admin/check_in";
import WorkshopCheckIn from "components/admin/workshop_check_in";
import PaperVotes from "components/admin/paper_votes";
import PrintablePaperVote from "components/admin/paper_votes/printable";

//
// Constants
import { PAGE_TRANSITION_MS } from "constants/globals";

//
//
const wait = (milis) => (prevState, nextState, replace, cb) => {
  if (prevState.location.pathname !== nextState.location.pathname) {
    setTimeout(cb, milis);
  }
  else {
    cb();
  }
};

const router = (
  <Router history={browserHistory}>
    <Route path="/" component={App} onChange={wait(PAGE_TRANSITION_MS)}>

      <IndexRoute component={Landing} />

      <Route component={Authenticated}>

        <Route path="welcome" component={UserOnboarding} />

        <Route component={UserChrome}>
          <Route path="dashboard" component={Dashboard} />

          <Route path="account">
            <Route path="team" component={AccountTeam} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route component={Authorized}>
          <Route path="admin">
            <IndexRoute component={AdminDashboard} />

            {/* Logistics */}
            <Route path="checkin" component={CheckIn} />
            <Route path="checkin/workshop/:slug" component={WorkshopCheckIn} />
            <Route path="paper-votes" component={PaperVotes} />

            {/* Analytics */}
            <Route path="users" component={AdminUsers} />
            <Route path="workshops" component={AdminWorkshops} />
            <Route path="workshops/:slug" component={AdminEditWorkshop} />
            <Route path="teams" component={AdminTeams} />
          </Route>
        </Route>

      </Route>

      {/* Public routes */}
      <Route path="team/:id" component={({ params }) => (
        <Team id={params.id} />
      )} />

      <Route path="signin" component={StandaloneLogin} />
      <Route path="signup" component={StandaloneSignup} />
      <Route path="recover-password" component={RecoverPassword} />
      <Route path="recover-password/:token" component={ResetPassword} />
    </Route>

    <Route path="/participation-certificate" component={(props) =>
      <ParticipationCertificate idNumber={props.location.query.id_number} print />
    }/>

    <Route path="/print-paper-vote" component={({ location: { query }})=>
      <PrintablePaperVote id={query.id} category={query.category} />
    }/>

  </Router>
);

export default router;
