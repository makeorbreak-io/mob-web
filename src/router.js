import React from "react";
import { Router, Route, IndexRoute, browserHistory } from "react-router";

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
import Projects from "components/Projects";
import Project from "components/Project.Static";

//
// Participant components
import UserOnboarding from "components/UserOnboarding";
import UserChrome from "components/UserChrome";
import AccountTeam from "components/AccountTeam";
import Team from "components/Team";
import ParticipationCertificate from "components/ParticipationCertificate";
import AIDashboard from "components/AIDashboard";
// import VotingBooth from "components/VotingBooth";
import EditableProject from "components/Project.Editable";

//
// Admin components
import AdminDashboard from "components/admin/Dashboard";
import AdminUsers from "components/admin/Users";
import AdminWorkshops from "components/admin/Workshops";
import AdminEditWorkshop from "components/admin/Workshops.Edit";
import AdminBots from "components/admin/Bots";
import AdminBotsRun from "components/admin/Bots.Run";
import AdminTeams from "components/admin/Teams";
import CheckIn from "components/admin/CheckIn";
import WorkshopCheckIn from "components/admin/WorkshopCheckIn";
import PaperVotes from "components/admin/PaperVotes";
import PrintablePaperVote from "components/admin/PaperVotes.Printable";

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

      <Route path="/fly" component={Fly} />

      <IndexRoute component={Landing} />

      <Route component={Authenticated}>

        <Route path="welcome" component={UserOnboarding} />

        <Route component={UserChrome}>
          <Route path="dashboard" component={Dashboard} />
          <Route path="ai-competition" component={AIDashboard} />
          {/*<Route path="vote" component={VotingBooth} />*/}

          <Route path="account">
            <Route path="team" component={AccountTeam} />
          </Route>
        </Route>

        <Route path="projects" component={Projects} />
        <Route path="project">
          <Route path="edit" component={EditableProject} />
          <Route path=":id" component={props => <Project id={props.params.id} />} />
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
            <Route path="bots" component={AdminBots} />
            <Route path="bots/:day" component={AdminBotsRun} />
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
