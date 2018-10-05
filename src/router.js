import React from "react";
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from "react-router";

//
// Top-level components
import App from "components/App";
import Authenticated from "components/Authenticated";
import Authorized from "components/Authorized";

//
// Public components
import Landing from "components/Landing";
import Dashboard from "components/Dashboard";
import Login from "components/Login";
import Signup from "components/Signup";
import RecoverPassword from "components/RecoverPassword";
import ResetPassword from "components/ResetPassword";

import Fly from "components/Fly";

//
// Participant components
import UserOnboarding from "components/UserOnboarding";
import UserChrome from "components/UserChrome";
import AccountTeam from "components/AccountTeam";
import Team from "components/Team";
import ParticipationCertificate from "components/ParticipationCertificate";
import Privacy from "components/UserOnboarding.Privacy";

//
// Admin components
import Admin from "components/Admin";
import AdminDashboard from "components/admin/Dashboard";
import AdminUsers from "components/admin/Users";
import AdminTeams from "components/admin/Teams";
import AdminCompetitions from "components/admin/Competitions";
import AdminVoting from "components/admin/Voting";
import AdminEmails from "components/admin/Emails";

import AdminEditEmail from "components/admin/Emails.Edit";
import AdminMissingVoters from "components/admin/MissingVoters";
import AdminWorkshops from "components/admin/Workshops";
import AdminEditWorkshop from "components/admin/Workshops.Edit";
import AdminBots from "components/admin/Bots";
import AdminBotsRun from "components/admin/Bots.Run";
import AdminGamesRun from "components/admin/Games";
import AdminCheckIn from "components/admin/CheckIn";
import WorkshopCheckIn from "components/admin/WorkshopCheckIn";
import PaperVotes from "components/admin/PaperVotes";
import PrintablePaperVote from "components/admin/PaperVotes.Printable";
import AdminAIGameViewer from "components/admin/AIGameViewer.js";

//
// Constants
import { PAGE_TRANSITION_MS } from "constants/globals";

//
//
// const wait = (milis) => (prevState, nextState, replace, cb) => {
//   if (prevState.location.pathname !== nextState.location.pathname) {
//     setTimeout(cb, milis);
//   }
//   else {
//     cb();
//   }
// };

const wait = () => () => {};

const router = (
  <Router history={browserHistory}>
    <Route path="/" component={App} onChange={wait(PAGE_TRANSITION_MS)}>

      <Route path="/fly" component={Fly} />

      <IndexRoute component={Landing} />

      <Route component={Authenticated}>

        <Route path="welcome" component={UserOnboarding} />

        <Route component={UserChrome}>
          <Route path="dashboard" component={Dashboard} />

          <Route path="account">
            <Route path="team" component={AccountTeam} />
            <Route path="privacy" component={Privacy} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route component={Authorized}>
          <Route path="admin" component={Admin}>
            <IndexRedirect to="/admin/dashboard" />

            <Route path="dashboard" component={AdminDashboard} />
            <Route path="users" component={AdminUsers} />
            <Route path="teams" component={AdminTeams} />
            <Route path="competitions" component={AdminCompetitions} />
            <Route path="voting" component={AdminVoting} />
            <Route path="workshops" component={AdminWorkshops} />
            <Route path="workshops/:slug" component={AdminEditWorkshop} />
            <Route path="emails" component={AdminEmails} />
            <Route path="emails/:id" component={AdminEditEmail} />

            <Route path="checkin" component={AdminCheckIn} />
            <Route path="checkin/workshop/:slug" component={WorkshopCheckIn} />
            <Route path="paper-votes" component={PaperVotes} />

            <Route path="missing-voters" component={AdminMissingVoters} />
            <Route path="bots" component={AdminBots} />
            <Route path="bots/:day" component={AdminBotsRun} />
            <Route path="games/:day" component={AdminGamesRun} />
            <Route path="ai-game-viewer" component={AdminAIGameViewer} />
          </Route>
        </Route>

      </Route>

      {/* Public routes */}
      <Route path="team/:id" component={({ params }) => (
        <Team id={params.id} />
      )} />

      <Route path="signin" component={Login} />
      <Route path="signup" component={Signup} />
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
